const postgres = require("postgres");
const postgresOptions = require("../config/postgresOptions");
const sql = postgres(postgresOptions);

const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    
    const foundUser = await sql`SELECT id FROM users WHERE refresh_token = ${refreshToken}`
    if (foundUser.length === 0) return res.sendStatus(403);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser[0].id !== decoded.id) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { "UserInfo": {
                    "id": decoded.id,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            );
            res.json({ accessToken });
            return res;
        }
    );
};

module.exports = {handleRefreshToken};