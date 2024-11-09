import express from 'express';
import { loadCats } from './src/controllers/catController';

const app = express();
const PORT = process.env.PORT || 3000;

loadCats().then(() => console.log("Les données de chats ont été chargées."));

app.listen(PORT, () => {
});
