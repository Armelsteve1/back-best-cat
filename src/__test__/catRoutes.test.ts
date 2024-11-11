import request from 'supertest';
import express from 'express';
import router from '../routes/catRoutes';

jest.mock('firebase-admin');

const app = express();
app.use(express.json());
app.use('/api', router);

describe('Cat Routes', () => {
  it('GET /api/cats - should return a list of cats', async () => {
    const response = await request(app).get('/api/cats');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

//   it('POST /api/cats/:id/vote - should allow voting for a cat', async () => {
//     const response = await request(app).post('/api/cats/1dp/vote');
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id', '1dp');
//     expect(response.body).toHaveProperty('score');
//   });

//   it('GET /api/cats/:id/votes - should return votes for a specific cat', async () => {
//     const response = await request(app).get('/api/cats/1dp/votes');
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('votes');
//   });

  it('GET /api/voted-cats - should return a list of voted cats', async () => {
    const response = await request(app).get('/api/voted-cats');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
