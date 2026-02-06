const { z } = require('zod');
const prisma = require('../config/database');
const ApiError = require('../utils/apiError');

const createHackathonSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name required').max(200),
    description: z.string().min(10, 'Description too short').max(2000),
    domain: z.string().min(2, 'Domain required'),
    techStack: z.array(z.string()).min(1, 'At least one technology required'),
    keywords: z.array(z.string()).optional().default([]),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
  }),
});

const createDeadlineSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title required').max(200),
    description: z.string().max(500).optional(),
    dueDate: z.string().min(1, 'Due date required'),
  }),
});

const getHackathons = async (req, res, next) => {
  try {
    const { search, domain } = req.query;

    const hackathons = await prisma.hackathon.findMany({
      where: {
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(domain && { domain: { equals: domain, mode: 'insensitive' } }),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({ success: true, data: { hackathons } });
  } catch (error) {
    next(error);
  }
};

const createHackathon = async (req, res, next) => {
  try {
    const { name, description, domain, techStack, keywords, startDate, endDate, website } = req.body;

    // Auto-generate keywords from name, domain, and techStack
    const autoKeywords = [
      ...name.toLowerCase().split(/\s+/),
      domain.toLowerCase(),
      ...techStack.map((t) => t.toLowerCase()),
      ...(keywords || []).map((k) => k.toLowerCase()),
    ];
    const uniqueKeywords = [...new Set(autoKeywords)].filter((k) => k.length > 2);

    const hackathon = await prisma.hackathon.create({
      data: {
        name,
        description,
        domain,
        techStack,
        keywords: uniqueKeywords,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        website: website || null,
      },
    });

    res.status(201).json({ success: true, data: { hackathon } });
  } catch (error) {
    next(error);
  }
};

const getHackathon = async (req, res, next) => {
  try {
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { communities: true } } },
    });
    if (!hackathon) throw ApiError.notFound('Hackathon not found');

    res.json({ success: true, data: { hackathon } });
  } catch (error) {
    next(error);
  }
};

const addDeadline = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;

    // Verify membership
    const membership = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId: req.user.id, communityId: id } },
    });
    if (!membership) throw ApiError.forbidden('Not a member');

    const deadline = await prisma.deadline.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        communityId: id,
        createdById: req.user.id,
      },
    });

    res.status(201).json({ success: true, data: { deadline } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHackathons, createHackathon, getHackathon, addDeadline, createHackathonSchema, createDeadlineSchema };
