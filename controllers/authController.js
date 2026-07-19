const postgres = require("postgres");
const postgresOptions = require("../config/postgresOptions");
const sql = postgres(postgresOptions);

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const verifyUser = async (req, res) => {
    const {email, pwd} = req.body;

    if (!email || !pwd) return res.status(400).json({'message': 'Email and password are required'});

    try {
        const foundUser = await sql`SELECT id, password FROM users WHERE email = ${email}`;
        if (foundUser.length === 0) return res.sendStatus(401);
        const match = await bcrypt.compare(pwd, foundUser[0].password);
        if (!match) return res.sendStatus(401);

        const accessToken = jwt.sign(
            {"UserInfo": {
                "id": foundUser[0].id
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '1h'}
        );
        const refreshToken = jwt.sign(
            {"id": foundUser[0].id },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '7d'}
        );

        await sql`UPDATE users SET refresh_token = ${refreshToken} WHERE id = ${foundUser[0].id}`

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 7 * 24 * 60 * 60 * 1000, secure: true }); // set secure: true
        res.json({ accessToken });

        return res;
    } catch (err) {
        console.error(err);
        return res.status(500).json({'message': 'An internal server error occurred'});
    }
};

module.exports = {verifyUser};