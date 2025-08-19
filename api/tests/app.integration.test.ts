import request from 'supertest';
import app from '../src/app';
import { vendingService } from '../src/controllers/VendingMachineController';

describe('Vending Machine API', () => {
  // Reset state by re-importing app for each test suite if needed
  beforeEach(() => {
    vendingService.reset();
  });

  it('GET /api/inventory should return inventory and user cash', async () => {
    const res = await request(app).get('/api/inventory');
    expect(res.status).toBe(200);
    expect(res.body.chocolates).toBeInstanceOf(Array);
    expect(res.body.userCash).toBeDefined();
  });

  it('POST /api/buy should buy a chocolate and return change', async () => {
    const res = await request(app)
      .post('/api/buy')
      .send({ name: 'Toblerone', cashInserted: 10 });
    expect(res.status).toBe(200);
    expect(res.body.chocolate).toBe('Toblerone');
    expect(res.body.change).toBe(5);
  });

  it('POST /api/buy should return error if out of stock', async () => {
    // Deplete stock
    for (let i = 0; i < 10; i++) {
      await request(app).post('/api/buy').send({ name: 'Snickers Pack', cashInserted: 8 });
    }
    const res = await request(app).post('/api/buy').send({ name: 'Snickers Pack', cashInserted: 8 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Out of stock');
  });

  it('POST /api/buy should return error if payment is insufficient', async () => {
    const res = await request(app)
      .post('/api/buy')
      .send({ name: 'Ferrero', cashInserted: 2 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Insufficient payment');
  });

  it('POST /api/buy should return error if user does not have enough cash', async () => {
    const res = await request(app)
      .post('/api/buy')
      .send({ name: 'Ferrero', cashInserted: 999 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('User does not have enough cash');
  });

  it('POST /api/buy should return error if chocolate does not exist', async () => {
    const res = await request(app)
      .post('/api/buy')
      .send({ name: 'Mars', cashInserted: 10 });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Chocolate not found');
  });

  it('POST /api/restock should restock a chocolate to max', async () => {
    // Deplete some stock
    await request(app).post('/api/buy').send({ name: 'Ferrero', cashInserted: 15 });
    const res = await request(app).post('/api/restock').send({ name: 'Ferrero' });
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(10);
  });

  it('POST /api/restock should return error if already at max', async () => {
    const res = await request(app).post('/api/restock').send({ name: 'Toblerone' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Already at max stock');
  });

  it('POST /api/restock should return error if chocolate does not exist', async () => {
    const res = await request(app).post('/api/restock').send({ name: 'KitKat' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Chocolate not found');
  });
}); 