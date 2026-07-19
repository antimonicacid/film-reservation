const jwt = require('jsonwebtoken');
require('dotenv').config();

const postgres = require("postgres");
const postgresOptions = require("../config/postgresOptions");
const sql = postgres(postgresOptions);

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization; 
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.sendStatus(403);
            try {
                const query = await sql`SELECT * FROM users WHERE id = ${decoded.UserInfo.id}`;
                if (query.length === 0) return res.status(401).json({'message': "User no longer exists"});
                req.user = query[0];
                next();
            } catch (err) {
                return res.status(500).json({'message': 'An internal server error occured'});
            }
        }
    );
};

module.exports = verifyJWT;