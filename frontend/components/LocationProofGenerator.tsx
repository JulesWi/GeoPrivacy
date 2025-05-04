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
    <div className="min-h-screen bg-gradient-to-br from-primary-light/30 to-secondary-light/30 py-8">
      <div className="container mx-auto p-6 bg-white rounded-xl shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-primary-dark mb-2">GeoPrivacy</h1>
          <p className="text-secondary-dark text-lg">Générez des preuves de localisation avec confidentialité</p>
          <div className="h-1 w-32 bg-gradient-to-r from-primary to-secondary mx-auto my-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6 bg-gray-50 p-6 rounded-lg shadow-md border border-primary-light/30">
            <div>
              <h2 className="text-3xl font-bold text-primary-dark mb-2">Générer une preuve</h2>
              <p className="text-gray-600">Créez une preuve à connaissance nulle de votre position actuelle</p>
            </div>
            
            <button 
              onClick={generateProof}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
            >
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Générer une preuve
              </span>
            </button>

            {proof && (
              <div className="bg-secondary-light/20 border-l-4 border-secondary p-5 rounded-lg">
                <h3 className="font-semibold text-secondary-dark text-xl mb-3">Détails de la preuve</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-28">Latitude:</span>
                    <span className="bg-white px-3 py-1 rounded-md shadow-sm text-secondary-dark">{proof.latitude.toFixed(4)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-28">Longitude:</span>
                    <span className="bg-white px-3 py-1 rounded-md shadow-sm text-secondary-dark">{proof.longitude.toFixed(4)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-28">Horodatage:</span>
                    <span className="bg-white px-3 py-1 rounded-md shadow-sm text-secondary-dark">{proof.timestamp.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-white rounded-md border border-secondary-light">
                  <p className="text-xs text-gray-500">Preuve ZK: <span className="font-mono text-primary-dark">{proof.proof}</span></p>
                </div>
              </div>
            )}
          </div>
          
          <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg border-4 border-secondary-light">
            <DynamicMapContainer 
              center={mapCenter as LatLngExpression} 
              zoom={13} 
              scrollWheelZoom={true} 
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

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">GeoPrivacy utilise des preuves à connaissance nulle pour protéger vos données de localisation</p>
          <div className="flex justify-center space-x-4 mt-4">
            <span className="px-3 py-1 bg-primary-light/20 text-primary-dark rounded-full text-sm">Zero-Knowledge</span>
            <span className="px-3 py-1 bg-secondary-light/20 text-secondary-dark rounded-full text-sm">Noir Circuit</span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Next.js</span>
          </div>
        </div>
      </div>
    </div>
  );
}
