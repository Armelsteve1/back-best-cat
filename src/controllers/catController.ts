import { Request, Response } from 'express';
import axios from 'axios';
import { db } from '../config/firebase';
import { Cat } from '../models/cat';

export const loadCats = async (): Promise<void> => {
  const catsCollection = db.collection('cats');
  const snapshot = await catsCollection.get();

  if (snapshot.empty) {
    const response = await axios.get('https://data.latelier.co/cats.json');
    const cats = response.data.images.map((cat: any) => ({
      id: cat.id,
      name: cat.url,
      score: 0
    }));

    for (const cat of cats) {
      await catsCollection.doc(cat.id).set(cat);
    }
  }
};

export const getVotedCats = async (req: Request, res: Response): Promise<Response> => {
  try {
    const snapshot = await db.collection('cats').get();
    const votedCats = snapshot.docs
      .map((doc) => doc.data() as Cat)
      .filter((cat) => cat.score > 0); 

    return res.json(votedCats);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};

export const getCats = async (req: Request, res: Response): Promise<Response> => {
  try {
    const snapshot = await db.collection('cats').get();
    const cats = snapshot.docs.map((doc) => doc.data()) as Cat[];
    return res.json(cats);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};

export const voteCat = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const catRef = db.collection('cats').doc(id);
    const catDoc = await catRef.get();

    if (!catDoc.exists) {
      return res.status(404).json({ error: "Cat not found" });
    }

    const currentScore = catDoc.data()?.score || 0;
    await catRef.update({ score: currentScore + 1 });
    const updatedCat = await catRef.get();

    return res.json(updatedCat.data());
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};

export const getVotes = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const catRef = db.collection('cats').doc(id);
    const catDoc = await catRef.get();

    if (!catDoc.exists) {
      return res.status(404).json({ error: "Cat not found" });
    }

    const catData = catDoc.data() as Cat;
    return res.json({ id: catData.id, votes: catData.score });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};
