const express = require('express');
const router  = express.Router();


router.use('/api', require('./api'));

router.get('/', (req, res, next) => {
  res.render('index');
});


module.exports = router;
