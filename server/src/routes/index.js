const router = require('express').Router();
const { apiLimiter } = require('../middleware/rateLimiter');

// Apply global rate limiter
router.use(apiLimiter);

// Mount routes
router.use('/auth', require('./auth'));
router.use('/communities', require('./community'));
router.use('/hackathons', require('./hackathon'));
router.use('/github', require('./github'));

module.exports = router;
