const { z } = require('zod');
const prisma = require('../config/database');
const ApiError = require('../utils/apiError');

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

    const community = await prisma.community.create({
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

    res.status(201).json({ success: true, data: { community } });
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
      role: m.role,
      joinedAt: m.joinedAt,
    }));

    res.json({ success: true, data: { communities } });
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

    res.json({ success: true, data: { community, role: membership.role } });
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    // Verify requester is admin
    const adminCheck = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId: id } },
    });
    if (!adminCheck || adminCheck.role !== 'ADMIN') {
      throw ApiError.forbidden('Only admins can add members');
    }

    const userToAdd = await prisma.user.findUnique({ where: { username } });
    if (!userToAdd) throw ApiError.notFound('User not found');

    const existingMember = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: userToAdd.id, communityId: id } },
    });
    if (existingMember) throw ApiError.conflict('User is already a member');

    await prisma.communityMember.create({
      data: { userId: userToAdd.id, communityId: id },
    });

    res.json({ success: true, message: `${username} added to community` });
  } catch (error) {
    next(error);
  }
};

const joinCommunity = async (req, res, next) => {
  try {
    const { id } = req.params;

    const community = await prisma.community.findUnique({ where: { id } });
    if (!community) throw ApiError.notFound('Community not found');

    const existing = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId: id } },
    });
    if (existing) throw ApiError.conflict('Already a member');

    await prisma.communityMember.create({
      data: { userId: req.user.id, communityId: id },
    });

    res.json({ success: true, message: 'Joined community successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCommunity, getMyCommunities, getCommunity, addMember, joinCommunity,
  createCommunitySchema, addMemberSchema,
};
