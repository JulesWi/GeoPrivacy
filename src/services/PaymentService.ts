import { ethers } from 'ethers';
import { config } from '../config/web3Config';

export interface PaymentVerification {
  isValid: boolean;
  transactionHash?: string;
}

export class PaymentService {
  private provider: ethers.providers.Provider;
  private contractAddress: string;
  private contractABI: any[];

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
    this.contractAddress = config.contractAddress;
    this.contractABI = config.contractABI;
  }

  async verifyPayment(userAddress: string): Promise<PaymentVerification> {
    try {
      const contract = new ethers.Contract(
        this.contractAddress, 
        this.contractABI, 
        this.provider
      );

      // Vérifier le token de preuve
      const hasValidToken = await contract.validateAndConsumeProofToken(userAddress);

      return {
        isValid: hasValidToken,
        transactionHash: hasValidToken ? 'PROOF_TOKEN_CONSUMED' : undefined
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      return { isValid: false };
    }
  }

  async purchaseProofToken(
    userAddress: string, 
    privateKey: string
  ): Promise<string | null> {
    try {
      const wallet = new ethers.Wallet(privateKey, this.provider);
      const contract = new ethers.Contract(
        this.contractAddress, 
        this.contractABI, 
        wallet
      );

      // Acheter un token de preuve
      const tx = await contract.purchaseProofToken();
      await tx.wait();

      return tx.hash;
    } catch (error) {
      console.error('Token purchase error:', error);
      return null;
    }
  }
}
