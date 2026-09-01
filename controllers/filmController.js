const postgres = require('postgres');
const postgresOptions = require('../config/postgresOptions')
const sql = postgres(postgresOptions);

const addFilm = async (req, res) => {
    const {title, desc, image, genre} = req.body;

    if (!title || !desc || !genre) return res.status(400).json({'message': 'A title, description, image and genre are required'});

    try {
        const newFilm = {
            'title': title,
            'description': desc,
            'image': image,
            'genre': genre
        };
        
        const result = await sql`INSERT INTO films ${sql(newFilm, 'title', 'description', 'image', 'genre')}`

        return res.status(201).json({'message': `New film ${title} created`});
    } catch (err) {
        return res.status(500).json({'message': 'An internal server error occured'});
    } 
};

const deleteFilm = async (req, res) => {
    if (!req?.params?.id) return req.status(400).json({'message': 'An id is required'});
    const id = req.params.id;

    try {
        const foundFilm = await sql`SELECT FROM films WHERE id = ${id}`

        if (foundFilm.length === 0) return res.status(404).json({'message': 'Film not found'});

        await sql`DELETE FROM films WHERE id = ${id}`

        return res.sendStatus(204);
    } catch (err) {
        return res.status(500).json({'message': 'An internal server error occured'});
    }
};

const modifyFilm = async (req, res) => {
    if (!req?.params?.id) return req.status(400).json({'message': 'An id is required'});
    const id = req.params.id;

    try {
        var query = ['UPDATE films SET ']
        var set = [];

        // If attribute to modify exists in JSON body, modify it. 
        Object.keys(req.body).forEach((attribute) => {
            if (attribute) {
                set.push(attribute + ` = '${req.body[attribute]}'`)
            }
        });
        
        query += set.join(', ')
        query += ` WHERE id = ${id} RETURNING *`;
        const result = await sql.unsafe(query);
        return res.status(200).json(result);

    } catch (err) {
        return res.status(500).json({'message': 'An internal server error occured'});
    }
};

const queryFilms = async (req, res) => {
    const genre = (!req.body?.genre) ? "%" : "%" + req.body.genre + "%";
    const title = (!req.body?.title) ? "%" : "%" + req.body.title + "%";

    try {
        const result = await sql`SELECT * FROM films WHERE genre LIKE ${genre} AND title LIKE ${title}`;
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({'message': 'An internal server error occured'});
    }
};

module.exports = {addFilm, deleteFilm, modifyFilm, queryFilms};

