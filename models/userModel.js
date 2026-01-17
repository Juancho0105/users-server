const db = require("../config/db");

class User {
  // --- CREATE ---
  static async create(user) {
    const query = `
      INSERT INTO m_users (name, lastname, email, password, role_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, lastname AS "lastName", email, role_id, created_at, updated_at
    `;

    const { rows } = await db.query(query, [
      user.name,
      user.lastName,
      user.email,
      user.password,
      user.role_id,
    ]);

    return rows[0];
  }

  // --- READ (Todos) ---
  static async findAll() {
    const query = `
      SELECT 
        u.id, u.name, u.lastname AS "lastName", u.email, u.role_id,
        r.role_name,
        u.created_at, u.updated_at
      FROM m_users u
      LEFT JOIN m_roles r ON u.role_id = r.id
      ORDER BY u.id DESC
    `;

    const { rows } = await db.query(query);
    return rows;
  }

  // --- READ (Uno por ID) ---
  static async findById(id) {
    const query = `
      SELECT 
        u.id, u.name, u.lastname AS "lastName", u.email, u.role_id,
        r.role_name,
        u.created_at, u.updated_at
      FROM m_users u
      LEFT JOIN m_roles r ON u.role_id = r.id
      WHERE u.id = $1
    `;

    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  // --- READ (Por Email - para Login) ---
  static async findByEmail(email) {
    const query = `
      SELECT 
        id, name, lastname AS "lastName", email, password, role_id, created_at, updated_at
      FROM m_users
      WHERE email = $1
      LIMIT 1
    `;

    const { rows } = await db.query(query, [email]);
    return rows[0] || null;
  }

  // --- UPDATE ---
  static async update(id, user) {
    const query = `
      UPDATE m_users
      SET name = $1, lastname = $2, email = $3, role_id = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING id, name, lastname AS "lastName", email, role_id, created_at, updated_at
    `;

    const { rows } = await db.query(query, [
      user.name,
      user.lastName,
      user.email,
      user.role_id,
      id,
    ]);

    return rows[0] || null;
  }

  // --- DELETE ---
  static async delete(id) {
    const query = `DELETE FROM m_users WHERE id = $1 RETURNING id`;
    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }
}

module.exports = User;
