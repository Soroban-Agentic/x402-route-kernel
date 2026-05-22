import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { paymentRequired } from "./middleware/paymentRequired";
import { createPaymentRouter } from "./routes/payment";
import { PaymentFacilitator } from "./services/facilitator";

dotenv.config();

const PORT = process.env.PORT || 3000;
const RPC_URL = process.env.RPC_URL || "https://rpc-futurenet.stellar.org";
const STELLAR_NETWORK = process.env.STELLAR_NETWORK || "testnet";
const AGENT_GUARD_WALLET_ID = process.env.AGENT_GUARD_WALLET_ID || "";
const FACILITATOR_CONTRACT_ID = process.env.FACILITATOR_CONTRACT_ID || "";

const facilitator = new PaymentFacilitator(RPC_URL, STELLAR_NETWORK);

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/api/v1/agent",
  paymentRequired({
    facilitator,
    agentGuardWalletId: AGENT_GUARD_WALLET_ID,
    acceptedTokens: ["USDC"],
    minAmount: "1",
  }),
  (req, res) => {
    res.status(200).json({ message: "Agent access granted" });
  }
);

app.use("/api/v1/payments", createPaymentRouter(facilitator));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`x402 route kernel running on port ${PORT}`);
});
