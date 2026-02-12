const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

// ─── Singleton-safe Prisma Client ────────────────────────
// Prevents multiple instances during hot-reloading (dev)
// Neon pooler handles connection pooling at the infra level
const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.__prisma ||
  new PrismaClient({
    log: [
      { level: 'error', emit: 'event' },
      { level: 'warn', emit: 'event' },
      ...(process.env.NODE_ENV === 'development'
        ? [{ level: 'query', emit: 'event' }]
        : []),
    ],
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}

// ─── Event Listeners ─────────────────────────────────────
prisma.$on('error', (e) => logger.error(`Prisma Error: ${e.message}`));
prisma.$on('warn', (e) => logger.warn(`Prisma Warning: ${e.message}`));

if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    if (e.duration > 200) {
      logger.warn(`Slow query (${e.duration}ms): ${e.query}`);
    }
  });
}

// ─── Connection Health Check (with retry for Neon autosuspend) ─────
const checkConnection = async (retries = 3, delay = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      logger.info('✅ Database connection established (Neon PostgreSQL)');
      return true;
    } catch (error) {
      logger.error(`❌ Database connection attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt < retries) {
        logger.info(`⏳ Retrying in ${delay / 1000}s... (Neon may be waking up)`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  return false;
};

// ─── Graceful Shutdown ───────────────────────────────────
const shutdown = async () => {
  logger.info('Disconnecting Prisma...');
  await prisma.$disconnect();
};

process.on('SIGINT', async () => { await shutdown(); process.exit(0); });
process.on('SIGTERM', async () => { await shutdown(); process.exit(0); });

module.exports = prisma;
module.exports.checkConnection = checkConnection;
