import { Pool } from 'pg';
import { env } from '../config/env.js';

export const pool = new Pool(env.db);

pool.on('error', (err) => {
  console.error('Unexpected DB pool error:', err);
});

pool.on('connect', () => {
    console.log('Успішне підключення до бази даних')
})

export const db = {
    query: (text, params) => pool.query(text, params),
    connect: () => pool.connect()
}