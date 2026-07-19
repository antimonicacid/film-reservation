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
        return res.status(500).json({'message': 'An internal server error occured'});
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

        await sql`DELETE FROM shows WHERE id = ${id}`

        return res.sendStatus(204);
    } catch (err) {
        return res.status(500).json({'message': 'An internal server error occured'});
    }
};

const queryShowStats = async (req, res) => {
    try {
        let result;

        if (req?.body?.startDate) {
            const startDate = req.body.startDate;
            const endDate = (!req?.body?.endDate) ? lightFormat(new Date('9999-01-01'), 'yyyy-MM-dd') : req.body.endDate;

            if (!isValid(new Date(startDate)) || !isValid(new Date(endDate))) return res.status(400).json({'message': 'Invalid date provided'});

            result = await sql`SELECT shows.id AS show_id, shows.capacity, shows.price, shows.price * COUNT(show_id) AS revenue, films.id AS film_id, films.title, films.description, films.image 
            FROM bookings, shows, films 
            WHERE bookings.show_id = shows.id 
            AND shows.film_id = films.id 
            AND date BETWEEN '${startDate}' AND '${endDate}' 
            GROUP BY shows.id, films.id`;
        } else {
            const onDate = (!req.body?.onDate) ? lightFormat(new Date(), 'yyyy-MM-dd') : req.body.onDate;
            console.log(onDate)
            if (!isValid(new Date(onDate))) return res.status(400).json({'message': 'Invalid date provided'});

            result = await sql`SELECT shows.id AS show_id, shows.capacity, shows.price, shows.price * COUNT(show_id) AS revenue, films.id AS film_id, films.title, films.description, films.image 
            FROM bookings, shows, films 
            WHERE bookings.show_id = shows.id 
            AND shows.film_id = films.id AND date = '${onDate}' 
            GROUP BY shows.id, films.id`;
        }
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({'message': 'An internal server error occured'});
    }
};

const queryShows = async (req, res) => {
    try {
        let result;

        if (req?.body?.startDate) {
            const startDate = req.body.startDate;
            const endDate = (!req?.body?.endDate) ? lightFormat(new Date('9999-01-01'), 'yyyy-MM-dd') : req.body.endDate;

            if (!isValid(new Date(startDate)) || !isValid(new Date(endDate))) return res.status(400).json({'message': 'Invalid date provided'});

            result = await sql`SELECT shows.capacity, shows.price, shows.date, shows.time, films.title, films.description, films.image 
            FROM bookings, shows, films 
            WHERE bookings.show_id = shows.id 
            AND shows.film_id = films.id 
            AND date BETWEEN '${startDate}' AND '${endDate}' 
            GROUP BY shows.id, films.id`;

        } else {
            const onDate = (!req.body?.onDate) ? lightFormat(new Date(), 'yyyy-MM-dd') : req.body.onDate;
            console.log(onDate)
            if (!isValid(new Date(onDate))) return res.status(400).json({'message': 'Invalid date provided'});

            result = await sql`SELECT shows.capacity, shows.price, shows.date, shows.time, films.title, films.description, films.image 
            FROM bookings, shows, films 
            WHERE bookings.show_id = shows.id 
            AND shows.film_id = films.id 
            AND date = '${onDate}' 
            GROUP BY shows.id, films.id`;
        } 
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({'message': 'An internal server error occured'});
    }
};


module.exports = {addShow, modifyShow, deleteShow, queryShowStats, queryShows};