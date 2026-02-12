const prisma = require('../config/database');
const githubService = require('../services/githubService');
const ApiError = require('../utils/apiError');

/**
 * GET /api/communities/:id/github-suggestions
 * Fetches real-time GitHub project suggestions
 * based on the community's linked hackathon data.
 */
const getCommunitySuggestions = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify membership
    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId: id } },
    });
    if (!membership) throw ApiError.forbidden('Not a member');

    // Get community with hackathon
    const community = await prisma.community.findUnique({
      where: { id },
      include: { hackathon: true },
    });
    if (!community) throw ApiError.notFound('Community not found');
    if (!community.hackathon) throw ApiError.notFound('Hackathon not found for this community');

    const result = await githubService.getSuggestionsForCommunity(community.hackathon);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/github/search?q=react+blockchain&sort=stars
 * Direct GitHub search endpoint.
 */
const searchGithub = async (req, res, next) => {
  try {
    const { q, sort = 'stars', limit = 15 } = req.query;
    if (!q) throw ApiError.badRequest('Search query (q) is required');

    const result = await githubService.searchRepositories({
      domain: q,
      techStack: [],
      keywords: q.split(/\s+/),
      sort,
      perPage: parseInt(limit, 10),
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCommunitySuggestions, searchGithub };
