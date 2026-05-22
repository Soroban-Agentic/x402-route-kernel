import { Router, Request, Response } from "express";
import { PaymentFacilitator } from "../services/facilitator";

export function createPaymentRouter(facilitator: PaymentFacilitator): Router {
  const router = Router();

  router.post("/pay", async (req: Request, res: Response) => {
    const { agentId, token, amount, callbackUrl } = req.body;

    res.status(200).json({
      status: "pending",
      message: "Payment initiated",
      agentId,
      token,
      amount,
      callbackUrl,
    });
  });

  router.get("/status/:txHash", async (req: Request, res: Response) => {
    const { txHash } = req.params;
    const isValid = await facilitator.verifyPayment(txHash);

    res.status(200).json({
      status: isValid ? "completed" : "failed",
      transactionHash: txHash,
    });
  });

  return router;
}
