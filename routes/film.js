const express = require('express');
const router = express.Router();
const filmController = require('../controllers/filmController');

const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/', filmController.queryFilms);

router.use(verifyAdmin);    
router.post('/', filmController.addFilm)
    .put("/:id",  filmController.modifyFilm)
    .delete("/:id",  filmController.deleteFilm);

module.exports = router;
