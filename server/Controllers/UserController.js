const {pool} = require("./db.js");

const getUsers = (app) => {
    app.get("/api/users", async (req, res) => {
        const result = await pool.query("SELECT username FROM users");
        const users = result.rows.map(row => row.username);
        res.status(200).json({ users });
    }
    )
}


const getUserKey = (app) => {
    app.get("/api/user/:id/publicKey", async (req, res) => {
        const username = req.params.id;
        const result = await pool.query(
            "SELECT public_key FROM users WHERE username = $1",
            [username]
        );
        const user = result.rows[0];
        if (!user) return res.status(404).json({ error: "user not found" });
        res.status(200).json({ publicKey: user.public_key });
    })
}

module.exports = { getUsers, getUserKey, purgeUsers }