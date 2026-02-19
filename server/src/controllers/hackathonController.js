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
            { name: { contains: search } },
            { description: { contains: search } },
            { keywords: { contains: search } },
          ],
        }),
        ...(domain && { domain: { equals: domain } }),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { _count: { select: { communities: true } } },
    });

    // Convert comma-separated strings back to arrays
    const hackathonsWithArrays = hackathons.map(h => ({
      ...h,
      techStack: h.techStack ? h.techStack.split(',').map(t => t.trim()) : [],
      keywords: h.keywords ? h.keywords.split(',').map(k => k.trim()) : [],
    }));

    res.json({ success: true, data: { hackathons: hackathonsWithArrays } });
  } catch (error) {
    next(error);
  }
};

const createHackathon = async (req, res, next) => {
  try {
    const { name, description, domain, techStack, keywords, startDate, endDate, website } = req.body;

    // Convert arrays to comma-separated strings for SQLite
    const techStackStr = Array.isArray(techStack) ? techStack.join(',') : techStack;
    const keywordsArray = Array.isArray(keywords) ? keywords : [];
    
    // Auto-generate keywords from name, domain, and techStack
    const techStackArray = Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',') : []);
    const autoKeywords = [
      ...name.toLowerCase().split(/\s+/),
      domain.toLowerCase(),
      ...techStackArray.map((t) => t.toLowerCase().trim()),
      ...keywordsArray.map((k) => k.toLowerCase()),
    ];
    const uniqueKeywords = [...new Set(autoKeywords)].filter((k) => k.length > 2);
    const keywordsStr = uniqueKeywords.join(',');

    const hackathon = await prisma.hackathon.create({
      data: {
        name,
        description,
        domain,
        techStack: techStackStr,
        keywords: keywordsStr,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        website: website || null,
      },
    });

    // Convert back to arrays for response
    const hackathonResponse = {
      ...hackathon,
      techStack: hackathon.techStack ? hackathon.techStack.split(',').map(t => t.trim()) : [],
      keywords: hackathon.keywords ? hackathon.keywords.split(',').map(k => k.trim()) : [],
    };

    res.status(201).json({ success: true, data: { hackathon: hackathonResponse } });
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

    // Convert comma-separated strings back to arrays
    const hackathonWithArrays = {
      ...hackathon,
      techStack: hackathon.techStack ? hackathon.techStack.split(',').map(t => t.trim()) : [],
      keywords: hackathon.keywords ? hackathon.keywords.split(',').map(k => k.trim()) : [],
    };

    res.json({ success: true, data: { hackathon: hackathonWithArrays } });
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
