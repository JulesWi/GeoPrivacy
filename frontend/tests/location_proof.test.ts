import { CompiledCircuit } from '@noir-lang/noir_js'
import { BarretenbergBackend } from '@aztec/bb.js'

// Importation du circuit Noir
declare module '../circuits/location_proof.nr' {
  const main: (latitude: number, longitude: number, timestamp: number) => boolean;
}

describe('Location Proof Circuit', () => {
  let backend: any;

  beforeAll(async () => {
    // Initialisation du backend
    backend = await BarretenbergBackend.new();
  });

  test('Preuve de localisation à Paris valide', async () => {
    // Coordonnées proches du centre de Paris
    const inputs = {
      latitude: 48.8566,
      longitude: 2.3522,
      timestamp: Math.floor(Date.now() / 1000) // Timestamp en secondes
    };

    const proof = await backend.generateProof(inputs);
    const verification = await backend.verifyProof(proof);

    expect(verification).toBe(true);
  });

  test('Preuve de localisation hors de Paris invalide', async () => {
    // Coordonnées loin de Paris
    const inputs = {
      latitude: 50.8503,
      longitude: 4.3517, // Bruxelles
      timestamp: Math.floor(Date.now() / 1000)
    };

    const proof = await backend.generateProof(inputs);
    const verification = await backend.verifyProof(proof);

    expect(verification).toBe(false);
  });

  test('Preuve avec timestamp expiré', async () => {
    // Timestamp très ancien
    const inputs = {
      latitude: 48.8566,
      longitude: 2.3522,
      timestamp: Math.floor(Date.now() / 1000) - 100000 // Timestamp très ancien
    };

    const proof = await backend.generateProof(inputs);
    const verification = await backend.verifyProof(proof);

    expect(verification).toBe(false);
  });

  afterAll(async () => {
    await backend.destroy();
  });
});
