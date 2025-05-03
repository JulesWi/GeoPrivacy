import React, { useState } from 'react';

interface LocationProof {
  latitude: number;
  longitude: number;
  timestamp: Date;
  proof: string;
}

export default function LocationProofGenerator() {
  const [proof, setProof] = useState<LocationProof | null>(null);

  const generateProof = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          // Futur appel API
          const mockProof: LocationProof = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date(),
            proof: 'mock_zero_knowledge_proof'
          };

          setProof(mockProof);
        } catch (error) {
          console.error('Error generating proof', error);
        }
      });
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Generate Location Proof</h2>
      <button 
        onClick={generateProof}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Generate Proof
      </button>

      {proof && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3>Proof Details:</h3>
          <p>Latitude: {proof.latitude}</p>
          <p>Longitude: {proof.longitude}</p>
          <p>Timestamp: {proof.timestamp.toString()}</p>
        </div>
      )}
    </div>
  );
}
