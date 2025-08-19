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
exports.VendingMachineService = void 0;
const prismaClient_1 = __importDefault(require("../config/prismaClient"));
const MAX_STOCK = 10;
class VendingMachineService {
    // private chocolates: Chocolate[] = [
    //   { name: 'Toblerone', price: 5, quantity: 10 },
    //   { name: 'Snickers Pack', price: 8, quantity: 10 },
    //   { name: 'Ferrero', price: 15, quantity: 10 },
    // ];
    // private user: User = { cash: 200 };
    getInventory() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const [chocolates, userCash] = yield Promise.all([
                prismaClient_1.default.chocolate.findMany(),
                prismaClient_1.default.userCash.findUnique({ where: { id: 1 } }),
            ]);
            return {
                chocolates,
                userCash: (_a = userCash === null || userCash === void 0 ? void 0 : userCash.cash) !== null && _a !== void 0 ? _a : 0,
            };
            // return {
            //   chocolates: this.chocolates,
            //   userCash: this.user.cash,
            // };
        });
    }
    buyChocolate(name, cashInserted) {
        return __awaiter(this, void 0, void 0, function* () {
            // const chocolate = this.chocolates.find(c => c.name === name);
            const chocolate = yield prismaClient_1.default.chocolate.findUnique({ where: { name } });
            if (!chocolate) {
                throw new Error('Chocolate not found');
            }
            if (chocolate.quantity <= 0) {
                throw new Error('Out of stock');
            }
            if (cashInserted < chocolate.price) {
                throw new Error('Insufficient payment');
            }
            const user = yield prismaClient_1.default.userCash.findUnique({ where: { id: 1 } });
            if (!user || (user === null || user === void 0 ? void 0 : user.cash) < cashInserted) {
                throw new Error('User does not have enough cash');
            }
            const noOfChocolates = Math.floor(cashInserted / chocolate.price);
            yield prismaClient_1.default.chocolate.update({
                where: { name },
                data: { quantity: {
                        decrement: noOfChocolates
                    } }
            });
            const change = cashInserted - (chocolate.price * noOfChocolates);
            console.log(noOfChocolates);
            console.log(chocolate.price * noOfChocolates);
            yield prismaClient_1.default.userCash.update({
                where: { id: 1 },
                data: {
                    cash: {
                        increment: change
                    }
                }
            });
            // chocolate.quantity -= 1;
            // user.cash -= cashInserted;
            // user.cash += change;
            return { chocolate: chocolate.name, change };
        });
    }
    restockChocolate(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const chocolate = yield prismaClient_1.default.chocolate.findUnique({ where: { name } });
            if (!chocolate) {
                throw new Error('Chocolate not found');
            }
            if (chocolate.quantity >= MAX_STOCK) {
                throw new Error('Already at max stock');
            }
            yield prismaClient_1.default.chocolate.update({
                where: { name },
                data: { quantity: MAX_STOCK }
            });
            return chocolate;
        });
    }
    // reset() {
    //   this.chocolates = [
    //     { name: 'Toblerone', price: 5, quantity: 10 },
    //     { name: 'Snickers Pack', price: 8, quantity: 10 },
    //     { name: 'Ferrero', price: 15, quantity: 10 },
    //   ];
    //   this.user = { cash: 200 };
    // }
    reset() {
        return __awaiter(this, void 0, void 0, function* () {
            yield prismaClient_1.default.chocolate.deleteMany();
            yield prismaClient_1.default.chocolate.createMany({
                data: [
                    { name: 'Toblerone', price: 5, quantity: 10 },
                    { name: 'Snickers Pack', price: 8, quantity: 10 },
                    { name: 'Ferrero', price: 15, quantity: 10 }
                ]
            });
            yield prismaClient_1.default.userCash.upsert({
                where: { id: 1 },
                update: {},
                create: { id: 1, cash: 200 }
            });
        });
    }
}
exports.VendingMachineService = VendingMachineService;
