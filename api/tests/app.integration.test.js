"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const VendingMachineController_1 = require("../src/controllers/VendingMachineController");
describe('Vending Machine API', () => {
    // Reset state by re-importing app for each test suite if needed
    beforeEach(() => {
        VendingMachineController_1.vendingService.reset();
    });
    it('GET /api/inventory should return inventory and user cash', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/inventory');
        expect(res.status).toBe(200);
        expect(res.body.chocolates).toBeInstanceOf(Array);
        expect(res.body.userCash).toBeDefined();
    }));
    it('POST /api/buy should buy a chocolate and return change', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/buy')
            .send({ name: 'Toblerone', cashInserted: 10 });
        expect(res.status).toBe(200);
        expect(res.body.chocolate).toBe('Toblerone');
        expect(res.body.change).toBe(5);
    }));
    it('POST /api/buy should return error if out of stock', () => __awaiter(void 0, void 0, void 0, function* () {
        // Deplete stock
        for (let i = 0; i < 10; i++) {
            yield (0, supertest_1.default)(app_1.default).post('/api/buy').send({ name: 'Snickers Pack', cashInserted: 8 });
        }
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/buy').send({ name: 'Snickers Pack', cashInserted: 8 });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Out of stock');
    }));
    it('POST /api/buy should return error if payment is insufficient', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/buy')
            .send({ name: 'Ferrero', cashInserted: 2 });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Insufficient payment');
    }));
    it('POST /api/buy should return error if user does not have enough cash', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/buy')
            .send({ name: 'Ferrero', cashInserted: 999 });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('User does not have enough cash');
    }));
    it('POST /api/buy should return error if chocolate does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/buy')
            .send({ name: 'Mars', cashInserted: 10 });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Chocolate not found');
    }));
    it('POST /api/restock should restock a chocolate to max', () => __awaiter(void 0, void 0, void 0, function* () {
        // Deplete some stock
        yield (0, supertest_1.default)(app_1.default).post('/api/buy').send({ name: 'Ferrero', cashInserted: 15 });
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/restock').send({ name: 'Ferrero' });
        expect(res.status).toBe(200);
        expect(res.body.quantity).toBe(10);
    }));
    it('POST /api/restock should return error if already at max', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/restock').send({ name: 'Toblerone' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Already at max stock');
    }));
    it('POST /api/restock should return error if chocolate does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).post('/api/restock').send({ name: 'KitKat' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Chocolate not found');
    }));
});
