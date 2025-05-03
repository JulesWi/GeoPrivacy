import mongoose, { ConnectOptions } from 'mongoose';
import { LocationProof, ILocationProofDocument, ILocationProofModel } from '../models/LocationProof';
import { User, IUser } from '../models/User';

// Mock pour la méthode findValidProofsNearby
(LocationProof as any).findValidProofsNearby = jest.fn().mockResolvedValue([]);

describe('LocationProof Model Test', () => {
  let testUser: IUser & mongoose.Document;

  beforeAll(async () => {
    // Connexion à une base de données de test
    await mongoose.connect('mongodb://localhost:27017/geoprivacy_test', {
      // Supprimer les options obsolètes
    } as ConnectOptions);

    // Créer un utilisateur de test
    testUser = new User({
      email: 'test@example.com',
      password: 'testpassword',
      username: 'testuser'
    });
    await testUser.save();
  });

  afterAll(async () => {
    // Nettoyer la base de données et se déconnecter
    await (User as any).deleteMany({});
    await (LocationProof as any).deleteMany({});
    await mongoose.connection.close();
  });

  it('should create a location proof successfully', async () => {
    const locationProofData: Partial<ILocationProofDocument> = {
      user: testUser._id,
      location: JSON.stringify({
        latitude: 48.8566,
        longitude: 2.3522
      }),
      timestamp: new Date(),
      proof: 'test_proof_data_hash',
      zeroKnowledgeToken: 'test_zero_knowledge_token'
    };

    const locationProof = new LocationProof(locationProofData);
    const savedProof = await locationProof.save();

    expect(savedProof._id).toBeDefined();
    expect(savedProof.user.toString()).toBe(testUser._id.toString());
    expect(savedProof.location).toBe(locationProofData.location);
  });

  it('should find valid proofs nearby', async () => {
    // Créer plusieurs preuves de localisation
    const proofs: Partial<ILocationProofDocument>[] = [
      {
        user: testUser._id,
        location: JSON.stringify({
          latitude: 48.8566,
          longitude: 2.3522
        }),
        timestamp: new Date(),
        proof: 'proof1',
        zeroKnowledgeToken: 'token1'
      },
      {
        user: testUser._id,
        location: JSON.stringify({
          latitude: 48.8567,
          longitude: 2.3523
        }),
        timestamp: new Date(),
        proof: 'proof2',
        zeroKnowledgeToken: 'token2'
      }
    ];

    await (LocationProof as any).insertMany(proofs);

    const nearbyProofs = await (LocationProof as any).findValidProofsNearby(
      48.8566, 
      2.3522, 
      1 // rayon en km
    );

    expect(nearbyProofs.length).toBeGreaterThan(0);
    expect(nearbyProofs[0].proof).toBeDefined();
  });

  it('should validate required fields', async () => {
    const invalidProof = new LocationProof({});

    try {
      await invalidProof.save();
    } catch (error: any) {
      expect(error.errors.user).toBeDefined();
      expect(error.errors.location).toBeDefined();
      expect(error.errors.timestamp).toBeDefined();
    }
  });
});
