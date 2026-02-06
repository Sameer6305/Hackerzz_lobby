const NodeCache = require('node-cache');
const config = require('../config');

// In-memory cache with TTL
const cache = new NodeCache({
  stdTTL: config.github.cacheTTL,
  checkperiod: 120,
  useClones: false,
});

const cacheService = {
  get(key) {
    return cache.get(key);
  },

  set(key, value, ttl) {
    return cache.set(key, value, ttl || config.github.cacheTTL);
  },

  del(key) {
    return cache.del(key);
  },

  flush() {
    return cache.flushAll();
  },

  stats() {
    return cache.getStats();
  },
};

module.exports = cacheService;
