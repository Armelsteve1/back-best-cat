import admin from 'firebase-admin';
import serviceAccount from './firebaseServiceAccount.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: "https://best-cat-fd089.firebaseio.com" 
});

export const db = admin.firestore();
