import { Router } from 'express';
import { VendingMachineController } from '../controllers/VendingMachineController';

/**
 * @swagger
 * tags:
 *   name: VendingMachine
 *   description: Vending Machine operations
 */

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get inventory and user cash
 *     tags: [VendingMachine]
 *     responses:
 *       200:
 *         description: Inventory and user cash
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chocolates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Chocolate'
 *                 userCash:
 *                   type: number
 */

/**
 * @swagger
 * /api/buy:
 *   post:
 *     summary: Buy a chocolate
 *     tags: [VendingMachine]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cashInserted:
 *                 type: number
 *     responses:
 *       200:
 *         description: Chocolate dispensed and change returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chocolate:
 *                   type: string
 *                 change:
 *                   type: number
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * /api/restock:
 *   post:
 *     summary: Restock a chocolate
 *     tags: [VendingMachine]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chocolate restocked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chocolate'
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Chocolate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         quantity:
 *           type: number
 */

const router = Router();

router.get('/inventory', VendingMachineController.getInventory);
router.post('/buy', VendingMachineController.buyChocolate);
router.post('/restock', VendingMachineController.restockChocolate);

export default router; 