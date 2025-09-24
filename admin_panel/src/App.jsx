import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('createLottery')
  const [statusMessages, setStatusMessages] = useState([])
  const [activeLotteries, setActiveLotteries] = useState([])
  const [drawnLotteries, setDrawnLotteries] = useState([])
  const [provider, setProvider] = useState(null)
  const [contract, setContract] = useState(null)

  const CONFIG = {
    ADMIN_PRIVATE_KEY: import.meta.env.VITE_ADMIN_PRIVATE_KEY || 'your_admin_private_key_here',
    INFURA_API_KEY: import.meta.env.VITE_INFURA_API_KEY || 'your_infura_api_key_here',
    STEM_PAY_CONTRACT_ADDRESS: import.meta.env.VITE_STEM_PAY_CONTRACT_ADDRESS || 'your_stem_pay_contract_address_here'
  }

  const STEM_PAY_LOTTERY_MANAGER_ABI = [
    {
      "inputs": [
        {"internalType": "address", "name": "_tokenAddress", "type": "address"},
        {"internalType": "uint256", "name": "_participationFee", "type": "uint256"},
        {"internalType": "uint256", "name": "_maxParticipants", "type": "uint256"},
        {"internalType": "uint256", "name": "_drawTime", "type": "uint256"},
        {"internalType": "uint256", "name": "_prizePercentage", "type": "uint256"},
        {"internalType": "uint256", "name": "_investmentPercentage", "type": "uint256"},
        {"internalType": "uint256", "name": "_profitPercentage", "type": "uint256"}
      ],
      "name": "createLottery",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "_lotteryId", "type": "uint256"}],
      "name": "drawWinner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "_lotteryId", "type": "uint256"}],
      "name": "cancelLottery",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getActiveLotteries",
      "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getDrawnLotteries",
      "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "_lotteryId", "type": "uint256"}],
      "name": "getLotteryInfo",
      "outputs": [{
        "components": [
          {"internalType": "address", "name": "tokenAddress", "type": "address"},
          {"internalType": "uint256", "name": "participationFee", "type": "uint256"},
          {"internalType": "uint256", "name": "maxParticipants", "type": "uint256"},
          {"internalType": "uint256", "name": "drawTime", "type": "uint256"},
          {"internalType": "uint256", "name": "prizePercentage", "type": "uint256"},
          {"internalType": "uint256", "name": "investmentPercentage", "type": "uint256"},
          {"internalType": "uint256", "name": "profitPercentage", "type": "uint256"},
          {"internalType": "bool", "name": "isActive", "type": "bool"},
          {"internalType": "bool", "name": "isDrawn", "type": "bool"},
          {"internalType": "bool", "name": "isCancelled", "type": "bool"},
          {"internalType": "address", "name": "winner", "type": "address"},
          {"internalType": "uint256", "name": "voteCount", "type": "uint256"},
          {"internalType": "uint256", "name": "drawTimestamp", "type": "uint256"},
          {"internalType": "address[]", "name": "participants", "type": "address[]"}
        ],
        "internalType": "struct StemPayLotteryManager.LotteryInfo",
        "name": "info",
        "type": "tuple"
      }],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  const addStatusMessage = (message, type = 'info') => {
    const newMessage = {
      id: Date.now(),
      message: `${new Date().toLocaleTimeString()}: ${message}`,
      type
    }
    setStatusMessages(prev => [...prev, newMessage])
  }

  const initializeContract = async () => {
    try {
      if (!CONFIG.INFURA_API_KEY || CONFIG.INFURA_API_KEY === 'your_infura_api_key_here') {
        addStatusMessage('Please configure your environment variables in .env file', 'error')
        return
      }

      if (typeof window !== 'undefined' && window.ethereum) {
        const { ethers } = await import('ethers')
        const browserProvider = new ethers.BrowserProvider(window.ethereum)
        await browserProvider.send("eth_requestAccounts", [])
        const signer = await browserProvider.getSigner()
        
        const contractInstance = new ethers.Contract(
          CONFIG.STEM_PAY_CONTRACT_ADDRESS, 
          STEM_PAY_LOTTERY_MANAGER_ABI, 
          signer
        )
        
        setProvider(browserProvider)
        setContract(contractInstance)
        addStatusMessage('Contract initialized successfully with MetaMask', 'success')
        await loadLotteries(contractInstance)
      } else {
        addStatusMessage('Please install MetaMask to use this application', 'error')
      }
    } catch (error) {
      addStatusMessage(`Failed to initialize contract: ${error.message}`, 'error')
    }
  }

  const loadLotteries = async (contractInstance = contract) => {
    if (!contractInstance) return
    
    try {
      const activeLotteriesData = await contractInstance.getActiveLotteries()
      const drawnLotteriesData = await contractInstance.getDrawnLotteries()

      setActiveLotteries(activeLotteriesData.map(id => Number(id)))
      setDrawnLotteries(drawnLotteriesData.map(id => Number(id)))
    } catch (error) {
      addStatusMessage(`Error loading lotteries: ${error.message}`, 'error')
    }
  }

  const handleCreateLottery = async (e) => {
    e.preventDefault()
    if (!contract) {
      addStatusMessage('Contract not initialized', 'error')
      return
    }

    try {
      const formData = new FormData(e.target)
      const { ethers } = await import('ethers')
      
      const tokenAddress = formData.get('tokenAddress')
      const participationFee = ethers.parseUnits(formData.get('participationFee'), 18)
      const maxParticipants = parseInt(formData.get('maxParticipants'))
      const drawDateTime = Math.floor(new Date(formData.get('drawDateTime')).getTime() / 1000)
      const prizePercentage = parseInt(formData.get('prizePercentage'))
      const investmentPercentage = parseInt(formData.get('investmentPercentage'))
      const profitPercentage = parseInt(formData.get('profitPercentage'))

      if (prizePercentage + investmentPercentage + profitPercentage !== 100) {
        addStatusMessage('Percentages must add up to 100%', 'error')
        return
      }

      addStatusMessage('Creating lottery...', 'info')
      
      const tx = await contract.createLottery(
        tokenAddress,
        participationFee,
        maxParticipants,
        drawDateTime,
        prizePercentage,
        investmentPercentage,
        profitPercentage
      )

      addStatusMessage(`Transaction sent: ${tx.hash}`, 'info')
      await tx.wait()
      addStatusMessage('Lottery created successfully!', 'success')
      
      e.target.reset()
      await loadLotteries()
    } catch (error) {
      addStatusMessage(`Error creating lottery: ${error.message}`, 'error')
    }
  }

  const handleDrawWinner = async () => {
    const lotteryId = document.getElementById('adminLotteryId').value
    if (!lotteryId || !contract) return

    try {
      addStatusMessage(`Drawing winner for lottery ${lotteryId}...`, 'info')
      const tx = await contract.drawWinner(parseInt(lotteryId))
      addStatusMessage(`Transaction sent: ${tx.hash}`, 'info')
      await tx.wait()
      addStatusMessage(`Winner drawn for lottery ${lotteryId}!`, 'success')
      await loadLotteries()
    } catch (error) {
      addStatusMessage(`Error drawing winner: ${error.message}`, 'error')
    }
  }

  const handleCancelLottery = async () => {
    const lotteryId = document.getElementById('adminLotteryId').value
    if (!lotteryId || !contract) return

    try {
      addStatusMessage(`Cancelling lottery ${lotteryId}...`, 'info')
      const tx = await contract.cancelLottery(parseInt(lotteryId))
      addStatusMessage(`Transaction sent: ${tx.hash}`, 'info')
      await tx.wait()
      addStatusMessage(`Lottery ${lotteryId} cancelled!`, 'success')
      await loadLotteries()
    } catch (error) {
      addStatusMessage(`Error cancelling lottery: ${error.message}`, 'error')
    }
  }

  useEffect(() => {
    initializeContract()
  }, [])

  return (
    <div id="app">
      <header>
        <h1>Stem Pay Lottery Manager - Admin Dashboard</h1>
      </header>

      <nav style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('createLottery')}
          style={{ 
            backgroundColor: activeTab === 'createLottery' ? '#007cba' : '',
            color: activeTab === 'createLottery' ? 'white' : '',
            marginRight: '10px',
            padding: '10px 20px'
          }}
        >
          Create Lottery
        </button>
        <button 
          onClick={() => setActiveTab('agents')}
          style={{ 
            backgroundColor: activeTab === 'agents' ? '#007cba' : '',
            color: activeTab === 'agents' ? 'white' : '',
            padding: '10px 20px'
          }}
        >
          Agents
        </button>
      </nav>

      {activeTab === 'createLottery' && (
        <div>
          <section style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd' }}>
            <h2>Create New Lottery</h2>
            <p><em>Hint: Fill out all fields to create a new lottery. Percentages must add up to 100%.</em></p>
            
            <form onSubmit={handleCreateLottery}>
              <div style={{ margin: '10px 0' }}>
                <label style={{ display: 'inline-block', width: '200px' }}>Token Contract Address:</label>
                <input 
                  type="text" 
                  name="tokenAddress" 
                  required 
                  placeholder="0x..."
                  style={{ width: '300px', padding: '5px' }}
                  title="ERC20 token contract address for lottery payments"
                />
              </div>

              <div style={{ margin: '10px 0' }}>
                <label style={{ display: 'inline-block', width: '200px' }}>Participation Fee (USDT):</label>
                <input 
                  type="number" 
                  name="participationFee" 
                  required 
                  step="0.01" 
                  min="0" 
                  placeholder="10.00"
                  style={{ width: '300px', padding: '5px' }}
                  title="Fee in USDT tokens that participants pay to enter"
                />
              </div>

              <div style={{ margin: '10px 0' }}>
                <label style={{ display: 'inline-block', width: '200px' }}>Maximum Participants:</label>
                <input 
                  type="number" 
                  name="maxParticipants" 
                  required 
                  min="2" 
                  placeholder="100"
                  style={{ width: '300px', padding: '5px' }}
                  title="Maximum number of participants allowed in this lottery"
                />
              </div>

              <div style={{ margin: '10px 0' }}>
                <label style={{ display: 'inline-block', width: '200px' }}>Draw Date & Time:</label>
                <input 
                  type="datetime-local" 
                  name="drawDateTime" 
                  required
                  style={{ width: '300px', padding: '5px' }}
                  title="When the lottery winner will be drawn"
                />
              </div>

              <div style={{ margin: '10px 0' }}>
                <label style={{ display: 'inline-block', width: '200px' }}>Prize Percentage (%):</label>
                <input 
                  type="number" 
                  name="prizePercentage" 
                  required 
                  min="0" 
                  max="100" 
                  placeholder="70"
                  style={{ width: '300px', padding: '5px' }}
                  title="Percentage of total pool that goes to the winner"
                />
              </div>

              <div style={{ margin: '10px 0' }}>
                <label style={{ display: 'inline-block', width: '200px' }}>Investment Percentage (%):</label>
                <input 
                  type="number" 
                  name="investmentPercentage" 
                  required 
                  min="0" 
                  max="100" 
                  placeholder="20"
                  style={{ width: '300px', padding: '5px' }}
                  title="Percentage of total pool that goes to investment wallet"
                />
              </div>

              <div style={{ margin: '10px 0' }}>
                <label style={{ display: 'inline-block', width: '200px' }}>Profit Percentage (%):</label>
                <input 
                  type="number" 
                  name="profitPercentage" 
                  required 
                  min="0" 
                  max="100" 
                  placeholder="10"
                  style={{ width: '300px', padding: '5px' }}
                  title="Percentage of total pool that goes to profit wallet"
                />
              </div>

              <button type="submit" style={{ padding: '10px 20px', margin: '5px' }}>
                Create Lottery
              </button>
            </form>
          </section>

          <section style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd' }}>
            <h2>Admin Controls</h2>
            <p><em>Hint: Use these controls to manage existing lotteries.</em></p>
            
            <div>
              <label style={{ display: 'inline-block', width: '200px' }}>Lottery ID:</label>
              <input 
                type="number" 
                id="adminLotteryId" 
                required 
                min="1" 
                placeholder="1"
                style={{ width: '100px', padding: '5px', marginRight: '10px' }}
                title="ID of the lottery to manage"
              />
              
              <button 
                type="button" 
                onClick={handleDrawWinner}
                style={{ padding: '10px 20px', margin: '5px' }}
              >
                Draw Winner
              </button>
              <button 
                type="button" 
                onClick={handleCancelLottery}
                style={{ padding: '10px 20px', margin: '5px' }}
              >
                Cancel Lottery
              </button>
            </div>
          </section>

          <section style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd' }}>
            <h2>Active Lotteries</h2>
            <p><em>Hint: These are lotteries currently accepting participants.</em></p>
            <div>
              {activeLotteries.length === 0 ? (
                <p>No active lotteries found.</p>
              ) : (
                activeLotteries.map(lotteryId => (
                  <div key={lotteryId} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
                    <h4>Lottery #{lotteryId}</h4>
                    <p>Click to view details...</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd' }}>
            <h2>Drawn Lotteries</h2>
            <p><em>Hint: These are completed lotteries with winners selected.</em></p>
            <div>
              {drawnLotteries.length === 0 ? (
                <p>No drawn lotteries found.</p>
              ) : (
                drawnLotteries.map(lotteryId => (
                  <div key={lotteryId} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
                    <h4>Lottery #{lotteryId}</h4>
                    <p>Click to view details...</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'agents' && (
        <div>
          <section style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd' }}>
            <h2>Agents Management</h2>
            <p><em>Coming soon: Agent management interface will be implemented here.</em></p>
          </section>
        </div>
      )}

      <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd' }}>
        <h3>Status Messages</h3>
        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
          {statusMessages.map(msg => (
            <div 
              key={msg.id} 
              style={{ 
                color: msg.type === 'error' ? 'red' : msg.type === 'success' ? 'green' : 'black' 
              }}
            >
              {msg.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
