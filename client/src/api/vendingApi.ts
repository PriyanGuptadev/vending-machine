import api from './axios';

export interface Chocolate {
  name: string;
  price: number;
  quantity: number;
}

export interface InventoryResponse {
  chocolates: Chocolate[];
  userCash: number;
}

export const getInventory = async (): Promise<InventoryResponse> => {
  const res = await api.get<InventoryResponse>('/inventory');
  return res.data;
};

export const buyChocolate = async (name: string, cashInserted: number) => {
  const res = await api.post('/buy', { name, cashInserted });
  return res.data;
};

export const restockChocolate = async (name: string) => {
  const res = await api.post('/restock', { name });
  return res.data;
}; 