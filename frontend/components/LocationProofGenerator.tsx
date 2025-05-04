import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

// Disable SSR for Leaflet components due to window object dependency
const DynamicMapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const DynamicTileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const DynamicMarker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });

interface LocationProof {
  latitude: number;
  longitude: number;
  timestamp: Date;
  proof: string;
}

export default function LocationProofGenerator() {
  const [proof, setProof] = useState<LocationProof | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]); // Default to Paris

  const generateProof = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const mockProof: LocationProof = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date(),
            proof: 'mock_zero_knowledge_proof'
          };

          setProof(mockProof);
          setMapCenter([mockProof.latitude, mockProof.longitude]);
        } catch (error) {
          console.error('Error generating proof', error);
        }
      });
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">Generate Location Proof</h2>
          <p className="text-gray-600">Create a zero-knowledge proof of your location</p>
          
          <button 
            onClick={generateProof}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Generate Proof
          </button>

          {proof && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-semibold text-blue-800 mb-2">Proof Details</h3>
              <p className="text-gray-700">Latitude: {proof.latitude.toFixed(4)}</p>
              <p className="text-gray-700">Longitude: {proof.longitude.toFixed(4)}</p>
              <p className="text-gray-700">Timestamp: {proof.timestamp.toLocaleString()}</p>
            </div>
          )}
        </div>
        
        <div className="h-96 w-full rounded-lg overflow-hidden shadow-md">
          <DynamicMapContainer 
            center={mapCenter as LatLngExpression} 
            zoom={10} 
            scrollWheelZoom={false} 
            className="h-full w-full"
          >
            <DynamicTileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {proof && (
              <DynamicMarker 
                position={[proof.latitude, proof.longitude] as LatLngExpression} 
              />
            )}
          </DynamicMapContainer>
        </div>
      </div>
    </div>
  );
}
