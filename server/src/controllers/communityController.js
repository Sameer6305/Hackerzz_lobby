const { z } = require('zod');
const prisma = require('../config/database');
const ApiError = require('../utils/apiError');

// ─── Helper Functions ────────────────────────────────────
const convertHackathonArrays = (hackathon) => {
  if (!hackathon) return null;
  return {
    ...hackathon,
    techStack: hackathon.techStack ? hackathon.techStack.split(',').map(t => t.trim()) : [],
    keywords: hackathon.keywords ? hackathon.keywords.split(',').map(k => k.trim()) : [],
  };
};

// ─── Validation ──────────────────────────────────────────
const createCommunitySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Community name required').max(100),
    description: z.string().max(500).optional(),
    hackathonId: z.string().min(1, 'Hackathon selection required'),
  }),
});

const addMemberSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Username required'),
  }),
});

// ─── Controllers ─────────────────────────────────────────
const createCommunity = async (req, res, next) => {
  try {
    const { name, description, hackathonId } = req.body;

    const hackathon = await prisma.hackathon.findUnique({ where: { id: hackathonId } });
    if (!hackathon) throw ApiError.notFound('Hackathon not found');

    // Use transaction to ensure community + admin member are created atomically
    const community = await prisma.$transaction(async (tx) => {
      return tx.community.create({
        data: {
          name,
          description,
          hackathonId,
          createdById: req.user.id,
          members: {
            create: { userId: req.user.id, role: 'ADMIN' },
          },
        },
        include: {
          hackathon: true,
          members: { include: { user: { select: { id: true, username: true, avatar: true } } } },
          _count: { select: { members: true } },
        },
      });
    });

    // Convert hackathon arrays
    const communityWithArrays = {
      ...community,
      hackathon: convertHackathonArrays(community.hackathon),
    };

    res.status(201).json({ success: true, data: { community: communityWithArrays } });
  } catch (error) {
    next(error);
  }
};

const getMyCommunities = async (req, res, next) => {
  try {
    const memberships = await prisma.communityMember.findMany({
      where: { userId: req.user.id },
      include: {
        community: {
          include: {
            hackathon: true,
            _count: { select: { members: true, messages: true } },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    const communities = memberships.map((m) => ({
      ...m.community,
      hackathon: convertHackathonArrays(m.community.hackathon),
      role: m.role,
      joinedAt: m.joinedAt,
    }));

    res.json({ success: true, data: { communities } });
  } catch (error) {
    next(error);
  }
};

const getMyDeadlines = async (req, res, next) => {
  try {
    const deadlines = await prisma.deadline.findMany({
      where: {
        community: {
          members: {
            some: { userId: req.user.id },
          },
        },
      },
      include: {
        community: {
          select: { id: true, name: true },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    res.json({ success: true, data: { deadlines } });
  } catch (error) {
    next(error);
  }
};

const getCommunity = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify membership
    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId: id } },
    });
    if (!membership) throw ApiError.forbidden('You are not a member of this community');

    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        hackathon: true,
        members: {
          include: { user: { select: { id: true, username: true, avatar: true, bio: true } } },
          orderBy: { joinedAt: 'asc' },
        },
        deadlines: { orderBy: { dueDate: 'asc' } },
        _count: { select: { messages: true } },
      },
    });

    if (!community) throw ApiError.notFound('Community not found');
    if (!community.isActive) throw ApiError.notFound('Community not found');

    // Convert hackathon arrays
    const communityWithArrays = {
      ...community,
      hackathon: convertHackathonArrays(community.hackathon),
    };

    res.json({ success: true, data: { community: communityWithArrays, role: membership.role } });
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    // Verify the community exists
    const community = await prisma.community.findUnique({ where: { id } });
    if (!community || !community.isActive) {
      throw ApiError.notFound('Community not found');
    }

    // Verify requester is admin
    const adminCheck = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId: id } },
    });
    if (!adminCheck || adminCheck.role !== 'ADMIN') {
      throw ApiError.forbidden('Only admins can add members');
    }

    // Find target user (case-insensitive search, exclude soft-deleted)
    const userToAdd = await prisma.user.findFirst({
      where: {
        username: { equals: username },
        isActive: true,
      },
    });
    if (!userToAdd) throw ApiError.notFound('User not found. Make sure the username is correct.');

    // Check for existing membership
    const existingMember = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: userToAdd.id, communityId: id } },
    });
    if (existingMember) throw ApiError.conflict('User is already a member of this community');

    // Create member and return full data for immediate UI update
    const newMember = await prisma.communityMember.create({
      data: { userId: userToAdd.id, communityId: id },
      include: {
        user: { select: { id: true, username: true, avatar: true, bio: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: `${userToAdd.username} added to community`,
      data: { member: newMember },
    });
  } catch (error) {
    next(error);
  }
};

const joinCommunity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const community = await prisma.community.findUnique({ where: { id } });
    if (!community || !community.isActive) throw ApiError.notFound('Community not found');

    const existing = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId: id } },
    });
    if (existing) throw ApiError.conflict('Already a member');

    const member = await prisma.communityMember.create({
      data: { userId: req.user.id, communityId: id },
      include: {
        user: { select: { id: true, username: true, avatar: true, bio: true } },
      },
    });

    res.status(201).json({ success: true, message: 'Joined community successfully', data: { member } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCommunity, getMyCommunities, getMyDeadlines, getCommunity, addMember, joinCommunity,
  createCommunitySchema, addMemberSchema,
};
