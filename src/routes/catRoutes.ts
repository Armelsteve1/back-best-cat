// src/routes/catRoutes.ts
import { Router } from 'express';
import { getCats, voteCat, getVotes, getVotedCats } from '../controllers/catController';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();
router.get('/cats', asyncHandler(getCats));
router.post('/cats/:id/vote', asyncHandler(voteCat));
router.get('/cats/:id/votes', asyncHandler(getVotes));
router.get('/voted-cats', asyncHandler(getVotedCats));

export default router;
