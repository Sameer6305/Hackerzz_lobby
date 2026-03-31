const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

// ─── Security ────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || config.cors.origins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsing ────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ─────────────────────────────────────────────
app.use(morgan('combined', {
  stream: { write: (message) => logger.http(message.trim()) },
}));

// ─── Health Check ────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  const dbOk = await require('./config/database').checkConnection().catch(() => false);
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? 'ok' : 'degraded',
    database: dbOk ? 'connected' : 'unreachable',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ─── API Routes ──────────────────────────────────────────
app.use('/api', routes);

// ─── Error Handling ──────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────
const prisma = require('./config/database');
const PORT = config.port;

const startServer = async () => {
  const isConnected = await prisma.checkConnection();
  if (!isConnected) {
    logger.error('Failed to connect to database after retries. Starting server in degraded mode...');
  }

  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT} in ${config.env} mode`);
    logger.info(`📡 API available at http://localhost:${PORT}/api`);
    if (!isConnected) {
      logger.warn('⚠️  Database is unreachable — API requests requiring DB will fail');
    }
  });
};

startServer();

module.exports = app;
