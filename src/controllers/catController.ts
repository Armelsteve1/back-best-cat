import { Request, Response } from 'express';
import axios from 'axios';
import { db } from '../config/firebaseClient';
import { Cat } from '../models/cat';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  query,
  where,
} from 'firebase/firestore';

export const loadCats = async (): Promise<void> => {
  try {
    const catsCollection = collection(db, 'cats');
    const snapshot = await getDocs(catsCollection);

    if (snapshot.empty) {
      const response = await axios.get('https://data.latelier.co/cats.json');
      const cats = response.data.images.map((cat: any) => ({
        id: cat.id,
        name: cat.url,
        score: 0,
      }));

      for (const cat of cats) {
        await setDoc(doc(catsCollection, cat.id), cat);
      }
      console.log('Cat data successfully loaded.');
    } else {
      console.log('Cat data already exists in Firestore.');
    }
  } catch (error) {
    console.error('Error loading cat data:', error);
  }
};

export const getVotedCats = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const catsCollection = collection(db, 'cats');
    const votedCatsQuery = query(catsCollection, where('score', '>', 0));
    const snapshot = await getDocs(votedCatsQuery);
    const votedCats = snapshot.docs.map((doc) => doc.data() as Cat);
    return res.json(votedCats);
  } catch (error) {
    return handleError(error, res);
  }
};

export const getCats = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const catsCollection = collection(db, 'cats');
    const snapshot = await getDocs(catsCollection);
    const cats = snapshot.docs.map((doc) => doc.data() as Cat);
    return res.json(cats);
  } catch (error) {
    return handleError(error, res);
  }
};

export const voteCat = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const catRef = doc(db, 'cats', id);
    const catDoc = await getDoc(catRef);

    if (!catDoc.exists()) {
      return res.status(404).json({ error: 'Cat not found' });
    }

    const currentScore = catDoc.data()?.score || 0;
    await updateDoc(catRef, { score: currentScore + 1 });
    const updatedCat = (await getDoc(catRef)).data();

    return res.json(updatedCat);
  } catch (error) {
    return handleError(error, res);
  }
};

export const getVotes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const catRef = doc(db, 'cats', id);
    const catDoc = await getDoc(catRef);

    if (!catDoc.exists()) {
      return res.status(404).json({ error: 'Cat not found' });
    }

    const catData = catDoc.data() as Cat;
    return res.json({ id: catData.id, votes: catData.score });
  } catch (error) {
    return handleError(error, res);
  }
};

const handleError = (error: unknown, res: Response): Response => {
  if (error instanceof Error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: error.message });
  } else {
    console.error('Unknown error:', error);
    return res.status(500).json({ error: 'Unknown error occurred' });
  }
};
