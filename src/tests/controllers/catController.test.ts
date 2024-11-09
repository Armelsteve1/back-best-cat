import { Request, Response } from 'express';
import axios from 'axios';
import { loadCats, getCats, getVotedCats, voteCat } from '../../controllers/catController';
import { db } from '../../config/firebaseClient';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

// Mock Firestore methods
jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');
  return {
    ...originalModule,
    getFirestore: jest.fn(),
    collection: jest.fn(),
    doc: jest.fn(),
    getDocs: jest.fn(),
    setDoc: jest.fn(),
  };
});

describe('Tests des contrôleurs de chats avec Firestore mocké', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(() => mockResponse as Response),
    };
  });

  test('loadCats charge les données de chats si Firestore est vide', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({ empty: true });

    (setDoc as jest.Mock).mockResolvedValueOnce({});

    jest.spyOn(axios, 'get').mockResolvedValueOnce({
      data: { images: [{ id: '1', url: 'https://example.com/cat.jpg' }] },
    });

    await loadCats();

    expect(setDoc).toHaveBeenCalled();
  });

  test('getCats renvoie tous les chats', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: [{ data: () => ({ id: '1', name: 'Cat1', score: 0 }) }],
    });

    await getCats({} as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith([
      { id: '1', name: 'Cat1', score: 0 },
    ]);
  });

  test('getVotedCats renvoie les chats avec un score > 0', async () => {
    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: [
        { data: () => ({ id: '1', name: 'Cat1', score: 5 }) },
        { data: () => ({ id: '2', name: 'Cat2', score: 0 }) },
      ],
    });

    await getVotedCats({} as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith([{ id: '1', name: 'Cat1', score: 5 }]);
  });

  test('voteCat augmente le score du chat spécifié', async () => {
    const mockRequest = { params: { id: '1' } } as unknown as Request;

    (doc as jest.Mock).mockReturnValue({
      get: jest.fn().mockResolvedValue({ exists: true, data: () => ({ score: 1 }) }),
      update: jest.fn().mockResolvedValue({}),
    });

    await voteCat(mockRequest, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith({ score: 2 });
  });
});
