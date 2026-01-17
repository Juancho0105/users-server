const db = require('../config/db');

class User {

    // --- CREATE ---
    static async create(user) {
        // Asumimos que user trae: { name, lastName, email, password, role_id }
        const query = `
            INSERT INTO M_users (name, lastName, email, password, role_id) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            user.name, 
            user.lastName, 
            user.email, 
            user.password, 
            user.role_id
        ]);
        return result;
    }

    // --- READ (Todos) ---
    static async findAll() {
        // Hacemos JOIN para mostrar el nombre del rol, no solo el numero
        const query = `
            SELECT u.id, u.name, u.lastName, u.email, u.role_id, r.role_name, u.created_at
            FROM M_users u
            JOIN M_roles r ON u.role_id = r.id
        `;
        const [rows] = await db.query(query);
        return rows;
    }

    // --- READ (Uno por ID) ---
    static async findById(id) {
        const query = `
            SELECT u.id, u.name, u.lastName, u.email, u.role_id, r.role_name
            FROM M_users u
            JOIN M_roles r ON u.role_id = r.id
            WHERE u.id = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    // --- READ (Por Email - para Login) ---
    static async findByEmail(email) {
        const query = 'SELECT * FROM M_users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    }

    // --- UPDATE ---
    static async update(id, user) {
        // Actualizamos todo excepto el password (se suele manejar aparte o con lógica condicional)
        // Y la fecha updated_at se actualiza sola en MySQL
        const query = `
            UPDATE M_users 
            SET name = ?, lastName = ?, email = ?, role_id = ?
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [
            user.name, 
            user.lastName, 
            user.email, 
            user.role_id, 
            id
        ]);
        return result;
    }

    // --- DELETE ---
    static async delete(id) {
        const query = 'DELETE FROM M_users WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result;
    }
}

module.exports = User;