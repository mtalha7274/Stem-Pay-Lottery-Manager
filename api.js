// StemPayLotteryManager Contract ABI
// Updated with security enhancements and new functions
// Version: 2.0 - Security Enhanced
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

  // Is Lottery Ready To Clear
  {
    "inputs": [
      { "internalType": "uint256", "name": "_lotteryId", "type": "uint256" }
    ],
    "name": "isLotteryReadyToClear",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Get Unclaimed Participants
  {
    "inputs": [
      { "internalType": "uint256", "name": "_lotteryId", "type": "uint256" }
    ],
    "name": "getUnclaimedParticipants",
    "outputs": [
      { "internalType": "address[]", "name": "", "type": "address[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Lottery Exists
  {
    "inputs": [
      { "internalType": "uint256", "name": "_lotteryId", "type": "uint256" }
    ],
    "name": "lotteryExists",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
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
    if (!web3) {
      throw new Error('Web3 instance is required');
    }
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      throw new Error('Valid contract address is required');
    }
    return new web3.eth.Contract(STEM_PAY_LOTTERY_MANAGER_ABI, address);
  },

  // Common view functions
  getLotteryInfo: async (contract, lotteryId) => {
    try {
      if (!lotteryId || lotteryId <= 0) {
        throw new Error('Invalid lottery ID');
      }
      return await contract.methods.getLotteryInfo(lotteryId).call();
    } catch (error) {
      console.error('Error getting lottery info:', error);
      throw error;
    }
  },

  getActiveLotteries: async (contract) => {
    try {
      return await contract.methods.getActiveLotteries().call();
    } catch (error) {
      console.error('Error getting active lotteries:', error);
      throw error;
    }
  },

  getAllLotteryIds: async (contract) => {
    try {
      return await contract.methods.getAllLotteryIds().call();
    } catch (error) {
      console.error('Error getting all lottery IDs:', error);
      throw error;
    }
  },

  getParticipants: async (contract, lotteryId) => {
    try {
      if (!lotteryId || lotteryId <= 0) {
        throw new Error('Invalid lottery ID');
      }
      return await contract.methods.getParticipants(lotteryId).call();
    } catch (error) {
      console.error('Error getting participants:', error);
      throw error;
    }
  },

  getUserLotteryData: async (contract, lotteryId, userAddress) => {
    return await contract.methods.getUserLotteryData(lotteryId, userAddress).call();
  },

  isLotteryReadyToClear: async (contract, lotteryId) => {
    return await contract.methods.isLotteryReadyToClear(lotteryId).call();
  },

  getUnclaimedParticipants: async (contract, lotteryId) => {
    return await contract.methods.getUnclaimedParticipants(lotteryId).call();
  },

  lotteryExists: async (contract, lotteryId) => {
    return await contract.methods.lotteryExists(lotteryId).call();
  },

  // Common transaction functions
  enterLottery: async (contract, lotteryId, fromAddress) => {
    try {
      if (!lotteryId || lotteryId <= 0) {
        throw new Error('Invalid lottery ID');
      }
      if (!fromAddress) {
        throw new Error('From address is required');
      }
      return await contract.methods.enterLottery(lotteryId).send({ from: fromAddress });
    } catch (error) {
      console.error('Error entering lottery:', error);
      throw error;
    }
  },

  voteCancel: async (contract, lotteryId, fromAddress) => {
    try {
      if (!lotteryId || lotteryId <= 0) {
        throw new Error('Invalid lottery ID');
      }
      if (!fromAddress) {
        throw new Error('From address is required');
      }
      return await contract.methods.voteCancel(lotteryId).send({ from: fromAddress });
    } catch (error) {
      console.error('Error voting to cancel:', error);
      throw error;
    }
  },

  claimRefund: async (contract, lotteryId, fromAddress) => {
    try {
      if (!lotteryId || lotteryId <= 0) {
        throw new Error('Invalid lottery ID');
      }
      if (!fromAddress) {
        throw new Error('From address is required');
      }
      return await contract.methods.claimRefund(lotteryId).send({ from: fromAddress });
    } catch (error) {
      console.error('Error claiming refund:', error);
      throw error;
    }
  },

  claimPrize: async (contract, lotteryId, fromAddress) => {
    try {
      if (!lotteryId || lotteryId <= 0) {
        throw new Error('Invalid lottery ID');
      }
      if (!fromAddress) {
        throw new Error('From address is required');
      }
      return await contract.methods.claimPrize(lotteryId).send({ from: fromAddress });
    } catch (error) {
      console.error('Error claiming prize:', error);
      throw error;
    }
  },

  migrateToLottery: async (contract, fromId, toId, fromAddress) => {
    return await contract.methods.migrateToLottery(fromId, toId).send({ from: fromAddress });
  },

  // Owner functions
  createLottery: async (contract, lotteryParams, fromAddress) => {
    try {
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
      
      // Validate parameters
      if (!tokenAddress || tokenAddress === '0x0000000000000000000000000000000000000000') {
        throw new Error('Invalid token address');
      }
      if (!fromAddress) {
        throw new Error('From address is required');
      }
      if (participationFee <= 0 || refundableAmount <= 0 || maxParticipants <= 0 || prizeAmount <= 0 || feeToInvestment <= 0 || feeToProfit <= 0) {
        throw new Error('All amounts must be greater than 0');
      }
      if (participationFee < refundableAmount) {
        throw new Error('Participation fee must be >= refundable amount');
      }
      if (drawTime <= Math.floor(Date.now() / 1000)) {
        throw new Error('Draw time must be in the future');
      }
      
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
    } catch (error) {
      console.error('Error creating lottery:', error);
      throw error;
    }
  },

  drawWinner: async (contract, lotteryId, fromAddress) => {
    try {
      if (!lotteryId || lotteryId <= 0) {
        throw new Error('Invalid lottery ID');
      }
      if (!fromAddress) {
        throw new Error('From address is required');
      }
      return await contract.methods.drawWinner(lotteryId).send({ from: fromAddress });
    } catch (error) {
      console.error('Error drawing winner:', error);
      throw error;
    }
  },

  cancelLottery: async (contract, lotteryId, fromAddress) => {
    try {
      if (!lotteryId || lotteryId <= 0) {
        throw new Error('Invalid lottery ID');
      }
      if (!fromAddress) {
        throw new Error('From address is required');
      }
      return await contract.methods.cancelLottery(lotteryId).send({ from: fromAddress });
    } catch (error) {
      console.error('Error cancelling lottery:', error);
      throw error;
    }
  },

  clearLotteryData: async (contract, lotteryId, fromAddress) => {
    try {
      if (!lotteryId || lotteryId <= 0) {
        throw new Error('Invalid lottery ID');
      }
      if (!fromAddress) {
        throw new Error('From address is required');
      }
      
      // Check if lottery is ready to clear before attempting
      const isReady = await contract.methods.isLotteryReadyToClear(lotteryId).call();
      if (!isReady) {
        throw new Error('Lottery is not ready to be cleared. All participants must claim refunds and winner must claim prize.');
      }
      
      return await contract.methods.clearLotteryData(lotteryId).send({ from: fromAddress });
    } catch (error) {
      console.error('Error clearing lottery data:', error);
      throw error;
    }
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
  },

  // Check if lottery is ready to be cleared
  isLotteryReadyToClear: async (contract, lotteryId) => {
    try {
      return await contract.methods.isLotteryReadyToClear(lotteryId).call();
    } catch (error) {
      console.error('Error checking if lottery is ready to clear:', error);
      return false;
    }
  },

  // Get unclaimed participants for a lottery
  getUnclaimedParticipants: async (contract, lotteryId) => {
    try {
      return await contract.methods.getUnclaimedParticipants(lotteryId).call();
    } catch (error) {
      console.error('Error getting unclaimed participants:', error);
      return [];
    }
  },

  // Check if lottery exists
  lotteryExists: async (contract, lotteryId) => {
    try {
      return await contract.methods.lotteryExists(lotteryId).call();
    } catch (error) {
      console.error('Error checking if lottery exists:', error);
      return false;
    }
  },

  // Validate lottery ID before operations
  validateLotteryId: async (contract, lotteryId) => {
    if (!lotteryId || lotteryId <= 0) {
      return { valid: false, error: 'Invalid lottery ID' };
    }
    
    try {
      const exists = await contract.methods.lotteryExists(lotteryId).call();
      if (!exists) {
        return { valid: false, error: 'Lottery does not exist' };
      }
      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'Error validating lottery ID' };
    }
  },

  // Get lottery status summary
  getLotteryStatus: (lotteryInfo) => {
    const now = Math.floor(Date.now() / 1000);
    const drawTime = parseInt(lotteryInfo.drawTime);
    
    if (lotteryInfo.isCancelled) {
      return 'CANCELLED';
    } else if (lotteryInfo.isDrawn) {
      return 'DRAWN';
    } else if (!lotteryInfo.isActive) {
      return 'INACTIVE';
    } else if (now >= drawTime) {
      return 'DRAW_TIME_PASSED';
    } else if (lotteryInfo.participants.length >= lotteryInfo.maxParticipants) {
      return 'FULL';
    } else {
      return 'ACTIVE';
    }
  }
};

// Security utilities for enhanced contract interaction
export const SecurityUtils = {
  // Validate all lottery parameters before creation
  validateLotteryParams: (params) => {
    const errors = [];
    
    if (!params.tokenAddress || params.tokenAddress === '0x0000000000000000000000000000000000000000') {
      errors.push('Invalid token address');
    }
    if (!params.participationFee || params.participationFee <= 0) {
      errors.push('Participation fee must be greater than 0');
    }
    if (!params.refundableAmount || params.refundableAmount <= 0) {
      errors.push('Refundable amount must be greater than 0');
    }
    if (!params.maxParticipants || params.maxParticipants <= 0) {
      errors.push('Max participants must be greater than 0');
    }
    if (!params.drawTime || params.drawTime <= Math.floor(Date.now() / 1000)) {
      errors.push('Draw time must be in the future');
    }
    if (!params.prizeAmount || params.prizeAmount <= 0) {
      errors.push('Prize amount must be greater than 0');
    }
    if (!params.feeToInvestment || params.feeToInvestment <= 0) {
      errors.push('Investment fee must be greater than 0');
    }
    if (!params.feeToProfit || params.feeToProfit <= 0) {
      errors.push('Profit fee must be greater than 0');
    }
    if (params.participationFee < params.refundableAmount) {
      errors.push('Participation fee must be >= refundable amount');
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  // Check if user can perform specific actions
  canPerformAction: async (contract, action, lotteryId, userAddress) => {
    try {
      const lotteryInfo = await contract.methods.getLotteryInfo(lotteryId).call();
      const userData = await contract.methods.getUserLotteryData(lotteryId, userAddress).call();
      
      switch (action) {
        case 'enter':
          return Utils.canEnterLottery(lotteryInfo, userData.entryCount);
        case 'voteCancel':
          return lotteryInfo.isActive && !lotteryInfo.isCancelled && !lotteryInfo.isDrawn && userData.entryCount > 0 && !userData.hasVotedCancel;
        case 'claimRefund':
          return Utils.canClaimRefund(lotteryInfo, { ...userData, address: userAddress });
        case 'claimPrize':
          return Utils.canClaimPrize(lotteryInfo, { ...userData, address: userAddress });
        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking action permission:', error);
      return false;
    }
  },

  // Get comprehensive lottery status
  getLotteryStatus: async (contract, lotteryId) => {
    try {
      const lotteryInfo = await contract.methods.getLotteryInfo(lotteryId).call();
      const isReadyToClear = await contract.methods.isLotteryReadyToClear(lotteryId).call();
      const unclaimedParticipants = await contract.methods.getUnclaimedParticipants(lotteryId).call();
      
      return {
        ...lotteryInfo,
        status: Utils.getLotteryStatus(lotteryInfo),
        isReadyToClear,
        unclaimedParticipantsCount: unclaimedParticipants.length,
        unclaimedParticipants
      };
    } catch (error) {
      console.error('Error getting lottery status:', error);
      throw error;
    }
  }
};

export default {
  STEM_PAY_LOTTERY_MANAGER_ABI,
  STEM_PAY_LOTTERY_MANAGER_ADDRESS,
  LotteryManagerAPI,
  EventFilters,
  Utils,
  SecurityUtils
};
