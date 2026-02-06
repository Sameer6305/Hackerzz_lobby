const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Use fresh client for seeding (not the app singleton)
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

async function seed() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.message.deleteMany();
  await prisma.deadline.deleteMany();
  await prisma.communityMember.deleteMany();
  await prisma.community.deleteMany();
  await prisma.hackathon.deleteMany();
  await prisma.user.deleteMany();

  // Create demo users
  const password = await bcrypt.hash('password123', 12);

  const user1 = await prisma.user.create({
    data: { email: 'alice@example.com', username: 'alice_dev', password, bio: 'Full-stack developer' },
  });
  const user2 = await prisma.user.create({
    data: { email: 'bob@example.com', username: 'bob_hacker', password, bio: 'Blockchain enthusiast' },
  });

  // Create hackathons
  const hackathon1 = await prisma.hackathon.create({
    data: {
      name: 'ETH Global 2025',
      description: 'Build the future of decentralized finance, NFTs, and Web3 applications.',
      domain: 'Blockchain',
      techStack: ['Solidity', 'React', 'Ethers.js', 'Hardhat', 'IPFS'],
      keywords: ['defi', 'nft', 'web3', 'ethereum', 'smart-contracts', 'dapp'],
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-03-15'),
      website: 'https://ethglobal.com',
    },
  });

  const hackathon2 = await prisma.hackathon.create({
    data: {
      name: 'AI Innovation Challenge',
      description: 'Leverage machine learning and AI to solve real-world problems in healthcare and education.',
      domain: 'AI/ML',
      techStack: ['Python', 'TensorFlow', 'PyTorch', 'FastAPI', 'React'],
      keywords: ['machine-learning', 'deep-learning', 'nlp', 'computer-vision', 'healthcare'],
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-04-20'),
      website: 'https://devpost.com',
    },
  });

  const hackathon3 = await prisma.hackathon.create({
    data: {
      name: 'Full Stack Buildathon',
      description: 'Build and deploy a production-ready web application from scratch.',
      domain: 'Web Development',
      techStack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
      keywords: ['fullstack', 'web-app', 'saas', 'rest-api', 'deployment'],
      startDate: new Date('2025-05-10'),
      endDate: new Date('2025-05-25'),
    },
  });

  // Create a community
  const community = await prisma.community.create({
    data: {
      name: 'DeFi Builders',
      description: 'Building a DeFi protocol for ETH Global',
      hackathonId: hackathon1.id,
      createdById: user1.id,
      members: {
        create: [
          { userId: user1.id, role: 'ADMIN' },
          { userId: user2.id, role: 'MEMBER' },
        ],
      },
    },
  });

  // Add some messages
  await prisma.message.createMany({
    data: [
      { content: 'Hey team! Excited to start building our DeFi protocol.', userId: user1.id, communityId: community.id },
      { content: 'Same here! I have some ideas for the smart contract architecture.', userId: user2.id, communityId: community.id },
      { content: 'Let\'s use OpenZeppelin for the base contracts and Hardhat for testing.', userId: user1.id, communityId: community.id },
    ],
  });

  // Add deadlines
  await prisma.deadline.create({
    data: {
      title: 'Smart Contract MVP',
      description: 'Complete basic lending/borrowing contract',
      dueDate: new Date('2025-03-08'),
      communityId: community.id,
      createdById: user1.id,
    },
  });

  console.log('✅ Seed complete!');
  console.log(`   Users: ${user1.username}, ${user2.username}`);
  console.log(`   Hackathons: ${hackathon1.name}, ${hackathon2.name}, ${hackathon3.name}`);
  console.log(`   Community: ${community.name}`);
}

seed()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
