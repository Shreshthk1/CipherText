const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("./db");

const login =  (app) => {
    app.post("/api/login", async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;

    if (typeof username !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "invalid input" });
    }

    const result = await pool.query(
        "SELECT id, password_hash, public_key FROM users WHERE username = $1",
        [username]
    );
    const user = result.rows[0];

    // Same error for "no such user" and "wrong password" — never reveal which.
    if (!user) return res.status(401).json({ error: "invalid username or password" });

    const isCorrect = await bcrypt.compare(password, user.password_hash);
    if (!isCorrect) return res.status(401).json({ error: "invalid username or password" });

    const token = jwt.sign(
        { userId: user.id, username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.status(200).json({ ok: true, token, userId: user.id, publicKey: user.public_key });
        })
}

module.exports = { login }