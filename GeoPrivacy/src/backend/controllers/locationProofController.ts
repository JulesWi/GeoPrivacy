import { Request, Response } from 'express';
import { LocationProof } from '../models/LocationProof';
import { authenticateJWT } from '../middleware/auth';

export const locationProofController = {
  async createProof(req: Request, res: Response) {
    try {
      const { location, timestamp, proof } = req.body;
      const userId = req.user?._id;

      const newProof = new LocationProof({
        user: userId,
        location,
        timestamp,
        proof
      });

      await newProof.save();

      res.status(201).json({
        message: 'Location proof created successfully',
        proof: newProof
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Error creating location proof', 
        error: error.message 
      });
    }
  },

  async getProofsByUser(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      const proofs = await LocationProof.find({ user: userId });

      res.json({
        message: 'Location proofs retrieved successfully',
        proofs
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Error retrieving location proofs', 
        error: error.message 
      });
    }
  },

  async findValidProofsNearby(req: Request, res: Response) {
    try {
      const { latitude, longitude, radius } = req.body;

      const nearbyProofs = await LocationProof.findValidProofsNearby(
        latitude, 
        longitude, 
        radius
      );

      res.json({
        message: 'Nearby valid location proofs retrieved',
        proofs: nearbyProofs
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: 'Error finding nearby proofs', 
        error: error.message 
      });
    }
  }
};
