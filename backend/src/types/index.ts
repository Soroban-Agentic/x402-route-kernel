import { xdr } from "soroban-client";

export interface PaymentRequest {
  agentId: string;
  token: string;
  amount: string;
  callbackUrl?: string;
}

export interface PaymentResponse {
  status: "pending" | "completed" | "failed";
  transactionHash?: string;
  error?: string;
}

export interface SpendingLimit {
  token: string;
  maxAmount: string;
  periodSeconds: number;
}

export interface PasskeyChallenge {
  challenge: string;
  credentialId: string;
  origin: string;
}

export interface PasskeyAssertion {
  credentialId: string;
  clientDataJSON: string;
  authenticatorData: string;
  signature: string;
  userHandle: string;
}
