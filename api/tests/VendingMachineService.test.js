"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VendingMachineService_1 = require("../src/services/VendingMachineService");
describe('VendingMachineService', () => {
    let service;
    beforeEach(() => {
        service = new VendingMachineService_1.VendingMachineService();
    });
    it('should return initial inventory and user cash', () => {
        const inventory = service.getInventory();
        expect(inventory.chocolates).toHaveLength(3);
        expect(inventory.userCash).toBe(200);
    });
    it('should buy a chocolate and return change', () => {
        const result = service.buyChocolate('Toblerone', 10);
        expect(result.chocolate).toBe('Toblerone');
        expect(result.change).toBe(5);
        const inventory = service.getInventory();
        const choc = inventory.chocolates.find(c => c.name === 'Toblerone');
        expect(choc === null || choc === void 0 ? void 0 : choc.quantity).toBe(9);
        expect(inventory.userCash).toBe(195); // cash spent and change returned
    });
    it('should throw if chocolate is out of stock', () => {
        // Deplete stock
        for (let i = 0; i < 10; i++) {
            service.buyChocolate('Toblerone', 5);
        }
        expect(() => service.buyChocolate('Toblerone', 5)).toThrow('Out of stock');
    });
    it('should throw if payment is insufficient', () => {
        expect(() => service.buyChocolate('Snickers Pack', 2)).toThrow('Insufficient payment');
    });
    it('should throw if user does not have enough cash', () => {
        // User has $200, try to insert $201
        expect(() => service.buyChocolate('Ferrero', 201)).toThrow('User does not have enough cash');
    });
    it('should throw if chocolate does not exist', () => {
        expect(() => service.buyChocolate('Mars', 10)).toThrow('Chocolate not found');
    });
    it('should restock a chocolate to max', () => {
        // Deplete some stock
        service.buyChocolate('Ferrero', 15);
        let choc = service.getInventory().chocolates.find(c => c.name === 'Ferrero');
        expect(choc === null || choc === void 0 ? void 0 : choc.quantity).toBe(9);
        // Restock
        const restocked = service.restockChocolate('Ferrero');
        expect(restocked.quantity).toBe(10);
    });
    it('should throw if restocking a chocolate already at max', () => {
        expect(() => service.restockChocolate('Snickers Pack')).toThrow('Already at max stock');
    });
    it('should throw if restocking a chocolate that does not exist', () => {
        expect(() => service.restockChocolate('KitKat')).toThrow('Chocolate not found');
    });
});
