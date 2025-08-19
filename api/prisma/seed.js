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
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../src/generated/prisma");
const prisma = new prisma_1.PrismaClient();
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.chocolate.deleteMany();
        yield prisma.userCash.deleteMany();
        yield prisma.chocolate.createMany({
            data: [
                { name: 'Toblerone', price: 5, quantity: 10 },
                { name: 'Snickers Pack', price: 8, quantity: 10 },
                { name: 'Ferrero', price: 15, quantity: 10 }
            ],
        });
        yield prisma.userCash.upsert({
            where: { id: 1 },
            update: {},
            create: { id: 1, cash: 200 }
        });
        console.log('Seed data inserted');
    });
}
seed().finally(() => prisma.$disconnect());
