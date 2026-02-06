const router = require('express').Router();
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createCommunity, getMyCommunities, getCommunity, addMember, joinCommunity,
  createCommunitySchema, addMemberSchema,
} = require('../controllers/communityController');
const { getMessages, sendMessage, sendMessageSchema } = require('../controllers/chatController');
const { addDeadline, createDeadlineSchema } = require('../controllers/hackathonController');
const { getCommunitySuggestions } = require('../controllers/githubController');
const { githubLimiter } = require('../middleware/rateLimiter');

// Community CRUD
router.get('/', auth, getMyCommunities);
router.post('/', auth, validate(createCommunitySchema), createCommunity);
router.get('/:id', auth, getCommunity);
router.post('/:id/join', auth, joinCommunity);
router.post('/:id/members', auth, validate(addMemberSchema), addMember);

// Chat within a community
router.get('/:id/messages', auth, getMessages);
router.post('/:id/messages', auth, validate(sendMessageSchema), sendMessage);

// Deadlines within a community
router.post('/:id/deadlines', auth, validate(createDeadlineSchema), addDeadline);

// GitHub suggestions for a community
router.get('/:id/github-suggestions', auth, githubLimiter, getCommunitySuggestions);

module.exports = router;
