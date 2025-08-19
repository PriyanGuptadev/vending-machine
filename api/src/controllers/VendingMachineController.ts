import { Request, Response } from 'express';
import { VendingMachineService } from '../services/VendingMachineService';

const vendingService = new VendingMachineService();
export { vendingService };

export class VendingMachineController {
  static async getInventory(req: Request, res: Response) {
    const inventory = await vendingService.getInventory();
    res.json(inventory);
  }

  static async buyChocolate(req: Request, res: Response) {
    const { name, cashInserted } = req.body;
    if (!name || typeof cashInserted !== 'number') {
      return res.status(400).json({ error: 'Name and cashInserted are required' });
    }
    try {
      const result = await vendingService.buyChocolate(name, cashInserted);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async restockChocolate(req: Request, res: Response) {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    try {
      const result = await vendingService.restockChocolate(name);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
} 