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
        uint256 maxParticipants;
        uint256 drawTime;
        uint256 prizePercentage;
        uint256 investmentPercentage;
        uint256 profitPercentage;
        bool isActive;
        bool isDrawn;
        bool isCancelled;
        address[] participants;
        address winner;
        uint256 voteCount;
        uint256 drawTimestamp;
        mapping(address => uint256) entryCount;
        mapping(address => bool) hasWithdrawn;
        mapping(address => bool) hasVotedCancel;
    }

    struct LotteryInfo {
        address tokenAddress;
        uint256 participationFee;
        uint256 maxParticipants;
        uint256 drawTime;
        uint256 prizePercentage;
        uint256 investmentPercentage;
        uint256 profitPercentage;
        bool isActive;
        bool isDrawn;
        bool isCancelled;
        address winner;
        uint256 voteCount;
        uint256 drawTimestamp;
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

    uint256[] public activeLotteryIds;
    uint256[] public drawnLotteryIds;

    mapping(uint256 => uint256) public requestToLottery;

    uint256 constant REFUND_PERIOD = 60 days;

    event LotteryCreated(uint256 lotteryId);
    event EnteredLottery(uint256 lotteryId, address user);
    event LotteryDrawRequested(uint256 lotteryId, uint256 requestId);
    event WinnerSelected(uint256 lotteryId, address winner);
    event LotteryCancelled(uint256 lotteryId);
    event FundsWithdrawn(uint256 lotteryId, address user, uint256 amount);
    event LotteryAutoDeleted(uint256 lotteryId);

    function initialize(
        address _vrfCoordinator,
        bytes32 _keyHash,
        uint256 _subId,
        address _investmentWallet,
        address _profitWallet
    ) external initializer {
        require(_vrfCoordinator != address(0), "Invalid VRF coordinator");
        require(_investmentWallet != address(0), "Invalid investment wallet");
        require(_profitWallet != address(0), "Invalid profit wallet");
        require(_keyHash != bytes32(0), "Invalid key hash");
        require(_subId > 0, "Invalid subscription ID");
        
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
        uint256 _maxParticipants,
        uint256 _drawTime,
        uint256 _prizePercentage,
        uint256 _investmentPercentage,
        uint256 _profitPercentage
    ) external onlyOwner {
        require(_tokenAddress != address(0), "Invalid token address");
        require(_participationFee > 0, "Fee must be > 0");
        require(_maxParticipants > 0, "Max participants must be > 0");
        require(_drawTime > block.timestamp, "Invalid draw time");
        require(_prizePercentage > 0, "Prize percentage must be > 0");
        require(_investmentPercentage > 0, "Investment percentage must be > 0");
        require(_profitPercentage > 0, "Profit percentage must be > 0");
        require(_prizePercentage + _investmentPercentage + _profitPercentage == 100, "Percentages must sum to 100");

        lotteryCounter++;
        Lottery storage l = lotteries[lotteryCounter];
        l.tokenAddress = _tokenAddress;
        l.participationFee = _participationFee;
        l.maxParticipants = _maxParticipants;
        l.drawTime = _drawTime;
        l.prizePercentage = _prizePercentage;
        l.investmentPercentage = _investmentPercentage;
        l.profitPercentage = _profitPercentage;
        l.isActive = true;

        activeLotteryIds.push(lotteryCounter);

        emit LotteryCreated(lotteryCounter);
    }

    function enterLottery(uint256 _lotteryId) external nonReentrant {
        require(_lotteryId > 0 && _lotteryId <= lotteryCounter, "Invalid lottery ID");
        Lottery storage l = lotteries[_lotteryId];
        require(l.isActive && !l.isCancelled && !l.isDrawn, "Lottery not available");
        
        bool beforeDrawTime = block.timestamp < l.drawTime;
        bool hasRequiredParticipants = l.participants.length >= l.maxParticipants;
        
        if (beforeDrawTime) {
            require(true, "Can join before draw time");
        } else {
            require(!hasRequiredParticipants, "Cannot join after draw time if required participants reached");
        }

        require(IERC20(l.tokenAddress).transferFrom(msg.sender, address(this), l.participationFee), "Transfer failed");

        l.participants.push(msg.sender);
        l.entryCount[msg.sender]++;

        if (!beforeDrawTime && l.participants.length >= l.maxParticipants) {
            _autoDrawLottery(_lotteryId);
        }

        emit EnteredLottery(_lotteryId, msg.sender);
    }

    function voteCancel(uint256 _lotteryId) external {
        require(_lotteryId > 0 && _lotteryId <= lotteryCounter, "Invalid lottery ID");
        Lottery storage l = lotteries[_lotteryId];
        require(l.isActive && !l.isCancelled && !l.isDrawn, "Lottery not active");
        require(!l.hasVotedCancel[msg.sender], "Already voted");
        require(l.entryCount[msg.sender] > 0, "Not in lottery");

        l.hasVotedCancel[msg.sender] = true;
        l.voteCount++;
        
        if (l.participants.length > 0 && l.voteCount * 3 >= l.participants.length * 2) {
            l.isCancelled = true;
            _removeFromActiveLotteries(_lotteryId);
            emit LotteryCancelled(_lotteryId);
        }
    }

    function drawWinner(uint256 _lotteryId) external onlyOwner {
        require(_lotteryId > 0 && _lotteryId <= lotteryCounter, "Invalid lottery ID");
        Lottery storage l = lotteries[_lotteryId];
        require(!l.isDrawn && !l.isCancelled, "Already drawn or cancelled");
        require(l.participants.length >= l.maxParticipants, "Not enough participants");

        _requestDraw(_lotteryId);
    }

    function _autoDrawLottery(uint256 _lotteryId) internal {
        Lottery storage l = lotteries[_lotteryId];
        if (l.participants.length >= l.maxParticipants && !l.isDrawn && !l.isCancelled) {
            _requestDraw(_lotteryId);
        }
    }

    function _requestDraw(uint256 _lotteryId) internal {
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
        lotteries[_lotteryId].isDrawn = true;
        lotteries[_lotteryId].drawTimestamp = block.timestamp;

        _removeFromActiveLotteries(_lotteryId);
        drawnLotteryIds.push(_lotteryId);

        emit LotteryDrawRequested(_lotteryId, requestId);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        uint256 lotteryId = requestToLottery[requestId];
        require(lotteryId > 0, "Invalid request ID");
        require(lotteryId <= lotteryCounter, "Invalid lottery ID");
        
        Lottery storage l = lotteries[lotteryId];
        require(l.isDrawn && l.winner == address(0), "Already fulfilled");
        require(randomWords.length > 0, "No random words received");

        require(l.participants.length > 0, "No participants");
        uint256 winnerIndex = randomWords[0] % l.participants.length;
        l.winner = l.participants[winnerIndex];

        uint256 totalFunds = l.participationFee * l.participants.length;
        uint256 investmentAmount = (totalFunds * l.investmentPercentage) / 100;
        uint256 profitAmount = (totalFunds * l.profitPercentage) / 100;

        IERC20 token = IERC20(l.tokenAddress);
        require(token.transfer(investmentWallet, investmentAmount), "Investment transfer failed");
        require(token.transfer(profitWallet, profitAmount), "Profit transfer failed");

        emit WinnerSelected(lotteryId, l.winner);
    }

    function cancelLottery(uint256 _lotteryId) external onlyOwner {
        require(_lotteryId > 0 && _lotteryId <= lotteryCounter, "Invalid lottery ID");
        Lottery storage l = lotteries[_lotteryId];
        require(!l.isCancelled && !l.isDrawn, "Already finalized");
        
        l.isCancelled = true;
        _removeFromActiveLotteries(_lotteryId);
        emit LotteryCancelled(_lotteryId);
    }

    function withdrawFunds(uint256 _lotteryId) external nonReentrant {
        require(_lotteryId > 0 && _lotteryId <= lotteryCounter, "Invalid lottery ID");
        Lottery storage l = lotteries[_lotteryId];
        require(l.isCancelled || l.isDrawn, "Lottery not finalized");
        require(!l.hasWithdrawn[msg.sender], "Already withdrawn");
        require(l.entryCount[msg.sender] > 0, "No entries");

        uint256 amount;
        
        if (l.isCancelled) {
            amount = l.participationFee * l.entryCount[msg.sender];
        } else if (l.isDrawn) {
            if (l.winner == msg.sender) {
                uint256 totalFunds = l.participationFee * l.participants.length;
                amount = (totalFunds * l.prizePercentage) / 100;
            } else {
                require(block.timestamp <= l.drawTimestamp + REFUND_PERIOD, "Refund period expired");
                uint256 totalFunds = l.participationFee * l.participants.length;
                uint256 refundPerParticipant = (totalFunds * l.prizePercentage) / (100 * (l.participants.length - 1));
                amount = refundPerParticipant * l.entryCount[msg.sender];
            }
        }

        require(amount > 0, "No funds to withdraw");
        l.hasWithdrawn[msg.sender] = true;

        require(IERC20(l.tokenAddress).transfer(msg.sender, amount), "Transfer failed");
        emit FundsWithdrawn(_lotteryId, msg.sender, amount);

        _checkAndDeleteLottery(_lotteryId);
    }

    function withdrawExpiredRefunds(uint256 _lotteryId) external onlyOwner {
        require(_lotteryId > 0 && _lotteryId <= lotteryCounter, "Invalid lottery ID");
        Lottery storage l = lotteries[_lotteryId];
        require(l.isDrawn, "Lottery not drawn");
        require(block.timestamp > l.drawTimestamp + REFUND_PERIOD, "Refund period not expired");

        uint256 totalRefunds = 0;
        for (uint256 i = 0; i < l.participants.length; i++) {
            address participant = l.participants[i];
            if (participant != l.winner && !l.hasWithdrawn[participant]) {
                uint256 totalFunds = l.participationFee * l.participants.length;
                uint256 refundPerParticipant = (totalFunds * l.prizePercentage) / (100 * (l.participants.length - 1));
                totalRefunds += refundPerParticipant * l.entryCount[participant];
                l.hasWithdrawn[participant] = true;
            }
        }

        if (totalRefunds > 0) {
            require(IERC20(l.tokenAddress).transfer(owner(), totalRefunds), "Transfer failed");
        }

        _checkAndDeleteLottery(_lotteryId);
    }

    function _checkAndDeleteLottery(uint256 _lotteryId) internal {
        Lottery storage l = lotteries[_lotteryId];
        
        bool allWithdrawn = true;
        for (uint256 i = 0; i < l.participants.length; i++) {
            if (!l.hasWithdrawn[l.participants[i]]) {
                allWithdrawn = false;
                break;
            }
        }

        if (allWithdrawn) {
            _removeFromDrawnLotteries(_lotteryId);
            delete lotteries[_lotteryId];
            emit LotteryAutoDeleted(_lotteryId);
        }
    }

    function _removeFromActiveLotteries(uint256 _lotteryId) internal {
        for (uint256 i = 0; i < activeLotteryIds.length; i++) {
            if (activeLotteryIds[i] == _lotteryId) {
                activeLotteryIds[i] = activeLotteryIds[activeLotteryIds.length - 1];
                activeLotteryIds.pop();
                break;
            }
        }
    }

    function _removeFromDrawnLotteries(uint256 _lotteryId) internal {
        for (uint256 i = 0; i < drawnLotteryIds.length; i++) {
            if (drawnLotteryIds[i] == _lotteryId) {
                drawnLotteryIds[i] = drawnLotteryIds[drawnLotteryIds.length - 1];
                drawnLotteryIds.pop();
                break;
            }
        }
    }

    function getActiveLotteries() external view returns (uint256[] memory) {
        return activeLotteryIds;
    }

    function getDrawnLotteries() external view returns (uint256[] memory) {
        return drawnLotteryIds;
    }

    function getParticipants(uint256 _lotteryId) external view returns (address[] memory) {
        require(_lotteryId > 0 && _lotteryId <= lotteryCounter, "Invalid lottery ID");
        return lotteries[_lotteryId].participants;
    }

    function getLotteryInfo(uint256 _lotteryId) external view returns (LotteryInfo memory info) {
        require(_lotteryId > 0 && _lotteryId <= lotteryCounter, "Invalid lottery ID");
        Lottery storage l = lotteries[_lotteryId];
        info = LotteryInfo({
            tokenAddress: l.tokenAddress,
            participationFee: l.participationFee,
            maxParticipants: l.maxParticipants,
            drawTime: l.drawTime,
            prizePercentage: l.prizePercentage,
            investmentPercentage: l.investmentPercentage,
            profitPercentage: l.profitPercentage,
            isActive: l.isActive,
            isDrawn: l.isDrawn,
            isCancelled: l.isCancelled,
            winner: l.winner,
            voteCount: l.voteCount,
            drawTimestamp: l.drawTimestamp,
            participants: l.participants
        });
    }

    function getUserLotteryData(uint256 lotteryId, address user)
        external
        view
        returns (
            uint256 entryCount,
            bool hasWithdrawn,
            bool hasVotedCancel
        )
    {
        require(lotteryId > 0 && lotteryId <= lotteryCounter, "Invalid lottery ID");
        Lottery storage l = lotteries[lotteryId];
        return (
            l.entryCount[user],
            l.hasWithdrawn[user],
            l.hasVotedCancel[user]
        );
    }

    function lotteryExists(uint256 _lotteryId) external view returns (bool) {
        return _lotteryId > 0 && _lotteryId <= lotteryCounter;
    }
}