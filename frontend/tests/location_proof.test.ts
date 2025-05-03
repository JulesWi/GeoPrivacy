import { Noir } from '@noir-lang/noir_js'
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg'
import locationProofCircuit from '../circuits/location_proof.nr'

describe('Location Proof Circuit', () => {
  let noir: Noir;
  let backend: BarretenbergBackend;

  beforeAll(async () => {
    backend = new BarretenbergBackend(locationProofCircuit);
    noir = new Noir(locationProofCircuit, backend);
  });

  test('Valid location proof within Paris radius', async () => {
    const proof = await noir.generateProof({
      latitude: 48.8566, // Centre de Paris
      longitude: 2.3522, 
      timestamp: Date.now()
    });

    const isValid = await noir.verifyProof(proof);
    expect(isValid).toBe(true);
  });

  test('Invalid location proof outside Paris radius', async () => {
    const proof = await noir.generateProof({
      latitude: 49.8966, // Loin de Paris
      longitude: 3.3922, 
      timestamp: Date.now()
    });

    const isValid = await noir.verifyProof(proof);
    expect(isValid).toBe(false);
  });

  afterAll(async () => {
    await backend.destroy();
  });
});
