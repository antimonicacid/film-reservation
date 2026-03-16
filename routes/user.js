const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const verifyAdmin = require('../middleware/verifyAdmin');

router.use(verifyAdmin);
router.put('/promote/:id', userController.promoteUser)
    .delete('/delete/:id', userController.deleteUser);

module.exports = router;
