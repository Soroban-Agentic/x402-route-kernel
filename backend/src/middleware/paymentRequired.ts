import { Request, Response, NextFunction } from "express";
import { PaymentFacilitator } from "../services/facilitator";

export interface PaymentRequiredOptions {
  facilitator: PaymentFacilitator;
  agentGuardWalletId: string;
  acceptedTokens: string[];
  minAmount: string;
}

export function paymentRequired(options: PaymentRequiredOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const paymentToken = req.headers["x-payment-token"] as string;
    const paymentAmount = req.headers["x-payment-amount"] as string;
    const paymentTxHash = req.headers["x-payment-tx-hash"] as string;

    if (!paymentToken || !paymentAmount || !paymentTxHash) {
      res.status(402).json({
        error: "payment_required",
        message: "Payment required to access this resource",
        acceptedTokens: options.acceptedTokens,
        requiredAmount: options.minAmount,
      });
      return;
    }

    const isValid = await options.facilitator.verifyPayment(paymentTxHash);
    if (!isValid) {
      res.status(402).json({
        error: "payment_invalid",
        message: "Payment verification failed",
      });
      return;
    }

    next();
  };
}
