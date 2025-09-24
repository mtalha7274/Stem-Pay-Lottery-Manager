# StemPay Lottery Manager

A decentralized lottery management system built on Ethereum blockchain with advanced security features, automatic operations, and fair fund distribution.

## 🌟 Overview

StemPay Lottery Manager is a smart contract system that enables transparent, fair, and secure lottery operations on the blockchain. The system features automatic draw mechanisms, democratic cancellation voting, percentage-based fee distribution, and self-managing lottery lifecycle.

## ✨ Key Features

### 🔐 Security & Access Control
- **Admin-only Operations**: Only contract owner can initialize, create, cancel, and draw lotteries
- **OpenZeppelin Integration**: Built with battle-tested security libraries
- **Reentrancy Protection**: Guards against common attack vectors
- **Upgradeable Architecture**: UUPS proxy pattern for future improvements

### 🎯 Lottery Management
- **Automatic Draw System**: Draws lottery when requirements are met
- **Democratic Cancellation**: 2/3 majority vote cancellation by participants
- **Flexible Participation**: More participants can join before draw time
- **Time-based Operations**: Automatic operations based on draw time and participant count

### 💰 Financial Features
- **Percentage-based Distribution**: Prize, investment, and profit percentages (must sum to 100%)
- **Unified Withdrawal System**: Single method for all fund withdrawals
- **60-day Refund Period**: Time-limited refund system with admin recovery
- **Automatic Fund Distribution**: Real-time distribution to investment and profit wallets

### 📊 Data Management
- **Dual Lottery Lists**: Separate tracking of active and drawn lotteries
- **Auto-deletion**: Lotteries automatically delete after all withdrawals
- **Comprehensive Events**: Full event system for transparency and tracking
- **State Management**: Proper lottery state transitions (Active → Drawn/Cancelled → Deleted)

## 🏗️ Architecture

### Contract Structure
```
StemPayLotteryManager
├── Initializable (OpenZeppelin)
├── OwnableUpgradeable (OpenZeppelin)  
├── ReentrancyGuard (OpenZeppelin)
├── UUPSUpgradeable (OpenZeppelin)
└── VRFConsumerBaseV2_5Upgradeable (Chainlink VRF)
```

### Key Components
- **Lottery Struct**: Stores all lottery data including participants, percentages, and state
- **VRF Integration**: Chainlink VRF for provably fair random winner selection
- **State Management**: Active and drawn lottery arrays for efficient querying
- **Event System**: Comprehensive event emissions for off-chain tracking

## 📋 Contract Rules & Verification Points

For complete verification rules and testing guidelines, see [RULES.md](./RULES.md)

### Core Rules Summary:
1. ✅ Only admin can initialize the contract
2. ✅ Only admin can cancel and draw lotteries (no data clearing access)
3. ✅ Lottery cancellation before time with full refund
4. ✅ 2/3 majority vote cancellation by participants
5. ✅ Draw only when required participants reached
6. ✅ Extra participants allowed before draw time
7. ✅ Automatic draw after time on next participant join
8. ✅ Unified withdrawal method for all scenarios
9. ✅ Percentage-based fee structure
10. ✅ 60-day refund period with admin recovery
11. ✅ Auto-deletion after all withdrawals
12. ✅ No migration functionality

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- Hardhat or Remix IDE
- MetaMask or Web3 wallet
- Access to Ethereum testnet/mainnet

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd Stem-Pay-Lottery-Manager
```

2. **Install dependencies:**
```bash
npm install @openzeppelin/contracts-upgradeable
npm install @openzeppelin/contracts
npm install @chainlink/contracts
```

### Deployment

#### Using Remix IDE
1. Open [Remix IDE](https://remix.ethereum.org/)
2. Upload the `contracts/` folder
3. Compile `StemPayLotteryManager.sol`
4. Deploy using the proxy pattern with initialization parameters

#### Using Hardhat
```javascript
// Example deployment script
const { deployProxy } = require('@openzeppelin/hardhat-upgrades');

