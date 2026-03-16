const promoteUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({'message': 'An id is required'});

    try {
        const query = await sql`UPDATE users SET role = 'Admin' WHERE user_id = ${id} RETURNING *`;
        return res.status(200).json(query);
    } catch (err) {
        return res.status(500).json({'message': err.message});
    }
}

const deleteUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({'message': 'An id is required'});

    try {
        const query = await sql`DELETE FROM users WHERE user_id = ${id} RETURNING *`;
        return res.status(200).json(query);
    } catch (err) {
        return res.status(500).json({'message': err.message});
    }
}

module.exports = {promoteUser, deleteUser};