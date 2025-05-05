import { LocationProofService } from '../../services/LocationProofService';
import { PaymentService } from '../../services/PaymentService';
import { LocationProof } from '../models/LocationProof';

// Mocks
jest.mock('../../services/PaymentService');
jest.mock('../models/LocationProof', () => ({
  LocationProof: jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(true)
  }))
}));

describe('LocationProofService', () => {
  let locationProofService: LocationProofService;
  let mockPaymentService: jest.Mocked<PaymentService>;

  beforeEach(() => {
    locationProofService = new LocationProofService();
    mockPaymentService = new PaymentService() as jest.Mocked<PaymentService>;
    
    // Configuration du mock PaymentService
    mockPaymentService.verifyPayment = jest.fn().mockResolvedValue({
      isValid: true,
      transactionHash: 'mock_transaction_hash'
    });
  });

  describe('generateLocationProof', () => {
    const mockRequest = {
      userId: 'user123',
      location: {
        latitude: 48.8566,
        longitude: 2.3522
      }
    };

    it('should generate location proof with valid payment', async () => {
      const result = await locationProofService.generateLocationProof(mockRequest);
      
      expect(result).toBeTruthy();
      expect(mockPaymentService.verifyPayment).toHaveBeenCalledWith(mockRequest.userId);
    });

    it('should throw error for invalid payment', async () => {
      // Configurer le mock pour un paiement invalide
      mockPaymentService.verifyPayment = jest.fn().mockResolvedValue({
        isValid: false
      });

      await expect(
        locationProofService.generateLocationProof(mockRequest)
      ).rejects.toThrow('Payment verification failed');
    });
  });

  describe('purchaseProofToken', () => {
    it('should purchase proof token', async () => {
      const mockPurchase = jest.fn().mockResolvedValue('purchase_tx_hash');
      mockPaymentService.purchaseProofToken = mockPurchase;

      const result = await locationProofService.purchaseProofToken(
        '0x1234', 
        'private_key'
      );

      expect(result).toBe('purchase_tx_hash');
      expect(mockPurchase).toHaveBeenCalledWith('0x1234', 'private_key');
    });
  });
});
