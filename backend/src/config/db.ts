import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

const host = process.env.POSTGRES_HOST;
const port = parseInt(process.env.POSTGRES_PORT || "5432", 10);
const database = process.env.POSTGRES_DB;
const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;

export const pool = new Pool({
    host: host,
    port: port,
    database: database,
    user: user,
    password: password
})

pool.on('connect', () => {
  console.log('[database]: Conectado a PostgreSQL exitosamente');
});