const config = require('../config');
const cacheService = require('./cacheService');
const logger = require('../utils/logger');
const ApiError = require('../utils/apiError');

// ─────────────────────────────────────────────────────────
// GitHub REST API v3 — Real-Time Project Search Service
// ─────────────────────────────────────────────────────────

const GITHUB_API = config.github.baseUrl;

/**
 * Build headers for GitHub API requests.
 * Authenticated: 5,000 req/hr | Unauthenticated: 60 req/hr
 */
const getHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'HackerzzLobby/1.0',
  };
  if (config.github.token) {
    headers.Authorization = `token ${config.github.token}`;
  }
  return headers;
};

/**
 * Search repositories on GitHub dynamically based on
 * hackathon domain, tech stack, and keywords.
 *
 * @param {Object} params
 * @param {string} params.domain - e.g., "Blockchain", "AI/ML"
 * @param {string[]} params.techStack - e.g., ["React", "Solidity"]
 * @param {string[]} params.keywords - e.g., ["defi", "nft"]
 * @param {string} [params.sort] - "stars" | "updated" | "relevance"
 * @param {number} [params.perPage] - results per page (max 30)
 */
const searchRepositories = async ({ domain, techStack = [], keywords = [], sort = 'stars', perPage = 15 }) => {
  // Build intelligent query
  const queryParts = [];

  // Add domain as primary context
  if (domain) queryParts.push(domain);

  // Add top tech stack items (most relevant)
  const topTech = techStack.slice(0, 3);
  topTech.forEach((tech) => queryParts.push(tech));

  // Add keywords for specificity
  const topKeywords = keywords.filter((k) => k.length > 2).slice(0, 3);
  topKeywords.forEach((kw) => queryParts.push(kw));

  // Ensure we always have something to search
  if (queryParts.length === 0) queryParts.push('hackathon');

  const query = queryParts.join(' ');
  const cacheKey = `github:${query}:${sort}:${perPage}`;

  // Check cache first
  const cached = cacheService.get(cacheKey);
  if (cached) {
    logger.debug(`GitHub cache HIT: ${cacheKey}`);
    return cached;
  }

  logger.info(`GitHub API search: "${query}" (sort: ${sort})`);

  try {
    const url = new URL(`${GITHUB_API}/search/repositories`);
    url.searchParams.set('q', `${query} in:name,description,readme`);
    url.searchParams.set('sort', sort === 'relevance' ? '' : sort);
    url.searchParams.set('order', 'desc');
    url.searchParams.set('per_page', String(Math.min(perPage, 30)));

    const response = await fetch(url.toString(), { headers: getHeaders() });

    // Handle rate limiting
    const remaining = response.headers.get('x-ratelimit-remaining');
    const resetTime = response.headers.get('x-ratelimit-reset');

    logger.debug(`GitHub rate limit remaining: ${remaining}`);

    if (response.status === 403 && remaining === '0') {
      const resetDate = new Date(parseInt(resetTime, 10) * 1000);
      throw ApiError.tooManyRequests(
        `GitHub API rate limit exceeded. Resets at ${resetDate.toISOString()}`
      );
    }

    if (!response.ok) {
      throw ApiError.internal(`GitHub API returned ${response.status}`);
    }

    const data = await response.json();

    const repos = data.items.map((repo) => ({
      id: repo.id,
      name: repo.full_name,
      description: repo.description || 'No description available',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      url: repo.html_url,
      topics: repo.topics || [],
      updatedAt: repo.updated_at,
      openIssues: repo.open_issues_count,
      license: repo.license?.spdx_id || null,
    }));

    const result = {
      query,
      totalCount: data.total_count,
      repos,
      rateLimit: {
        remaining: parseInt(remaining, 10),
        reset: resetTime ? new Date(parseInt(resetTime, 10) * 1000).toISOString() : null,
      },
    };

    // Cache the result
    cacheService.set(cacheKey, result);
    logger.debug(`GitHub cache SET: ${cacheKey}`);

    return result;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error(`GitHub API error: ${error.message}`);
    throw ApiError.internal('Failed to fetch from GitHub');
  }
};

/**
 * Get suggestions for a specific community based on its hackathon data.
 * Performs multiple targeted searches and merges results.
 */
const getSuggestionsForCommunity = async (hackathon) => {
  // Convert comma-separated strings to arrays (for SQLite compatibility)
  const techStack = hackathon.techStack 
    ? (typeof hackathon.techStack === 'string' ? hackathon.techStack.split(',').map(t => t.trim()) : hackathon.techStack)
    : [];
  const keywords = hackathon.keywords
    ? (typeof hackathon.keywords === 'string' ? hackathon.keywords.split(',').map(k => k.trim()) : hackathon.keywords)
    : [];
  const { domain } = hackathon;

  // Run 2 parallel searches: by relevance and by recent activity
  const [byStars, byRecent] = await Promise.all([
    searchRepositories({ domain, techStack, keywords, sort: 'stars', perPage: 10 }),
    searchRepositories({ domain, techStack, keywords, sort: 'updated', perPage: 10 }),
  ]);

  // Merge & deduplicate by repo id, prioritize starred
  const seen = new Set();
  const merged = [];

  for (const repo of [...byStars.repos, ...byRecent.repos]) {
    if (!seen.has(repo.id)) {
      seen.add(repo.id);
      merged.push(repo);
    }
  }

  // Score and sort: stars weight + recency weight
  const scored = merged.map((repo) => {
    const starScore = Math.log10(repo.stars + 1) * 10;
    const daysSinceUpdate = (Date.now() - new Date(repo.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 10 - daysSinceUpdate / 30);
    const relevanceScore = repo.topics.some((t) =>
      [...techStack, ...keywords, domain].some((k) => t.toLowerCase().includes(k.toLowerCase()))
    ) ? 5 : 0;

    return { ...repo, score: starScore + recencyScore + relevanceScore };
  });

  scored.sort((a, b) => b.score - a.score);

  return {
    suggestions: scored.slice(0, 15),
    meta: {
      domain,
      techStack,
      totalFound: byStars.totalCount + byRecent.totalCount,
      rateLimit: byStars.rateLimit,
    },
  };
};

module.exports = { searchRepositories, getSuggestionsForCommunity };
