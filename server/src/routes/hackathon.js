const router = require('express').Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { getHackathons, createHackathon, getHackathon, createHackathonSchema } = require('../controllers/hackathonController');

router.get('/', auth, getHackathons);
router.post('/', auth, validate(createHackathonSchema), createHackathon);
router.get('/:id', auth, getHackathon);

module.exports = router;
