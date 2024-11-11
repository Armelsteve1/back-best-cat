const firestore = jest.fn().mockReturnValue({
  collection: jest.fn().mockReturnValue({
    doc: jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({ id: '1dp', name: 'Test Cat', score: 2, votes: 5 }),
      }),
      set: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
    }),
  }),
});

module.exports = { firestore };
