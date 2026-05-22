import { SorobanRpc, nativeToScVal, scValToNative, Contract } from "soroban-client";
import { Keypair, Networks, TransactionBuilder, Operation, Asset, BASE_FEE } from "stellar-sdk";

export interface AgentGuardWalletConfig {
  rpcUrl: string;
  networkPassphrase: string;
  contractId: string;
}

export interface PasskeyValidatorConfig {
  rpcUrl: string;
  networkPassphrase: string;
  contractId: string;
}

export class AgentGuardWallet {
  private rpc: SorobanRpc.Server;
  private contract: Contract;
  private networkPassphrase: string;

  constructor(config: AgentGuardWalletConfig) {
    this.rpc = new SorobanRpc.Server(config.rpcUrl);
    this.networkPassphrase = config.networkPassphrase;
    this.contract = new Contract(config.contractId);
  }

  async checkSpendingLimit(token: string, amount: string): Promise<boolean> {
    const args = [
      nativeToScVal(token, { type: "address" }),
      nativeToScVal(amount, { type: "i128" }),
    ];
    const result = await this.rpc.call(this.contract.address.toString(), "check_allowance", args);
    return scValToNative(result) as boolean;
  }

  async spend(callerKeypair: Keypair, token: string, amount: string): Promise<string> {
    const args = [
      nativeToScVal(callerKeypair.publicKey(), { type: "address" }),
      nativeToScVal(token, { type: "address" }),
      nativeToScVal(amount, { type: "i128" }),
    ];

    const tx = await this.rpc.prepareTransaction(
      new TransactionBuilder(await this.rpc.getAccount(callerKeypair.publicKey()), {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(this.contract.call("spend", ...args))
        .setTimeout(30)
        .build()
    );

    tx.sign(callerKeypair);
    const response = await this.rpc.sendTransaction(tx);
    return response.hash;
  }
}

export class PasskeyValidator {
  private rpc: SorobanRpc.Server;
  private contract: Contract;
  private networkPassphrase: string;

  constructor(config: PasskeyValidatorConfig) {
    this.rpc = new SorobanRpc.Server(config.rpcUrl);
    this.networkPassphrase = config.networkPassphrase;
    this.contract = new Contract(config.contractId);
  }

  async isRegistered(user: string): Promise<boolean> {
    const args = [nativeToScVal(user, { type: "address" })];
    const result = await this.rpc.call(this.contract.address.toString(), "is_registered", args);
    return scValToNative(result) as boolean;
  }

  async verifySignature(user: string, challengeHash: string, signatureR: string, signatureS: string): Promise<boolean> {
    const args = [
      nativeToScVal(user, { type: "address" }),
      nativeToScVal(challengeHash, { type: "bytes" }),
      {
        r: nativeToScVal(signatureR, { type: "bytes" }),
        s: nativeToScVal(signatureS, { type: "bytes" }),
      },
    ];
    const result = await this.rpc.call(this.contract.address.toString(), "verify_signature", args);
    return scValToNative(result) as boolean;
  }
}
