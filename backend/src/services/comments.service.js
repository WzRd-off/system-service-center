import { db } from '../database/db.js';
import { ApiError } from '../utils/ApiError.js';

class CommentsService {
  async create({ requestId, authorId, authorRole, text }) {
    const { rows } = await db.query(
      `INSERT INTO request_comments (request_id, author_id, author_role, text)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [requestId, authorId, authorRole, text]
    );
    return rows[0];
  }

  async listByRequest(requestId) {
    const { rows } = await db.query(
      'SELECT * FROM request_comments WHERE request_id = $1 ORDER BY created_at ASC',
      [requestId]
    );
    return rows;
  }

  async update(id, authorId, text) {
    const { rows } = await db.query(
      `UPDATE request_comments SET text = $1
       WHERE id = $2 AND author_id = $3
       RETURNING *`,
      [text, id, authorId]
    );
    if (!rows[0]) throw ApiError.notFound('Коментар не знайдено або немає прав');
    return rows[0];
  }
}

export const commentsService = new CommentsService();
