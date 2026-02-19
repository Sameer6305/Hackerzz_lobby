const logger = require('../utils/logger');
const ApiError = require('../utils/apiError');

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Prisma known errors
  if (err.code === 'P2002') {
    statusCode = 409;
    const field = err.meta?.target?.[0] || 'field';
    message = `A record with this ${field} already exists`;
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  // Foreign key constraint violation
  if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Referenced record does not exist';
  }

  // Prisma connection errors (DB unreachable)
  if (err.name === 'PrismaClientInitializationError' || err.name === 'PrismaClientKnownRequestError') {
    if (err.message?.includes("Can't reach database server") || err.message?.includes('SQLITE_CANTOPEN')) {
      statusCode = 503;
      message = 'Service temporarily unavailable. Please try again later.';
    }
  }

  // Prisma validation error (bad data types, etc.)
  if (err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Invalid request data';
  }

  // Log error
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`, { stack: err.stack, url: req.originalUrl });
  } else {
    logger.warn(`${statusCode} - ${message}`, { url: req.originalUrl });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && statusCode >= 500 && { stack: err.stack }),
  });
};

const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};

module.exports = { errorHandler, notFoundHandler };
