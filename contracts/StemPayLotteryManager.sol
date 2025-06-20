// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { VRFConsumerBaseV2Plus } from "@chainlink/contracts@1.4.0/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import { VRFV2PlusClient } from "@chainlink/contracts@1.4.0/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "./VRFConsumerBaseV2_5Upgradeable.sol";

contract StemPayLotteryManager is
    Initializable,
    OwnableUpgradeable,
    ReentrancyGuard,
    UUPSUpgradeable,
    VRFConsumerBaseV2Plus
    // VRFConsumerBaseV2_5Upgradeable
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

    mapping(uint256 => Lottery) public lotteries;
    uint256 public lotteryCounter;

    address public investmentWallet;
    address public profitWallet;

    bytes32 public keyHash;
    uint32 public callbackGasLimit;
    uint16 public requestConfirmations;
    uint32 public numWords;
    uint256 public subscriptionId;

    mapping(uint256 => uint256) public requestToLottery;

    event LotteryCreated(uint256 lotteryId);
    event EnteredLottery(uint256 lotteryId, address user);
    event LotteryDrawRequested(uint256 lotteryId, uint256 requestId);
    event WinnerSelected(uint256 lotteryId, address winner);
    event LotteryCancelled(uint256 lotteryId);


    function initialize(
        address _vrfCoordinator,
        bytes32 _keyHash,
        uint64 _subId,
        address _investmentWallet,
        address _profitWallet
    ) external initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        __VRFConsumerBaseV2_5Upgradeable_init(_vrfCoordinator); // ✅ custom init
       
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

        Lottery storage l = lotteries[++lotteryCounter];
        l.tokenAddress = _tokenAddress;
        l.participationFee = _participationFee;
        l.refundableAmount = _refundableAmount;
        l.maxParticipants = _maxParticipants;
        l.drawTime = _drawTime;
        l.prizeAmount = _prizeAmount;
        l.feeToInvestment = _feeToInvestment;
        l.feeToProfit = _feeToProfit;
        l.isActive = true;

        emit LotteryCreated(lotteryCounter);
    }

    function enterLottery(uint256 _lotteryId) external nonReentrant {
        Lottery storage l = lotteries[_lotteryId];
        require(l.isActive && !l.isCancelled, "Inactive or cancelled");
        require(block.timestamp < l.drawTime, "Too late");
        require(l.participants.length < l.maxParticipants, "Max participants");

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
        require(block.timestamp >= l.drawTime, "Too early");
        require(!l.isDrawn && !l.isCancelled, "Already drawn or cancelled");
        require(l.participants.length > 0, "No participants");

        uint256 requestId = s_vrfCoordinator.requestRandomWords(
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
        uint256[] calldata randomWords
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
}
