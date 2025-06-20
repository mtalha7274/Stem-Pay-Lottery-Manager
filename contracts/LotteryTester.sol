// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./StemPayLotteryManager.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LotteryTester {
    StemPayLotteryManager public lottery;
    IERC20 public token;

    address public owner;
    address[] public testUsers;

    constructor(address _lottery, address _token) {
        lottery = StemPayLotteryManager(_lottery);
        token = IERC20(_token);
        owner = msg.sender;
    }

    // 1. Create pseudo-random mock users
    function createMockUsers(uint256 count) external {
        require(testUsers.length == 0, "Users already created");
        for (uint256 i = 0; i < count; i++) {
            address mockUser = address(uint160(uint256(keccak256(abi.encodePacked(i, block.timestamp, blockhash(block.number - 1))))));
            testUsers.push(mockUser);
        }
    }

    // 2. Fund mock users with tokens (this requires token to have mint or be preloaded)
    function fundUsers(uint256 amount) external {
        for (uint256 i = 0; i < testUsers.length; i++) {
            token.transfer(testUsers[i], amount);
        }
    }

    // 3. Impersonate and approve from the contract (assumes token is already approved here)
    function approveForAll() external {
        token.approve(address(lottery), type(uint256).max);
    }

    // 4. Enter all users into a specific lottery
    function enterAll(uint256 lotteryId) external {
        for (uint256 i = 0; i < testUsers.length; i++) {
            // Using low-level call so it mimics user call
            (bool success, ) = address(lottery).call(
                abi.encodeWithSignature("enterLottery(uint256)", lotteryId)
            );
            require(success, "Enter failed for a user");
        }
    }

    // 5. Trigger the draw (this will request randomness)
    function callDraw(uint256 lotteryId) external {
        lottery.drawWinner(lotteryId);
    }

    // 6. Test-specific function: simulate randomness fulfillment manually
    function simulateFulfill(uint256 requestId, uint256[] calldata randomWords) external {
        lottery.testFulfillRandomWords(requestId, randomWords);
    }

    // 7. Trigger claim refund for all users
    function claimAllRefunds(uint256 lotteryId) external {
        for (uint256 i = 0; i < testUsers.length; i++) {
            (bool success, ) = address(lottery).call(
                abi.encodeWithSignature("claimRefund(uint256)", lotteryId)
            );
            // Don't revert if it fails, just continue
        }
    }

    // Helper to get mock user addresses
    function getTestUsers() external view returns (address[] memory) {
        return testUsers;
    }
}
