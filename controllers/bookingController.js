const postgres = require("postgres");
const postgresOptions = require("../config/postgresOptions");
const sql = postgres(postgresOptions);

const reserveSeats = async (req, res) => {
  if (!req.body.seats || !req.body.showId || !req.user) return res.status(400).json({'message': 'Seats, showId and user are required'});

  const seats = req.body.seats;
  const showId = req.body.showId;
  const userId = req.user.id;

  try {
    const show = await sql`SELECT capacity FROM shows WHERE id = ${showId}`
    if (show.length === 0) return res.status(404).json({'message': 'Show not found'});

    const duplicateReservation = await sql`SELECT FROM bookings JOIN shows on bookings.show_id = shows.id WHERE seat IN ${sql(seats)} AND show_id = ${showId}`;
    if (duplicateReservation.length > 0) return res.status(409).json({'message': 'Seat already reserved'});

    seats.forEach(async (seat) => {
        if (show[0].capacity < seat) return res.status(400).json({'message': 'Seat number exceeds capacity'});
        const newBooking = {
            'seat': seat,
            'show_id': showId,
            'user_id': userId
        }

        await sql`INSERT INTO bookings ${sql(newBooking, 'seat', 'show_id', 'user_id')}`
    })
    
    return res.status(200).json({'message': `User ${userId} successfully reserved seats ${seats} for show ${showId}`})
  } catch (err) {
    return res.status(500).json({'message': `An internal server error occured ${err}`})
  }
};

const deleteReservation = async (req, res) => {
    console.log(req.user, req.body)
    if (!req?.user || !req?.body?.showId) return res.status(400).json({'message': 'A user and showId are required'});
    const userId = req.user.id
    const showId = req.body.showId;

    try {
        if (!req?.body?.seats) {
            await sql`DELETE FROM bookings WHERE show_id = ${showId} AND user_id = ${userId}`
        } else {
            await sql`DELETE FROM bookings WHERE show_id = ${showId} AND user_id = ${userId} AND seat IN ${sql(req.body.seats)}`
        }

        return res.sendStatus(204);
    } catch (err) {
        return res.status(500).json({'message': 'An internal server error occured'});
    }
};

const queryUserReservations = async (req, res) => {
    if (!req?.user) return res.status(400).json({'message': 'A user is required'});

    try {
        const result = await sql`SELECT bookings.seat, shows.id AS show_id, shows.date, shows.time, films.title, films.description, films.genre 
        FROM bookings 
        JOIN shows on bookings.show_id = shows.id 
        JOIN films on shows.film_id = films.id 
        WHERE user_id = ${req.user.id}
        ORDER BY shows.date, bookings.seat`;
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({'message': 'An internal server error occured'});
    }
};

const queryShowReservations = async (req, res) => {
    if (!req?.params?.showId) return res.status(400).json({'message': 'A showId is required'});

    try {
        const result = await sql`SELECT seat, user_id FROM bookings, shows WHERE bookings.show_id = shows.id AND show_id = ${req.params.showId}`;
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({'message': 'An internal server error occured'});
    }
};

const queryBookedSeats = async (req, res) => {
    if (!req?.params?.showId) return res.status(400).json({'message': 'A showId is required'});

    try {
        const result = await sql`SELECT seat FROM bookings WHERE show_id = ${req.params.showId}`
        const seats = result.map((e) => { return e.seat; });
        return res.status(200).json(seats);
    } catch (err) {
        console.error(err);
        return res.status(500).json({'message': 'An internal server error occured'});
    }
}


module.exports = {reserveSeats, deleteReservation, queryUserReservations, queryShowReservations, queryBookedSeats};