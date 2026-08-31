const postgres = require("postgres");
const postgresOptions = require("../config/postgresOptions");
const sql = postgres(postgresOptions);

const promoteUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({'message': 'An id is required'});
    const id = req.params.id;

    try {
        const query = await sql`UPDATE users SET role = 'Admin' WHERE id = ${id} RETURNING *`;
        return res.status(200).json(query);
    } catch (err) {
        console.log(err)
        return res.status(500).json({'message': 'An internal server error occured'});
    }
};

const deleteUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({'message': 'An id is required'});
    const id = req.params.id;

    try {
        const query = await sql`DELETE FROM users WHERE id = ${id} RETURNING *`;
        return res.status(200).json(query);
    } catch (err) {
        return res.status(500).json({'message': 'An internal server error occured'});
    }
};

module.exports = {promoteUser, deleteUser};