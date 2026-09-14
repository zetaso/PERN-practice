import { pool } from '../config/db'
import { Transaction } from '../types/transaction.type';

export default class TransactionService {

    static async getTransactions(): Promise<Transaction[]> {
        const query = `
            SELECT * FROM transactions;
        `;

        const { rows } = await pool.query<Transaction>(query);
        return rows;
    }

    static async filterTransactions(status: string): Promise<Transaction[]> {
        const query = `
            SELECT * FROM transactions
            WHERE status = $1;
        `;

        const { rows } = await pool.query<Transaction>(query, [status]);
        return rows;
    }

    static async getTransaction(id: number): Promise<Transaction | null> {
        const query = `
            SELECT * FROM transactions
            WHERE id = $1;
        `;

        const { rows } = await pool.query(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async updateTransaction({ id, status }: {id: number, status: string }): Promise<Transaction | null> {
        const query = `
            UPDATE transactions
            SET status = $1
            WHERE id = $2
            RETURNING *;
        `;

        const { rows } = await pool.query(query, [status, id]);

        if (rows.length > 0)
            return rows[0];
        else
            return null;
    }

}