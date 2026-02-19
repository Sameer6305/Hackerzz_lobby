const router = require('express').Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const { register, login, getMe, updateProfile, registerSchema, loginSchema, updateProfileSchema } = require('../controllers/authController');

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', auth, getMe);
router.patch('/me', auth, validate(updateProfileSchema), updateProfile);

module.exports = router;
