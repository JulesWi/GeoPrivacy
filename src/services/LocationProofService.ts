import { PaymentService } from './PaymentService';
import { LocationProof } from '../backend/models/LocationProof';
import { ZeroKnowledgeProofGenerator } from './ZeroKnowledgeProofGenerator';
import { config } from '../config/web3Config';

export interface LocationProofRequest {
  userId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  paymentTransaction?: string;
}

export class LocationProofService {
  private paymentService: PaymentService;
  private proofGenerator: ZeroKnowledgeProofGenerator;

  constructor() {
    this.paymentService = new PaymentService();
    this.proofGenerator = new ZeroKnowledgeProofGenerator();
  }

  async generateLocationProof(
    request: LocationProofRequest
  ): Promise<string | null> {
    try {
      // 1. Vérifier le paiement
      const paymentVerification = await this.paymentService.verifyPayment(
        request.userId
      );

      if (!paymentVerification.isValid) {
        throw new Error('Payment verification failed. Please purchase a proof token.');
      }

      // 2. Générer la preuve ZK
      const zkProof = await this.proofGenerator.generateProof({
        userId: request.userId,
        location: request.location
      });

      // 3. Enregistrer la preuve avec les détails de transaction
      const locationProof = new LocationProof({
        user: request.userId,
        location: JSON.stringify(request.location),
        timestamp: new Date(),
        proof: zkProof,
        zeroKnowledgeToken: 'generated_token', // À remplacer par un token réel
        paymentTransaction: {
          hash: paymentVerification.transactionHash || 'PROOF_TOKEN_CONSUMED',
          network: config.proofCost.network,
          amount: config.proofCost.amount,
          token: config.proofCost.token
        }
      });

      await locationProof.save();

      return zkProof;
    } catch (error) {
      console.error('Location proof generation error:', error);
      return null;
    }
  }

  async purchaseProofToken(
    userAddress: string, 
    privateKey: string
  ): Promise<string | null> {
    return this.paymentService.purchaseProofToken(userAddress, privateKey);
  }
}
