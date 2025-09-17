// StemPayLotteryManager Contract ABI
export const STEM_PAY_LOTTERY_MANAGER_ABI = [
  // Events
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "lotteryId", "type": "uint256" }
    ],
    "name": "LotteryCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "lotteryId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "EnteredLottery",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "lotteryId", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "requestId", "type": "uint256" }
    ],
    "name": "LotteryDrawRequested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "lotteryId", "type": "uint256" },
      { "indexed": false, "internalType": "address", "name": "winner", "type": "address" }
    ],
    "name": "WinnerSelected",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "lotteryId", "type": "uint256" }
    ],
    "name": "LotteryCancelled",
    "type": "event"
  },

  // Initialize function
  {
    "inputs": [
      { "internalType": "address", "name": "_vrfCoordinator", "type": "address" },
      { "internalType": "bytes32", "name": "_keyHash", "type": "bytes32" },
      { "internalType": "uint256", "name": "_subId", "type": "uint256" },
      { "internalType": "address", "name": "_investmentWallet", "type": "address" },
      { "internalType": "address", "name": "_profitWallet", "type": "address" }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // Create Lottery
  {
    "inputs": [
      { "internalType": "address", "name": "_tokenAddress", "type": "address" },
      { "internalType": "uint256", "name": "_participationFee", "type": "uint256" },
      { "internalType": "uint256", "name": "_refundableAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "_maxParticipants", "type": "uint256" },
      { "internalType": "uint256", "name": "_drawTime", "type": "uint256" },
      { "internalType": "uint256", "name": "_prizeAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "_feeToInvestment", "type": "uint256" },
      { "internalType": "uint256", "name": "_feeToProfit", "type": "uint256" }
    ],
    "name": "createLottery",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // Enter Lottery
  {
    "inputs": [
      { "internalType": "uint256", "name": "_lotteryId", "type": "uint256" }
    ],
    "name": "enterLottery",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // Vote Cancel
  {
    "inputs": [
      { "internalType": "uint256", "name": "_lotteryId", "type": "uint256" }
    ],
    "name": "voteCancel",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // Draw Winner
  {
    "inputs": [
      { "internalType": "uint256", "name": "_lotteryId", "type": "uint256" }
    ],
    "name": "drawWinner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // Cancel Lottery
  {
    "inputs": [
      { "internalType": "uint256", "name": "_lotteryId", "type": "uint256" }
    ],
    "name": "cancelLottery",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // Claim Refund
  {
    "inputs": [
      { "internalType": "uint256", "name": "_lotteryId", "type": "uint256" }
    ],
    "name": "claimRefund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // Claim Prize
  {
    "inputs": [
      { "internalType": "uint256", "name": "_lotteryId", "type": "uint256" }
    ],
    "name": "claimPrize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // Clear Lottery Data
  {
    "inputs": [
      { "internalType": "uint256", "name": "_lotteryId", "type": "uint256" }
    ],
    "name": "clearLotteryData",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // Migrate to Lottery
  {
    "inputs": [
      { "internalType": "uint256", "name": "fromId", "type": "uint256" },
      { "internalType": "uint256", "name": "toId", "type": "uint256" }
    ],
    "name": "migrateToLottery",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // View Functions

  // Get Lottery Info
  {
    "inputs": [
      { "internalType": "uint256", "name": "_lotteryId", "type": "uint256" }
    ],
    "name": "getLotteryInfo",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "tokenAddress", "type": "address" },
          { "internalType": "uint256", "name": "participationFee", "type": "uint256" },
          { "internalType": "uint256", "name": "refundableAmount", "type": "uint256" },
          { "internalType": "uint256", "name": "maxParticipants", "type": "uint256" },
          { "internalType": "uint256", "name": "drawTime", "type": "uint256" },
          { "internalType": "uint256", "name": "prizeAmount", "type": "uint256" },
          { "internalType": "uint256", "name": "feeToInvestment", "type": "uint256" },
          { "internalType": "uint256", "name": "feeToProfit", "type": "uint256" },
          { "internalType": "bool", "name": "isActive", "type": "bool" },
          { "internalType": "bool", "name": "isDrawn", "type": "bool" },
          { "internalType": "bool", "name": "isCancelled", "type": "bool" },
          { "internalType": "address", "name": "winner", "type": "address" },
          { "internalType": "uint256", "name": "voteCount", "type": "uint256" },
          { "internalType": "address[]", "name": "participants", "type": "address[]" }
        ],
        "internalType": "struct StemPayLotteryManager.LotteryInfo",
        "name": "info",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Get Participants
  {
    "inputs": [
      { "internalType": "uint256", "name": "_lotteryId", "type": "uint256" }
    ],
    "name": "getParticipants",
    "outputs": [
      { "internalType": "address[]", "name": "", "type": "address[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Get All Lottery IDs
  {
    "inputs": [],
    "name": "getAllLotteryIds",
    "outputs": [
      { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Get Active Lotteries
  {
    "inputs": [],
    "name": "getActiveLotteries",
    "outputs": [
      { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Get Entry Count
  {
    "inputs": [
      { "internalType": "uint256", "name": "lotteryId", "type": "uint256" },
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "getEntryCount",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Has User Refunded
  {
    "inputs": [
      { "internalType": "uint256", "name": "lotteryId", "type": "uint256" },
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "hasUserRefunded",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Has User Claimed
  {
    "inputs": [
      { "internalType": "uint256", "name": "lotteryId", "type": "uint256" },
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "hasUserClaimed",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Has User Voted Cancel
  {
    "inputs": [
      { "internalType": "uint256", "name": "lotteryId", "type": "uint256" },
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "hasUserVotedCancel",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Get User Lottery Data
  {
    "inputs": [
      { "internalType": "uint256", "name": "lotteryId", "type": "uint256" },
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "getUserLotteryData",
    "outputs": [
      { "internalType": "uint256", "name": "entryCount", "type": "uint256" },
      { "internalType": "bool", "name": "hasClaimed", "type": "bool" },
      { "internalType": "bool", "name": "hasRefunded", "type": "bool" },
      { "internalType": "bool", "name": "hasVotedCancel", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Public Variables (getters)
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "lotteries",
    "outputs": [
      { "internalType": "address", "name": "tokenAddress", "type": "address" },
      { "internalType": "uint256", "name": "participationFee", "type": "uint256" },
      { "internalType": "uint256", "name": "refundableAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "maxParticipants", "type": "uint256" },
      { "internalType": "uint256", "name": "drawTime", "type": "uint256" },
      { "internalType": "uint256", "name": "prizeAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "feeToInvestment", "type": "uint256" },
      { "internalType": "uint256", "name": "feeToProfit", "type": "uint256" },
      { "internalType": "bool", "name": "isActive", "type": "bool" },
      { "internalType": "bool", "name": "isDrawn", "type": "bool" },
      { "internalType": "bool", "name": "isCancelled", "type": "bool" },
      { "internalType": "address", "name": "winner", "type": "address" },
      { "internalType": "uint256", "name": "voteCount", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  {
    "inputs": [],
    "name": "lotteryCounter",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  {
    "inputs": [],
    "name": "investmentWallet",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  {
    "inputs": [],
    "name": "profitWallet",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  {
    "inputs": [],
    "name": "keyHash",
    "outputs": [
      { "internalType": "bytes32", "name": "", "type": "bytes32" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  {
    "inputs": [],
    "name": "callbackGasLimit",
    "outputs": [
      { "internalType": "uint32", "name": "", "type": "uint32" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  {
    "inputs": [],
    "name": "requestConfirmations",
    "outputs": [
      { "internalType": "uint16", "name": "", "type": "uint16" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  {
    "inputs": [],
    "name": "numWords",
    "outputs": [
      { "internalType": "uint32", "name": "", "type": "uint32" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  {
    "inputs": [],
    "name": "subscriptionId",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  {
    "inputs": [],
    "name": "vrfCoordinator",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "allLotteryIds",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "name": "requestToLottery",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Owner functions
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  {
    "inputs": [
      { "internalType": "address", "name": "newOwner", "type": "address" }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // UUPS Upgradeable functions
  {
    "inputs": [
      { "internalType": "address", "name": "newImplementation", "type": "address" }
    ],
    "name": "upgradeToAndCall",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

// Contract address (update this with your deployed contract address)
export const STEM_PAY_LOTTERY_MANAGER_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with actual address

// Helper functions for common contract interactions
export const LotteryManagerAPI = {
  // Contract instance creation helper
  createContract: (web3, address = STEM_PAY_LOTTERY_MANAGER_ADDRESS) => {
    return new web3.eth.Contract(STEM_PAY_LOTTERY_MANAGER_ABI, address);
  },

  // Common view functions
  getLotteryInfo: async (contract, lotteryId) => {
    return await contract.methods.getLotteryInfo(lotteryId).call();
  },

  getActiveLotteries: async (contract) => {
    return await contract.methods.getActiveLotteries().call();
  },

  getAllLotteryIds: async (contract) => {
    return await contract.methods.getAllLotteryIds().call();
  },

  getParticipants: async (contract, lotteryId) => {
    return await contract.methods.getParticipants(lotteryId).call();
  },

  getUserLotteryData: async (contract, lotteryId, userAddress) => {
    return await contract.methods.getUserLotteryData(lotteryId, userAddress).call();
  },

  // Common transaction functions
  enterLottery: async (contract, lotteryId, fromAddress) => {
    return await contract.methods.enterLottery(lotteryId).send({ from: fromAddress });
  },

  voteCancel: async (contract, lotteryId, fromAddress) => {
    return await contract.methods.voteCancel(lotteryId).send({ from: fromAddress });
  },

  claimRefund: async (contract, lotteryId, fromAddress) => {
    return await contract.methods.claimRefund(lotteryId).send({ from: fromAddress });
  },

  claimPrize: async (contract, lotteryId, fromAddress) => {
    return await contract.methods.claimPrize(lotteryId).send({ from: fromAddress });
  },

  migrateToLottery: async (contract, fromId, toId, fromAddress) => {
    return await contract.methods.migrateToLottery(fromId, toId).send({ from: fromAddress });
  },

  // Owner functions
  createLottery: async (contract, lotteryParams, fromAddress) => {
    const {
      tokenAddress,
      participationFee,
      refundableAmount,
      maxParticipants,
      drawTime,
      prizeAmount,
      feeToInvestment,
      feeToProfit
    } = lotteryParams;
    
    return await contract.methods.createLottery(
      tokenAddress,
      participationFee,
      refundableAmount,
      maxParticipants,
      drawTime,
      prizeAmount,
      feeToInvestment,
      feeToProfit
    ).send({ from: fromAddress });
  },

  drawWinner: async (contract, lotteryId, fromAddress) => {
    return await contract.methods.drawWinner(lotteryId).send({ from: fromAddress });
  },

  cancelLottery: async (contract, lotteryId, fromAddress) => {
    return await contract.methods.cancelLottery(lotteryId).send({ from: fromAddress });
  }
};

// Event filters for listening to contract events
export const EventFilters = {
  LotteryCreated: (contract) => contract.events.LotteryCreated(),
  EnteredLottery: (contract) => contract.events.EnteredLottery(),
  LotteryDrawRequested: (contract) => contract.events.LotteryDrawRequested(),
  WinnerSelected: (contract) => contract.events.WinnerSelected(),
  LotteryCancelled: (contract) => contract.events.LotteryCancelled()
};

// Utility functions
export const Utils = {
  // Convert wei to token units (assuming 18 decimals)
  fromWei: (amount, decimals = 18) => {
    return (parseFloat(amount) / Math.pow(10, decimals)).toFixed(6);
  },

  // Convert token units to wei (assuming 18 decimals)
  toWei: (amount, decimals = 18) => {
    return (parseFloat(amount) * Math.pow(10, decimals)).toString();
  },

  // Format timestamp to readable date
  formatDate: (timestamp) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  },

  // Check if lottery is active
  isLotteryActive: (lotteryInfo) => {
    const now = Math.floor(Date.now() / 1000);
    return lotteryInfo.isActive && 
           !lotteryInfo.isCancelled && 
           !lotteryInfo.isDrawn && 
           now < parseInt(lotteryInfo.drawTime);
  },

  // Check if user can enter lottery
  canEnterLottery: (lotteryInfo, userEntryCount) => {
    const now = Math.floor(Date.now() / 1000);
    return lotteryInfo.isActive && 
           !lotteryInfo.isCancelled && 
           lotteryInfo.participants.length < lotteryInfo.maxParticipants &&
           (now < parseInt(lotteryInfo.drawTime) || lotteryInfo.participants.length < lotteryInfo.maxParticipants);
  },

  // Check if user can claim refund
  canClaimRefund: (lotteryInfo, userData) => {
    return (lotteryInfo.isCancelled || (lotteryInfo.isDrawn && lotteryInfo.winner !== userData.address)) &&
           !userData.hasRefunded &&
           userData.entryCount > 0;
  },

  // Check if user can claim prize
  canClaimPrize: (lotteryInfo, userData) => {
    return lotteryInfo.winner === userData.address &&
           !userData.hasClaimed &&
           lotteryInfo.isDrawn;
  }
};

export default {
  STEM_PAY_LOTTERY_MANAGER_ABI,
  STEM_PAY_LOTTERY_MANAGER_ADDRESS,
  LotteryManagerAPI,
  EventFilters,
  Utils
};
