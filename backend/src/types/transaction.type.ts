export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  date: Date;
}