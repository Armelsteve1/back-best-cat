import express from 'express';
import { loadCats } from './src/controllers/catController';

const app = express();
const PORT = process.env.PORT || 3000;

// Appel de loadCats pour peupler les données au démarrage
loadCats().then(() => console.log("Les données de chats ont été chargées."));

app.listen(PORT, () => {
  console.log(`Le serveur est démarré sur le port ${PORT}`);
});
