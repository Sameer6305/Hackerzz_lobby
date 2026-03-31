require('dotenv').config();

const defaultOrigins = ['http://localhost:5173', 'http://localhost:3000'];
const envOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  db: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: 'hackerzz-lobby',
    algorithm: 'HS256',
  },
  github: {
    token: process.env.GITHUB_TOKEN || '',
    baseUrl: 'https://api.github.com',
    cacheTTL: parseInt(process.env.GITHUB_CACHE_TTL, 10) || 600,
  },
  cors: {
    origins: envOrigins.length > 0 ? envOrigins : defaultOrigins,
  },
};

// ─── Validation ──────────────────────────────────────────
const required = [
  ['JWT_SECRET', config.jwt.secret],
  ['DATABASE_URL', config.db.url],
];

for (const [name, value] of required) {
  if (!value) {
    throw new Error(`${name} is required in environment variables`);
  }
}

if (!config.db.url.startsWith('postgresql://') && 
    !config.db.url.startsWith('postgres://') && 
    !config.db.url.startsWith('file:')) {
  throw new Error('DATABASE_URL must be a valid PostgreSQL or SQLite connection string');
}

// Warn about weak JWT secret in production
if (config.env === 'production' && config.jwt.secret.length < 32) {
  console.warn('WARNING: JWT_SECRET should be at least 32 characters in production');
}

module.exports = config;
