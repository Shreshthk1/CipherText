const { pool } = require('./db');

const sendMessage = async (app) =>{

    app.post('/api/messages', async (req, res) => {
        const { from, to, iv, ciphertext } = req.body;

        await pool.query(
            "INSERT INTO messages (from_user, to_user, iv, ciphertext) VALUES ($1, $2, $3, $4)",
            [from, to, iv, ciphertext]
        )

        res.status(200).json({ok: true})
    })
}

const getMessages = async (app) =>{
    app.get("/api/messages", async (req, res) =>{
        const {sender, reciever} = req.query
        const result = await pool.query(
            "SELECT * FROM MESSAGES WHERE (from_user = $1 AND to_user = $2) OR (from_user = $2 AND to_user = $1) ORDER BY created_at ASC", [sender, reciever]
        )
        
        res.status(200).json({messages:result.rows});
    })
}

module.exports = {sendMessage, getMessages}