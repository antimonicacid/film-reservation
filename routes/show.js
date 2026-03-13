const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/', showController.queryShows)

router.use(verifyAdmin);
router.post('/', showController.addShow)
    .get('/stats', showController.queryShowStats)
    .put('/:id', showController.modifyShow)
    .delete('/:id', showController.deleteShow);

module.exports = router;
