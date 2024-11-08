import admin from 'firebase-admin';
import dotenv from 'dotenv';
import serviceAccount from './firebaseServiceAccount.json';

dotenv.config();

const firebaseConfig = process.env.NODE_ENV === 'production'
  ? {
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    }
  : {
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    };

admin.initializeApp({
  ...firebaseConfig,
  databaseURL: "https://best-cat-fd089.firebaseio.com",
});

export const db = admin.firestore();
