const postgres = require("postgres");
const postgresOptions = require("../config/postgresOptions");
const sql = postgres(postgresOptions);

const reserveSeats = async (req, res) => {
  if (!req.body.seats || !req.body.showId || !req.user) return res.status(400).json({'message': 'Seats, showId and user are required'});

  const seats = req.body.seats;
  const showId = req.body.showId;
  const userId = req.user.id;

  try {
    const show = await sql`SELECT capacity FROM bookings JOIN shows on bookings.show_id = shows.id`
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
    return res.status(500).json({'message': err.message})
  }
};

const deleteReservation = async (req, res) => {
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
        return res.status(500).json({'message': err.message});
    }
}

const queryUserReservations = async (req, res) => {
    if (!req?.user) return res.status(400).json({'message': 'A user is required'});

    try {
        const result = await sql`SELECT seat, date, time FROM bookings JOIN shows on bookings.show_id = shows.id WHERE user_id = ${user.id}`;
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({'message': err.message});
    }
}

const queryShowReservations = async (req, res) => {
    if (!req?.params?.showId) return res.status(400).json({'message': 'A showId is required'});

    try {
        const result = await sql`SELECT seat, user_id FROM bookings, shows WHERE bookings.show_id = shows.id AND show_id = ${req.params.showId}`;
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({'message': err.message});
    }
}


module.exports = {reserveSeats, deleteReservation, queryUserReservations, queryShowReservations};