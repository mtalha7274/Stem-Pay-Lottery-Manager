// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";

abstract contract VRFConsumerBaseV2_5Upgradeable is Initializable {
    error OnlyCoordinatorCanFulfill(address have, address want);

    address private vrfCoordinator;

    function __VRFConsumerBaseV2_5Upgradeable_init(address _vrfCoordinator) internal onlyInitializing {
        vrfCoordinator = _vrfCoordinator;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal virtual;

    function rawFulfillRandomWords(uint256 requestId, uint256[] memory randomWords) external {
        if (msg.sender != vrfCoordinator) {
            revert OnlyCoordinatorCanFulfill(msg.sender, vrfCoordinator);
        }
        fulfillRandomWords(requestId, randomWords);
    }
}

contract StemPayLotteryManager is
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuard,
    UUPSUpgradeable,
    VRFConsumerBaseV2_5Upgradeable
{
    struct Lottery {
        address tokenAddress;
        uint256 participationFee;
        uint256 refundableAmount;
        uint256 maxParticipants;
        uint256 drawTime;
        uint256 prizeAmount;
        uint256 feeToInvestment;
        uint256 feeToProfit;
        bool isActive;
        bool isDrawn;
        bool isCancelled;
        address[] participants;
        address winner;
        uint256 voteCount;
        mapping(address => uint256) entryCount;
        mapping(address => bool) hasClaimed;
        mapping(address => bool) hasRefunded;
        mapping(address => bool) hasVotedCancel;
    }

    struct LotteryInfo {
        address tokenAddress;
        uint256 participationFee;
        uint256 refundableAmount;
        uint256 maxParticipants;
        uint256 drawTime;
        uint256 prizeAmount;
        uint256 feeToInvestment;
        uint256 feeToProfit;
        bool isActive;
        bool isDrawn;
        bool isCancelled;
        address winner;
        uint256 voteCount;
        address[] participants;
    }


    mapping(uint256 => Lottery) public lotteries;
    uint256 public lotteryCounter;

    address public investmentWallet;
    address public profitWallet;

    bytes32 public keyHash;
    uint32 public callbackGasLimit;
    uint16 public requestConfirmations;
    uint32 public numWords;
    uint256 public subscriptionId;
    address public vrfCoordinator;

    uint256[] public allLotteryIds;

    mapping(uint256 => uint256) public requestToLottery;

    event LotteryCreated(uint256 lotteryId);
    event EnteredLottery(uint256 lotteryId, address user);
    event LotteryDrawRequested(uint256 lotteryId, uint256 requestId);
    event WinnerSelected(uint256 lotteryId, address winner);
    event LotteryCancelled(uint256 lotteryId);

    function initialize(
        address _vrfCoordinator,
        bytes32 _keyHash,
        uint256 _subId,
        address _investmentWallet,
        address _profitWallet
    ) external initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __VRFConsumerBaseV2_5Upgradeable_init(_vrfCoordinator);

        vrfCoordinator = _vrfCoordinator;
        keyHash = _keyHash;
        subscriptionId = _subId;
        callbackGasLimit = 200_000;
        requestConfirmations = 3;
        numWords = 1;

        investmentWallet = _investmentWallet;
        profitWallet = _profitWallet;
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function createLottery(
        address _tokenAddress,
        uint256 _participationFee,
        uint256 _refundableAmount,
        uint256 _maxParticipants,
        uint256 _drawTime,
        uint256 _prizeAmount,
        uint256 _feeToInvestment,
        uint256 _feeToProfit
    ) external onlyOwner {
        require(_participationFee >= _refundableAmount, "Refund <= fee");
        require(_drawTime > block.timestamp, "Invalid draw time");

        lotteryCounter++;
        Lottery storage l = lotteries[lotteryCounter];
        l.tokenAddress = _tokenAddress;
        l.participationFee = _participationFee;
        l.refundableAmount = _refundableAmount;
        l.maxParticipants = _maxParticipants;
        l.drawTime = _drawTime;
        l.prizeAmount = _prizeAmount;
        l.feeToInvestment = _feeToInvestment;
        l.feeToProfit = _feeToProfit;
        l.isActive = true;

        allLotteryIds.push(lotteryCounter); // ✅ track this lottery for later reference

        emit LotteryCreated(lotteryCounter);
    }


    function enterLottery(uint256 _lotteryId) external nonReentrant {
        Lottery storage l = lotteries[_lotteryId];
        require(l.isActive && !l.isCancelled, "Inactive or cancelled");
        require(l.participants.length < l.maxParticipants, "Max participants");
        
        // Allow entries after draw time only if there aren't enough participants
        if (block.timestamp >= l.drawTime) {
            require(l.participants.length < l.maxParticipants, "Lottery closed - max participants reached");
        }

        IERC20(l.tokenAddress).transferFrom(msg.sender, address(this), l.participationFee);

        l.participants.push(msg.sender);
        l.entryCount[msg.sender]++;

        emit EnteredLottery(_lotteryId, msg.sender);
    }

    function voteCancel(uint256 _lotteryId) external {
        Lottery storage l = lotteries[_lotteryId];
        require(!l.hasVotedCancel[msg.sender], "Already voted");
        require(l.entryCount[msg.sender] > 0, "Not in lottery");

        l.hasVotedCancel[msg.sender] = true;
        l.voteCount++;
        if (l.voteCount * 3 >= l.participants.length * 2) {
            l.isCancelled = true;
            emit LotteryCancelled(_lotteryId);
        }
    }

    function drawWinner(uint256 _lotteryId) external onlyOwner {
        Lottery storage l = lotteries[_lotteryId];
        require(!l.isDrawn && !l.isCancelled, "Already drawn or cancelled");
        require(l.participants.length > 0, "No participants");
        
        // Check if we have enough participants
        require(l.participants.length >= l.maxParticipants, 
            string(abi.encodePacked("Currently ", 
                Strings.toString(l.participants.length), 
                " people but ", 
                Strings.toString(l.maxParticipants), 
                " are required")));

        uint256 requestId = IVRFCoordinatorV2Plus(vrfCoordinator).requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: keyHash,
                subId: subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({ nativePayment: false })
                )
            })
        );

        requestToLottery[requestId] = _lotteryId;
        l.isDrawn = true;

        emit LotteryDrawRequested(_lotteryId, requestId);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 lotteryId = requestToLottery[requestId];
        Lottery storage l = lotteries[lotteryId];

        require(l.isDrawn && l.winner == address(0), "Already fulfilled");

        uint256 winnerIndex = randomWords[0] % l.participants.length;
        l.winner = l.participants[winnerIndex];

        IERC20 token = IERC20(l.tokenAddress);
        token.transfer(investmentWallet, l.feeToInvestment);
        token.transfer(profitWallet, l.feeToProfit);

        emit WinnerSelected(lotteryId, l.winner);
    }

    function cancelLottery(uint256 _lotteryId) external onlyOwner {
        Lottery storage l = lotteries[_lotteryId];
        require(!l.isCancelled && !l.isDrawn, "Already finalized");
        l.isCancelled = true;
        emit LotteryCancelled(_lotteryId);
    }

    function claimRefund(uint256 _lotteryId) external nonReentrant {
        Lottery storage l = lotteries[_lotteryId];
        require(l.isCancelled || (l.isDrawn && l.winner != msg.sender), "Not eligible");
        require(!l.hasRefunded[msg.sender], "Already refunded");
        require(l.entryCount[msg.sender] > 0, "No entries");

        l.hasRefunded[msg.sender] = true;
        uint256 amount = l.refundableAmount * l.entryCount[msg.sender];
        IERC20(l.tokenAddress).transfer(msg.sender, amount);
    }

    function claimPrize(uint256 _lotteryId) external nonReentrant {
        Lottery storage l = lotteries[_lotteryId];
        require(l.winner == msg.sender, "Not winner");
        require(!l.hasClaimed[msg.sender], "Already claimed");

        l.hasClaimed[msg.sender] = true;
        IERC20(l.tokenAddress).transfer(msg.sender, l.prizeAmount);
    }

    function clearLotteryData(uint256 _lotteryId) external onlyOwner {
        delete lotteries[_lotteryId];
    }

    function getParticipants(uint256 _lotteryId) external view returns (address[] memory) {
        return lotteries[_lotteryId].participants;
    }

    function migrateToLottery(uint256 fromId, uint256 toId) external nonReentrant {
        Lottery storage fromL = lotteries[fromId];
        Lottery storage toL = lotteries[toId];

        require(fromL.entryCount[msg.sender] > 0, "Not in old");
        require(!fromL.hasRefunded[msg.sender], "Refunded already");
        require(fromL.isCancelled || (fromL.isDrawn && fromL.winner != msg.sender), "Old not eligible");

        require(toL.isActive && !toL.isCancelled, "New lottery inactive");
        require(block.timestamp < toL.drawTime, "Too late for new");

        fromL.hasRefunded[msg.sender] = true;

        uint256 topUp = toL.participationFee - toL.refundableAmount;
        IERC20(toL.tokenAddress).transferFrom(msg.sender, address(this), topUp);

        toL.participants.push(msg.sender);
        toL.entryCount[msg.sender]++;

        emit EnteredLottery(toId, msg.sender);
    }

    function getAllLotteryIds() external view returns (uint256[] memory) {
        return allLotteryIds;
    }

    function getEntryCount(uint256 lotteryId, address user) external view returns (uint256) {
        return lotteries[lotteryId].entryCount[user];
    }

    function hasUserRefunded(uint256 lotteryId, address user) external view returns (bool) {
        return lotteries[lotteryId].hasRefunded[user];
    }

    function hasUserClaimed(uint256 lotteryId, address user) external view returns (bool) {
        return lotteries[lotteryId].hasClaimed[user];
    }

    function hasUserVotedCancel(uint256 lotteryId, address user) external view returns (bool) {
        return lotteries[lotteryId].hasVotedCancel[user];
    }

    function getActiveLotteries() external view returns (uint256[] memory) {
        uint256[] memory temp = new uint256[](allLotteryIds.length);
        uint256 count = 0;

        for (uint256 i = 0; i < allLotteryIds.length; i++) {
            uint256 id = allLotteryIds[i];
            Lottery storage l = lotteries[id];

            if (l.isActive && !l.isCancelled && block.timestamp < l.drawTime) {
                temp[count] = id;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            result[j] = temp[j];
        }

        return result;
    }

    function getLotteryInfo(uint256 _lotteryId) external view returns (LotteryInfo memory info) {
        Lottery storage l = lotteries[_lotteryId];
        info = LotteryInfo({
            tokenAddress: l.tokenAddress,
            participationFee: l.participationFee,
            refundableAmount: l.refundableAmount,
            maxParticipants: l.maxParticipants,
            drawTime: l.drawTime,
            prizeAmount: l.prizeAmount,
            feeToInvestment: l.feeToInvestment,
            feeToProfit: l.feeToProfit,
            isActive: l.isActive,
            isDrawn: l.isDrawn,
            isCancelled: l.isCancelled,
            winner: l.winner,
            voteCount: l.voteCount,
            participants: l.participants
        });
    }


    function getUserLotteryData(uint256 lotteryId, address user)
        external
        view
        returns (
            uint256 entryCount,
            bool hasClaimed,
            bool hasRefunded,
            bool hasVotedCancel
        )
    {
        Lottery storage l = lotteries[lotteryId];
        return (
            l.entryCount[user],
            l.hasClaimed[user],
            l.hasRefunded[user],
            l.hasVotedCancel[user]
        );
    }
}