async function main() {
  const StemPayLotteryManager = await ethers.getContractFactory("StemPayLotteryManager");
  
  const contract = await deployProxy(StemPayLotteryManager, [
    vrfCoordinator,    // Chainlink VRF Coordinator address
    keyHash,           // VRF Key Hash
    subscriptionId,    // VRF Subscription ID
    investmentWallet,  // Investment wallet address
    profitWallet      // Profit wallet address
  ]);
  
  console.log("Contract deployed to:", contract.address);
}
```

### Configuration

#### VRF Setup (Required)
1. Subscribe to Chainlink VRF at [vrf.chain.link](https://vrf.chain.link)
2. Fund your subscription with LINK tokens
3. Get your subscription ID, key hash, and coordinator address
4. Use these values during contract initialization

#### Wallet Configuration
- **Investment Wallet**: Receives percentage of collected fees for investment
- **Profit Wallet**: Receives percentage of collected fees as profit

## 📖 Usage

### For Administrators

#### Creating a Lottery
```javascript
await contract.createLottery(
  tokenAddress,        // ERC20 token address (e.g., USDT)
  participationFee,    // Fee in token wei (e.g., 1000000 for 1 USDT)
  maxParticipants,     // Required participants (e.g., 100)
  drawTime,           // Unix timestamp for draw time
  prizePercentage,    // Prize percentage (e.g., 70)
  investmentPercentage, // Investment percentage (e.g., 20)  
  profitPercentage    // Profit percentage (e.g., 10)
);
// Note: Percentages must sum to exactly 100
```

#### Managing Lotteries
```javascript
// Cancel a lottery
await contract.cancelLottery(lotteryId);

// Draw winner manually (if requirements met)
await contract.drawWinner(lotteryId);

// Recover expired refunds (after 60 days)
await contract.withdrawExpiredRefunds(lotteryId);
```

### For Participants

#### Joining a Lottery
```javascript
// First approve token spending
await tokenContract.approve(lotteryContractAddress, participationFee);

// Enter the lottery
await contract.enterLottery(lotteryId);
```

#### Voting to Cancel
```javascript
await contract.voteCancel(lotteryId);
```

#### Withdrawing Funds
```javascript
// Works for both winners and refunds
await contract.withdrawFunds(lotteryId);
```

### Query Functions

#### Getting Lottery Information
```javascript
// Get detailed lottery info
const lotteryInfo = await contract.getLotteryInfo(lotteryId);

// Get active lotteries
const activeLotteries = await contract.getActiveLotteries();

// Get drawn lotteries  
const drawnLotteries = await contract.getDrawnLotteries();

// Get participants
const participants = await contract.getParticipants(lotteryId);

