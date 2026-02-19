const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const prisma = require('../config/database');
const config = require('../config');
const ApiError = require('../utils/apiError');

// ─── Validation Schemas ──────────────────────────────────
const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters').max(30).regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(128),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores').optional(),
    bio: z.string().max(500, 'Bio must be under 500 characters').optional(),
    avatar: z.string().url('Invalid avatar URL').optional().nullable(),
  }),
});

// ─── Helpers ─────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    algorithm: config.jwt.algorithm,
    issuer: config.jwt.issuer,
  });
};

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  username: user.username,
  avatar: user.avatar,
  bio: user.bio,
  createdAt: user.createdAt,
});

// ─── Controllers ─────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      throw ApiError.conflict(
        existing.email === email ? 'Email already registered' : 'Username already taken'
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      data: { user: sanitizeUser(user), token },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      data: { user: sanitizeUser(user), token },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        communities: {
          include: {
            community: {
              include: { hackathon: true, _count: { select: { members: true } } },
            },
          },
        },
      },
    });

    res.json({ success: true, data: { user: sanitizeUser(user), communities: user.communities } });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { username, bio, avatar } = req.body;

    // Check for username conflict if username is being changed
    if (username && username !== req.user.username) {
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing) throw ApiError.conflict('Username already taken');
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(username && { username }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      },
    });

    res.json({ success: true, data: { user: sanitizeUser(user) } });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile, registerSchema, loginSchema, updateProfileSchema };
