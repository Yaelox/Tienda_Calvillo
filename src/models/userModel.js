const { pool } = require('../../config/db'); // Import the pool from your db configuration

class User {
    static async findByEmail(email) {
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            return rows[0];
        } catch (err) {
            console.error('Error in findByEmail:', err);
            throw err;
        }
    }

    static async createUser(usuario, email, passwordHash, tipo_usuario = 'cliente') {
      try {
          const [result] = await pool.query(
              'INSERT INTO users (usuario, email, password, tipo_usuario) VALUES (?, ?, ?, ?)',
              [usuario, email, passwordHash, tipo_usuario]
          );
          return result;
      } catch (err) {
          console.error('Error in createUser:', err);
          throw err;
      }
  }
}

module.exports = User;
