const router = require('express').Router();
const { register } = require('../middleware/metrics');

router.get('/', async (req, res, next) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    next(error);
  }
});

module.exports = router;
