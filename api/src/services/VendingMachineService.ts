import { Chocolate } from '../models/Chocolate';
import { User } from '../models/User';
import prisma from '../config/prismaClient';

const MAX_STOCK = 10;

export class VendingMachineService {
  // private chocolates: Chocolate[] = [
  //   { name: 'Toblerone', price: 5, quantity: 10 },
  //   { name: 'Snickers Pack', price: 8, quantity: 10 },
  //   { name: 'Ferrero', price: 15, quantity: 10 },
  // ];
  // private user: User = { cash: 200 };

  async getInventory() {
    const [chocolates, userCash] = await Promise.all([
        prisma.chocolate.findMany(),
        prisma.userCash.findUnique({ where: { id: 1 } }),
    ]);
    return {
        chocolates,
        userCash: userCash?.cash ?? 0,
    };
    // return {
    //   chocolates: this.chocolates,
    //   userCash: this.user.cash,
    // };
  }

  async buyChocolate(name: string, cashInserted: number) {
    // const chocolate = this.chocolates.find(c => c.name === name);
    const chocolate = await prisma.chocolate.findUnique({ where : { name }})

    if (!chocolate) {
      throw new Error('Chocolate not found');
    }
    if (chocolate.quantity <= 0) {
      throw new Error('Out of stock');
    }
    if (cashInserted < chocolate.price) {
      throw new Error('Insufficient payment');
    }


    const user = await prisma.userCash.findUnique({ where : { id : 1 }});
    if (!user || user?.cash < cashInserted) {
      throw new Error('User does not have enough cash');
    }

    const noOfChocolates = Math.floor(cashInserted/chocolate.price);

    await prisma.chocolate.update({
      where : { name },
      data : { quantity : {
        decrement : noOfChocolates
      }}
    });

    const change = cashInserted - (chocolate.price * noOfChocolates);
    console.log(noOfChocolates);
    
    console.log(chocolate.price * noOfChocolates);
    

    await prisma.userCash.update({
      where : { id : 1 },
      data : {
        cash : {
          increment : change
        }}
    })


    // chocolate.quantity -= 1;
    // user.cash -= cashInserted;
    // user.cash += change;
    return { chocolate: chocolate.name, change };
  }

  async restockChocolate(name: string) {
    const chocolate = await prisma.chocolate.findUnique({ where : { name }});
    if (!chocolate) {
      throw new Error('Chocolate not found');
    }
    if (chocolate.quantity >= MAX_STOCK) {
      throw new Error('Already at max stock');
    }
    await prisma.chocolate.update({
      where : { name },
      data : { quantity : MAX_STOCK}
    });
    return chocolate;
  }

  // reset() {
  //   this.chocolates = [
  //     { name: 'Toblerone', price: 5, quantity: 10 },
  //     { name: 'Snickers Pack', price: 8, quantity: 10 },
  //     { name: 'Ferrero', price: 15, quantity: 10 },
  //   ];
  //   this.user = { cash: 200 };
  // }

  async reset() {
    await prisma.chocolate.deleteMany();
    await prisma.chocolate.createMany({
      data: [
        { name: 'Toblerone', price: 5, quantity: 10 },
        { name: 'Snickers Pack', price: 8, quantity: 10 },
        { name: 'Ferrero', price: 15, quantity: 10 }
      ]});

    await prisma.userCash.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, cash: 200 }
    });
  }
} 