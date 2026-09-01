const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/verifyAdmin');

router.use(verifyAdmin);
router.get('/', (req, res) => { return res.sendStatus(200); });

module.exports = router;