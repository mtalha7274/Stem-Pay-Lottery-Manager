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
- **Manual Draw Control**: Admin controls drawing before scheduled time
- **Democratic Cancellation**: 2/3 majority vote cancellation by participants
- **Flexible Participation**: No upper limit on participants before draw time
- **Automatic Draw System**: Auto-draws when required participants reached after draw time

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

## 📋 Core Rules Summary

For complete verification rules and testing guidelines, see [RULES.md](./RULES.md)

1. ✅ Only admin can initialize the contract
2. ✅ Only admin can cancel and draw lotteries (no data clearing access)
3. ✅ Lottery cancellation before time with full refund
4. ✅ 2/3 majority vote cancellation by participants
5. ✅ Admin-only draw before time when required participants reached
6. ✅ No upper limit on participants before draw time
7. ✅ Automatic draw after time when required participants reached
8. ✅ Unified withdrawal method for all scenarios
9. ✅ Percentage-based fee structure
10. ✅ 60-day refund period with admin recovery
11. ✅ Auto-deletion after all withdrawals
12. ✅ No migration functionality

## 🎲 Lottery Lifecycle

### Creation Phase
- Admin creates lottery with percentage-based fee distribution
- Participants can join by paying participation fee in specified ERC20 token
- No upper limit on participants before scheduled draw time

### Before Draw Time
- **Unlimited Participation**: Anyone can join without restrictions
- **Admin Control**: Only admin can draw if minimum participants reached
- **Vote Cancellation**: Participants can vote to cancel (2/3 majority required)

### After Draw Time
- **Conditional Participation**: Can only join if required participants not yet reached
- **Automatic Draw**: Triggers immediately when required participant count reached
- **Admin Override**: Admin can still manually draw if requirements met

### Completion Phase
- **Winner Selection**: Chainlink VRF ensures provably fair randomness
- **Fund Distribution**: Automatic percentage-based distribution to wallets
- **Withdrawal Period**: 60-day window for refunds, prize withdrawal anytime
- **Auto-Cleanup**: Lottery auto-deletes after all funds withdrawn

## 💡 How It Works

### For Participants
1. **Join Lottery**: Pay participation fee in specified ERC20 token
2. **Vote if Needed**: Can vote to cancel lottery (requires 2/3 majority)
3. **Wait for Draw**: Lottery draws automatically or manually based on timing
4. **Withdraw Funds**: Single method handles both prize and refund withdrawals

### For Administrators
1. **Create Lottery**: Set token, fee, participants, time, and percentage distribution
2. **Monitor Progress**: Track participants and voting through view functions
3. **Manual Control**: Can draw or cancel lottery before scheduled time
4. **Recovery**: Can recover expired refunds after 60-day period

### Fund Distribution Logic
- **Cancelled Lottery**: Full participation fee refunded to all participants
- **Drawn Lottery (Winner)**: Receives prize amount based on prize percentage
- **Drawn Lottery (Others)**: Receive refunds from remaining prize pool percentage
- **Investment/Profit**: Automatically transferred to designated wallets during draw

## 🔧 Core Functions

### Admin Functions
- `initialize()` - Initialize contract with VRF and wallet parameters
- `createLottery()` - Create new lottery with percentage-based fees
- `cancelLottery()` - Cancel active lottery before draw
- `drawWinner()` - Manually draw lottery winner when requirements met
- `withdrawExpiredRefunds()` - Recover unclaimed refunds after 60 days

### Public Functions
- `enterLottery()` - Join a lottery by paying participation fee
- `voteCancel()` - Vote to cancel lottery (requires participation)
- `withdrawFunds()` - Withdraw winnings or refunds (unified method)

### View Functions
- `getLotteryInfo()` - Get complete lottery information and status
- `getActiveLotteries()` - Get array of active lottery IDs
- `getDrawnLotteries()` - Get array of drawn lottery IDs
- `getParticipants()` - Get participants for specific lottery
- `getUserLotteryData()` - Get user's participation data for specific lottery

## 📁 Project Structure

```
Stem-Pay-Lottery-Manager/
├── contracts/
│   ├── StemPayLotteryManager.sol    # Main lottery contract
│   └── MockUSDT.sol                 # Test token for development
├── scripts/                         # Deployment scripts
├── tests/                          # Test files
├── StemPayLotteryManager.abi.json   # Contract ABI
├── RULES.md                         # Contract rules and verification
└── README.md                        # This file
```

## 🔒 Security Features

### Implemented Protections
- **Access Control**: OpenZeppelin Ownable pattern restricts admin functions
- **Reentrancy Protection**: ReentrancyGuard prevents attack vectors
- **Input Validation**: Comprehensive parameter checking throughout
- **Randomness**: Chainlink VRF for provably fair winner selection
- **Upgradeability**: UUPS pattern with owner-only upgrade authorization

### Financial Safeguards
- **Percentage Validation**: Prize, investment, and profit percentages must sum to 100%
- **Time-bound Refunds**: 60-day withdrawal period with admin recovery mechanism
- **Automatic Distribution**: Real-time fund transfers during lottery completion
- **Unified Withdrawals**: Single secure method handles all withdrawal scenarios

## 🚨 Key Limitations

1. **Gas Costs**: Large participant arrays may result in higher gas consumption
2. **VRF Dependency**: Requires active Chainlink VRF subscription and LINK funding
3. **Percentage Precision**: Uses integer percentages without decimal support
4. **Fixed Refund Period**: 60-day withdrawal period cannot be modified
5. **Token Compatibility**: Only supports ERC20 tokens

## 🎯 Use Cases

### Community Lotteries
- Token-based community events with transparent winner selection
- Democratic cancellation for community consensus
- Percentage-based fund allocation for community development

### Investment Pools
- Lottery-style investment mechanisms with automatic fund distribution
- Prize pools with investment and profit sharing
- Time-based participation windows with fair draw mechanisms

### Gaming Platforms
- Provably fair lottery systems for gaming applications
- Automatic prize distribution with customizable fee structures
- Upgradeable architecture for feature enhancements

---

**⚠️ Disclaimer**: This software is provided for educational and development purposes. Thoroughly test and audit before production use.