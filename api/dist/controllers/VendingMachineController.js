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
exports.VendingMachineController = exports.vendingService = void 0;
const VendingMachineService_1 = require("../services/VendingMachineService");
const vendingService = new VendingMachineService_1.VendingMachineService();
exports.vendingService = vendingService;
class VendingMachineController {
    static getInventory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const inventory = yield vendingService.getInventory();
            res.json(inventory);
        });
    }
    static buyChocolate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, cashInserted } = req.body;
            if (!name || typeof cashInserted !== 'number') {
                return res.status(400).json({ error: 'Name and cashInserted are required' });
            }
            try {
                const result = yield vendingService.buyChocolate(name, cashInserted);
                res.json(result);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    static restockChocolate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ error: 'Name is required' });
            }
            try {
                const result = yield vendingService.restockChocolate(name);
                res.json(result);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
}
exports.VendingMachineController = VendingMachineController;
