// src/app.ts
import express from 'express';
import cors from 'cors';
import catRoutes from './routes/catRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', catRoutes);

export default app;

