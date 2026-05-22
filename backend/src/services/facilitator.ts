import { SorobanRpc, nativeToScVal, scValToNative } from "soroban-client";
import { Keypair, Networks } from "stellar-sdk";

export class PaymentFacilitator {
  private rpc: SorobanRpc.Server;
  private networkPassphrase: string;

  constructor(rpcUrl: string, network: string) {
    this.rpc = new SorobanRpc.Server(rpcUrl);
    this.networkPassphrase = network === "mainnet"
      ? Networks.PUBLIC
      : Networks.TESTNET;
  }

  async verifyPayment(transactionHash: string): Promise<boolean> {
    try {
      const tx = await this.rpc.getTransaction(transactionHash);
      return tx.status === "SUCCESS";
    } catch {
      return false;
    }
  }

  async callContract(contractId: string, method: string, args: unknown[]) {
    const scArgs = args.map((arg) => nativeToScVal(arg, { type: "address" }));
    const result = await this.rpc.call(contractId, method, scArgs);
    return scValToNative(result);
  }
}
