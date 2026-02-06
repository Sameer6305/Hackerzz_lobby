const { z } = require('zod');
const prisma = require('../config/database');
const ApiError = require('../utils/apiError');

const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Message cannot be empty').max(2000),
  }),
});

const getMessages = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cursor, limit = 50 } = req.query;

    // Verify membership
    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId: id } },
    });
    if (!membership) throw ApiError.forbidden('Not a member of this community');

    const messages = await prisma.message.findMany({
      where: { communityId: id },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit, 10),
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    });

    res.json({
      success: true,
      data: {
        messages: messages.reverse(),
        nextCursor: messages.length === parseInt(limit, 10) ? messages[0]?.id : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Verify membership
    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId: id } },
    });
    if (!membership) throw ApiError.forbidden('Not a member of this community');

    const message = await prisma.message.create({
      data: { content, userId: req.user.id, communityId: id },
      include: {
        user: { select: { id: true, username: true, avatar: true } },
      },
    });

    res.status(201).json({ success: true, data: { message } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMessages, sendMessage, sendMessageSchema };
