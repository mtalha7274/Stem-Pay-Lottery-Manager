import { ethers } from "ethers";
import fs from "fs";
import readline from "readline";
import dotenv from "dotenv";
import path from "path";
import { STEM_PAY_LOTTERY_MANAGER_ABI } from "./abi.js";

dotenv.config({ path: path.join(process.cwd(), "..", ".env") });

const CONTRACT_ADDRESS = process.env.STEM_PAY_CONTRACT_ADDRESS;

if (!CONTRACT_ADDRESS) {
  console.error("❌ CONTRACT_ADDRESS not found in .env");
  process.exit(1);
}

const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);

const agents = fs.readFileSync(path.join(process.cwd(), "assets", "agents.csv"), "utf-8")
  .split("\n")
  .slice(1) 
  .filter(Boolean)
  .map(line => {
    const [index, address, privateKey, ethBalance, mUSDTBalance] = line.split(",");
    return { index, address, privateKey };
  });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter Lottery ID to join: ", async (lotteryIdInput) => {
  const lotteryId = parseInt(lotteryIdInput);

  for (const agent of agents) {
    try {
      const wallet = new ethers.Wallet(agent.privateKey, provider);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, STEM_PAY_LOTTERY_MANAGER_ABI, wallet);

      const info = await contract.getLotteryInfo(lotteryId);
      const token = new ethers.Contract(info.tokenAddress, [
        "function approve(address spender, uint256 amount) external returns (bool)"
      ], wallet);

      const fee = info.participationFee;

      const approveTx = await token.approve(CONTRACT_ADDRESS, fee);
      await approveTx.wait();

      const tx = await contract.enterLottery(lotteryId);
      await tx.wait();

      console.log(`✅ Agent ${agent.index} (${agent.address}) joined lottery #${lotteryId}`);
    } catch (err) {
      console.error(`❌ Agent ${agent.index} (${agent.address}) failed: ${err.reason || err.message}`);
    }
  }

  rl.close();
});
