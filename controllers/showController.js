const postgres = require('postgres');
const postgresOptions = require('../config/postgresOptions')
const sql = postgres(postgresOptions);

const { isValid, lightFormat } = require('date-fns');

const addShow = async (req, res) => {
    const {price, capacity, date, time, filmId} = req.body;

    if (!price || !capacity || !filmId) return res.status(400).json({'message': 'A price, capacity and filmId are required'});

    try {
        const foundFilm = await sql`SELECT title FROM films WHERE id = ${filmId}`


        if (foundFilm.length === 0) return res.status(404).json({'message': 'Film not found'})

        const newShow = {
            'price': price,
            'capacity': capacity,
            'date': date ? date : null,
            'time': time ? time : null,
            'film_id': filmId
        };
        
        const result = await sql`INSERT INTO shows ${sql(newShow, 'price', 'capacity', 'date', 'time', 'film_id')}`

        return res.status(201).json({'message': `New show for film ${foundFilm[0].title} created`});
    } catch (err) {
        return res.status(500).json({'message': `An internal server error occured ${err}`});
    } 
};

const modifyShow = async (req, res) => {
    if (!req?.params?.id) return req.status(400).json({'message': 'An id is required'});
    const id = req.params.id;

    var query = ['UPDATE shows SET ']
    var set = [];

    // If attribute to modify exists in JSON body, modify it. 
    Object.keys(req.body).forEach((attribute) => {
        if (attribute) {
            set.push(attribute + ` = '${req.body[attribute]}'`)
        }
    });
    
    query += set.join(', ')
    query += ` WHERE id = ${id} RETURNING *`;

    try {
        const result = await sql.unsafe(query);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({'message': err.message});
    }
};

const deleteShow = async (req, res) => {
    if (!req?.params?.id) return req.status(400).json({'message': 'An id is required'});
    const id = req.params.id;

    try {
        const foundShow = await sql`SELECT * FROM shows WHERE id = ${id}`

        if (foundShow.length === 0) return res.status(404).json({'message': 'Show not found'});

        await sql`DELETE FROM bookings WHERE show_id = ${id}`
        await sql`DELETE FROM shows WHERE id = ${id}`

        return res.sendStatus(204);
    } catch (err) {
        console.log(err);
        return res.status(500).json({'message': 'An internal server error occured'});
    }
};

const queryShowStats = async (req, res) => {
    try {
        const startDate = req?.body?.startDate ? req.body.startDate : lightFormat(new Date(), 'yyyy-MM-dd');
        const endDate = (!req?.body?.endDate) ? lightFormat(new Date('9999-01-01'), 'yyyy-MM-dd') : req.body.endDate;

            if (!isValid(new Date(startDate)) || !isValid(new Date(endDate))) return res.status(400).json({'message': 'Invalid date provided'});

            const result = await sql`SELECT shows.id AS show_id, shows.capacity, shows.price, shows.price * COUNT(show_id) AS revenue, films.id AS film_id, films.title, films.description, films.image 
            FROM bookings, shows, films 
            WHERE bookings.show_id = shows.id 
            AND shows.film_id = films.id 
            AND date BETWEEN '${startDate}' AND '${endDate}' 
            GROUP BY shows.id, films.id`;

        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({'message': 'An internal server error occured'});
    }
};

const queryShows = async (req, res) => {
    try {
        const startDate = req?.body?.startDate ? req.body.startDate : lightFormat(new Date(), 'yyyy-MM-dd');
        const endDate = (!req?.body?.endDate) ? lightFormat(new Date('9999-01-01'), 'yyyy-MM-dd') : req.body.endDate;
        const filmId = (req?.body?.filmId) ? req.body.filmId : '%';

        if (!isValid(new Date(startDate)) || !isValid(new Date(endDate))) return res.status(400).json({'message': 'Invalid date provided'});

        const result = await sql`SELECT shows.id, shows.capacity, shows.price, shows.date, shows.time, films.title, films.description, films.image 
        FROM shows, films 
        WHERE shows.film_id = films.id
        AND date BETWEEN ${startDate} AND ${endDate}
        AND shows.film_id::varchar(12) LIKE ${filmId} 
        GROUP BY shows.id, films.id
        ORDER BY date ASC`;

        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({'message': 'An internal server error occured'});
    }
};

const queryShowsById = async (req, res) => {
    try {
        if (!req?.params?.id) return req.status(400).json({'message': 'An id is required'});
        const id = req.params.id;
        console.log(id);

        const result = await sql`SELECT shows.id, shows.capacity, shows.price, shows.date, shows.time, films.title, films.description, films.image 
        FROM shows, films 
        WHERE shows.id = ${id}`

        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({'message': 'An internal server error occured'});
    }

}

module.exports = {addShow, modifyShow, deleteShow, queryShowStats, queryShows, queryShowsById};