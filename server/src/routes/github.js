const router = require('express').Router();
const auth = require('../middleware/auth');
const { githubLimiter } = require('../middleware/rateLimiter');
const { searchGithub } = require('../controllers/githubController');

router.get('/search', auth, githubLimiter, searchGithub);

module.exports = router;