// Get user data
const userData = await contract.getUserLotteryData(lotteryId, userAddress);
```

## 📁 Project Structure

```
Stem-Pay-Lottery-Manager/
├── contracts/
│   ├── StemPayLotteryManager.sol    # Main lottery contract
│   └── MockUSDT.sol                 # Test token for development
├── scripts/
│   ├── deploy_with_ethers.ts        # Ethers.js deployment script
│   ├── deploy_with_web3.ts          # Web3.js deployment script  
│   ├── ethers-lib.ts                # Ethers utilities
│   └── web3-lib.ts                  # Web3 utilities
├── tests/
│   ├── Ballot_test.sol              # Solidity test example
│   └── storage.test.js              # JavaScript test example
├── StemPayLotteryManager.abi.json   # Contract ABI
├── RULES.md                         # Contract rules and verification
└── README.md                        # This file
```

## 🔧 API Reference

### Contract Functions

#### Admin Functions (onlyOwner)
- `initialize()` - Initialize contract with VRF and wallet parameters
- `createLottery()` - Create new lottery with percentage-based fees
- `cancelLottery()` - Cancel active lottery before draw
- `drawWinner()` - Manually draw lottery winner
- `withdrawExpiredRefunds()` - Recover unclaimed refunds after 60 days

#### Public Functions
- `enterLottery()` - Join a lottery by paying participation fee
- `voteCancel()` - Vote to cancel lottery (requires participation)
- `withdrawFunds()` - Withdraw winnings or refunds

#### View Functions
- `getLotteryInfo()` - Get complete lottery information
- `getActiveLotteries()` - Get array of active lottery IDs
- `getDrawnLotteries()` - Get array of drawn lottery IDs
- `getParticipants()` - Get participants for specific lottery
- `getUserLotteryData()` - Get user's data for specific lottery
- `lotteryExists()` - Check if lottery ID exists

### Events
- `LotteryCreated(uint256 lotteryId)`
- `EnteredLottery(uint256 lotteryId, address user)`
- `LotteryDrawRequested(uint256 lotteryId, uint256 requestId)`
- `WinnerSelected(uint256 lotteryId, address winner)`
- `LotteryCancelled(uint256 lotteryId)`
- `FundsWithdrawn(uint256 lotteryId, address user, uint256 amount)`
- `LotteryAutoDeleted(uint256 lotteryId)`

## 🧪 Testing

### Manual Testing Scenarios

1. **Admin Access Control**
   - Verify only deployer can initialize
   - Test admin-only functions with non-owner accounts
   - Verify ownership transfer functionality

2. **Lottery Lifecycle**
   - Create lottery with valid parameters
   - Test participant joining before/after draw time
   - Verify automatic draw triggers
   - Test manual draw functionality

3. **Voting System**
   - Test vote cancellation with multiple participants
   - Verify 2/3 majority threshold
   - Test vote restrictions (only participants)

4. **Financial Operations**
   - Test percentage calculations
   - Verify fund distributions
   - Test withdrawal scenarios
   - Verify 60-day refund period

5. **Edge Cases**
   - Zero participants scenario
   - Maximum participants reached
   - Draw time passed scenarios
   - Invalid parameter handling

### Test Networks
- **Sepolia Testnet**: Recommended for testing
- **Goerli Testnet**: Alternative testing network
- **Local Hardhat Network**: For development

## 🔒 Security Considerations

### Implemented Security Measures
- **Access Control**: OpenZeppelin Ownable pattern
- **Reentrancy Protection**: ReentrancyGuard on critical functions
- **Input Validation**: Comprehensive parameter checking
- **Integer Overflow**: Solidity 0.8.x automatic protection
- **Randomness**: Chainlink VRF for provably fair draws
- **Upgradeability**: UUPS pattern with owner-only upgrades

### Best Practices
- Always verify lottery exists before operations
- Check user permissions before function calls
- Validate percentages sum to 100 in createLottery
- Monitor gas costs for large participant arrays
- Regular security audits recommended for production

## 🚨 Known Limitations

1. **Gas Costs**: Large participant arrays may cause high gas costs
2. **VRF Dependency**: Requires Chainlink VRF subscription and LINK funding
3. **Percentage Precision**: Uses integer percentages (no decimals)
4. **Withdrawal Period**: Fixed 60-day period cannot be modified
5. **Token Support**: Only ERC20 tokens supported

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow Solidity best practices
- Maintain comprehensive test coverage
- Update documentation for new features
- Ensure gas optimization
- Follow established coding patterns

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, issues, or questions:
- Create an issue in the repository
- Check existing issues for solutions
- Review the [RULES.md](./RULES.md) for verification guidelines

## 🗺️ Roadmap

### Future Enhancements
- [ ] Multi-token support in single lottery
- [ ] Dynamic percentage adjustments
- [ ] Lottery templates and presets
- [ ] Enhanced participant limits
- [ ] Integration with other DeFi protocols
- [ ] Mobile-friendly interface
- [ ] Advanced analytics and reporting

## 🏆 Acknowledgments

- **OpenZeppelin**: For secure smart contract libraries
- **Chainlink**: For verifiable random function (VRF)
- **Ethereum Community**: For development tools and resources
- **Solidity Team**: For the programming language

---

**⚠️ Disclaimer**: This software is provided as-is for educational and development purposes. Thoroughly test and audit before using in production environments. The developers are not responsible for any losses or damages.