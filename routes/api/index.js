const express = require('express');
const router  = express.Router();

router.use('/auth', require('./auth.routes'));
// router.use('/restaurants', require('./restaurants.routes'));


module.exports = router;