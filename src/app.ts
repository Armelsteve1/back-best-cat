// src/app.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import catRoutes from './routes/catRoutes';
import { loadCats } from './controllers/catController';
import './config/firebase';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 

loadCats().then(() => console.log('Initial cat data loaded'));
app.use('/api', catRoutes);

export default app;
