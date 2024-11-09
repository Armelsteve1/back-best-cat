import { Request, Response } from 'express';
import { loadCats, getCats, getVotedCats, voteCat } from '../../controllers/catController';
import { Firestore } from 'firebase/firestore';
import { db } from '../../config/firebaseClient';
import { CollectionReference, DocumentData } from 'firebase/firestore';

jest.mock('../../config/firebaseClient', () => ({
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
  },
}));

describe('Tests avec fausses valeurs dans les contrôleurs de chats', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(() => mockResponse as Response),
    };
  });

  test('loadCats gère une réponse incorrecte de l\'API', async () => {
    const collectionMock = {
      get: jest.fn().mockResolvedValue({ empty: true }),
      doc: jest.fn().mockReturnThis(),
      set: jest.fn().mockResolvedValue({}),
    } as unknown as CollectionReference<DocumentData>;

    (db as unknown as Firestore).collection = jest.fn().mockReturnValue(collectionMock);

    // Simule une réponse API incorrecte (par exemple, sans le champ `images`)
    jest.spyOn(axios, 'get').mockResolvedValue({ data: {} });

    await loadCats();

    expect(collectionMock.set).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  test('getCats gère les documents de chats non valides', async () => {
    const collectionMock = {
      get: jest.fn().mockResolvedValue({
        docs: [{ data: () => ({ invalidField: '123' }) }],
      }),
    } as unknown as CollectionReference<DocumentData>;

    (db as unknown as Firestore).collection = jest.fn().mockReturnValue(collectionMock);

    await getCats({} as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith([{ invalidField: '123' }]);
  });

  test('getVotedCats gère les chats avec des scores non numériques', async () => {
    const collectionMock = {
      get: jest.fn().mockResolvedValue({
        docs: [
          { data: () => ({ id: '1', name: 'Cat1', score: 'non-numeric' }) },
        ],
      }),
    } as unknown as CollectionReference<DocumentData>;

    (db as unknown as Firestore).collection = jest.fn().mockReturnValue(collectionMock);

    await getVotedCats({} as Request, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith([
      { id: '1', name: 'Cat1', score: 'non-numeric' },
    ]);
  });

  test('voteCat gère une erreur de mise à jour', async () => {
    const mockRequest = { params: { id: '1' } } as unknown as Request;
    const mockCatDoc = { data: jest.fn(() => ({ score: 1 })), exists: true };

    const docMock = {
      get: jest.fn().mockResolvedValue(mockCatDoc),
      update: jest.fn().mockRejectedValue(new Error('Mise à jour échouée')),
    } as unknown as DocumentData;

    (db as unknown as Firestore).doc = jest.fn().mockReturnValue(docMock);

    await voteCat(mockRequest, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Mise à jour échouée' });
  });
});
