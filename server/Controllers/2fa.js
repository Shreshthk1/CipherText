const { generateSecret, generateURI, verify } = require('otplib');
const qrcode = require('qrcode');
const { pool } = require('./db.js');

const setup2FA = async (app)=> {
    app.get('/api/2fa/setup', async (req, res) => {
        const username = req.query.username; 
        const secret = generateSecret();
        const otpauth = generateURI({ label: 'CipherText', issuer: username , secret });
        const qrCodeDataURL = await qrcode.toDataURL(otpauth);

        await pool.query('UPDATE users SET totp_secret = $1 WHERE username = $2',[secret, username]);

        res.json({qrCodeDataURL });
    })
}

const verify2FA = (app) => {
    app.post('/api/2fa/verify', async (req, res) => {
        const { username, token } = req.body;
        const result = await pool.query('SELECT totp_secret FROM users WHERE username = $1', [username]);
        const user = result.rows[0];
        const secret = user.totp_secret;
        
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isValid = verify({ token, secret });
        
        if (isValid) {
            res.json({ success: true });
        }
        else {
            res.status(400).json({ success: false, message: 'Invalid token' });
        }
    })
}

module.exports = { setup2FA, verify2FA };
