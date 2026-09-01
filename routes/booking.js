const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const verifyAdmin = require('../middleware/verifyAdmin');

router.post('/', bookingController.reserveSeats)
    .delete('/', bookingController.deleteReservation)
    .get('/', bookingController.queryUserReservations)
    .get('/:showId', bookingController.queryBookedSeats);


router.use(verifyAdmin);
router.get('/:showId', bookingController.queryShowReservations);

module.exports = router;