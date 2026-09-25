const bcrypt = require('bcryptjs');
const { pool } = require('./db');
const register = (app) => {
  app.post('/api/register', async (req, res) => {

    const {username, password, publicKey} = req.body;
    const passwordHash = await bcrypt.hash(password, 12);

    try {
      await pool.query(
        'INSERT INTO users (username, password_hash, public_key) VALUES ($1, $2, $3)',
        [username, passwordHash, JSON.stringify(publicKey)]
      );
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
  if (err.code === "23505") return res.status(409).json({ error: "username taken" });
  console.error(err);
  res.status(500).json({ error: "server error" });
}
  })
}

module.exports = { register }