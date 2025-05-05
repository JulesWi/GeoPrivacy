import { env } from 'process';

export const config = {
  // OP Sepolia RPC
  rpcUrl: env.OP_SEPOLIA_RPC_URL || 'https://sepolia.optimism.io',
  
  // Adresse du contrat déployé
  contractAddress: env.GEOPRIVACY_CONTRACT_ADDRESS || '0x...',
  
  // ABI du contrat (à compléter après le déploiement)
  contractABI: [
    // Fonctions principales
    {
      "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
      "name": "validateAndConsumeProofToken",
      "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "purchaseProofToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],

  // Configuration du paiement
  proofCost: {
    amount: 0.5, // 0.5 USDC
    token: 'USDC',
    network: 'OP Sepolia'
  }
};
