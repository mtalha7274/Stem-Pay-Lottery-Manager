import dotenv from "dotenv";
import readline from "readline";
import fs from "fs";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), "..", ".env") });
import {
  JsonRpcProvider,
  Wallet,
  Contract,
  parseUnits,
  parseEther,
  formatEther,
  formatUnits,
} from "ethers";

const {
  ADMIN_PRIVATE_KEY,
  INFURA_API_KEY,
  MOCK_USDT_ADDRESS,
} = process.env;

if (!ADMIN_PRIVATE_KEY || !INFURA_API_KEY || !MOCK_USDT_ADDRESS) {
  console.error("❌ Missing required environment variables.");
  process.exit(1);
}

const provider = new JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
const adminWallet = new Wallet(ADMIN_PRIVATE_KEY, provider);
const erc20Abi = [
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
];
const mockUsdtContract = new Contract(MOCK_USDT_ADDRESS, erc20Abi, adminWallet);

const AGENTS_FILE = path.join(process.cwd(), "agents.csv");

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (ans) => {
    rl.close();
    resolve(ans);
  }));
}

function saveAgentsToCSV(agents, usdtDecimals) {
  const headers = "index,address,privateKey,ethBalance,mUSDTBalance\n";
  const rows = agents.map((a, i) =>
    `${i + 1},${a.address},${a.privateKey},${formatEther(a.eth)},${formatUnits(a.usdt, usdtDecimals)}`
  );
  fs.writeFileSync(AGENTS_FILE, headers + rows.join("\n"), "utf-8");
  console.log(`\n💾 Agent data saved to ${AGENTS_FILE}`);
}

function readAgentsFromCSV() {
  const data = fs.readFileSync(AGENTS_FILE, "utf-8").trim().split("\n").slice(1);
  return data.map((line) => {
    const [, address, privateKey] = line.split(",");
    return {
      address,
      privateKey,
      wallet: new Wallet(privateKey, provider),
    };
  });
}

async function fetchBalances(agents, usdtDecimals) {
  const updated = [];
  for (const agent of agents) {
    const eth = await provider.getBalance(agent.address);
    const usdt = await mockUsdtContract.balanceOf(agent.address);
    updated.push({
      ...agent,
      eth,
      usdt,
    });
  }
  return updated;
}

async function setupAgents() {
  let agents;
  const usdtDecimals = await mockUsdtContract.decimals();

  if (fs.existsSync(AGENTS_FILE)) {
    console.log("📁 Found existing agents.csv — Skipping agent creation.");
    agents = readAgentsFromCSV();
  } else {
    const agentCount = parseInt(await prompt("How many agents do you want to create? "));
    if (isNaN(agentCount) || agentCount <= 0) {
      console.error("❌ Please enter a valid number of agents.");
      process.exit(1);
    }

    agents = Array.from({ length: agentCount }, () => {
      const wallet = Wallet.createRandom();
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        wallet,
      };
    });

    const usdtAmount = parseUnits("50", usdtDecimals);
    const ethAmount = parseEther("0.001");

    console.log(`\n🔄 Sending 50 mUSDT + 0.001 ETH to each of ${agentCount} agents...\n`);
    for (const [i, agent] of agents.entries()) {
      const addr = agent.address;
      try {
        const ethTx = await adminWallet.sendTransaction({ to: addr, value: ethAmount });
        await ethTx.wait();

        const usdtTx = await mockUsdtContract.transfer(addr, usdtAmount);
        await usdtTx.wait();

        console.log(`✅ Agent ${i + 1}: ${addr}`);
      } catch (err) {
        console.error(`❌ Failed to fund Agent ${i + 1}: ${err.message}`);
      }
    }
  }

  console.log("\n📊 Fetching updated balances...\n");
  const enrichedAgents = await fetchBalances(agents, usdtDecimals);

  enrichedAgents.forEach((agent, i) => {
    console.log(`Agent ${i + 1} (${agent.address})`);
    console.log(`   ETH: ${formatEther(agent.eth)} ETH`);
    console.log(`   USDT: ${formatUnits(agent.usdt, usdtDecimals)} mUSDT`);
    console.log("-----------------------------------------------------");
  });

  saveAgentsToCSV(enrichedAgents, usdtDecimals);

  return enrichedAgents.map(a => a.address);
}

setupAgents()
  .then(addresses => {
    console.log(`\n🎉 Setup Complete. Total Agents: ${addresses.length}`);
  })
  .catch(err => {
    console.error("❌ Setup failed:", err.message);
    process.exit(1);
  });
