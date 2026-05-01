import pg from 'pg';
import { env } from '../config/env.js';

export const db = new pg.Pool(env.db);

db.on('error', (err) => {
  console.error('Unexpected DB pool error:', err);
});
