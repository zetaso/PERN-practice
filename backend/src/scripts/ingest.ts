import { pool } from '../config/db';
import fs from 'fs';
import { Transaction } from '../types/transaction.type';

interface RawTransaction {
  id: number;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  date: string;
}

async function ingest() {
    try {
        const rawData = fs.readFileSync('./transactions.json', 'utf8');
        const rawTransactions = JSON.parse(rawData);
        const transactions: Transaction[] = rawTransactions.map((entry: RawTransaction) => ({
            ...entry,
            date: new Date(entry.date)
        }))
        
        await pool.query(`
            DROP TABLE IF EXISTS transactions;
            
            DROP TYPE IF EXISTS transaction_type;
            CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE');
            
            DROP TYPE IF EXISTS transaction_status;
            CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'REJECTED');
            
            CREATE TABLE transactions (
                id SERIAL PRIMARY KEY,
                description VARCHAR,
                amount NUMERIC,
                type transaction_type,
                status transaction_status,
                date TIMESTAMPTZ
                );
        `);
        
        for (const entry of transactions) {
            await pool.query(
                `INSERT INTO transactions (id, description, amount, type, status, date) 
                VALUES ($1, $2, $3, $4, $5, $6)`,
                [entry.id, entry.description, entry.amount, entry.type, entry.status, entry.date]
            );
        }
        
        console.error('Data loaded successfully');
    } catch (error) {
        console.error('Failed to read sync file:', error);
    }
}

ingest();