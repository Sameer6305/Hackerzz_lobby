const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Use fresh client for seeding (not the app singleton)
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } },
});

async function seed() {
  console.log('🌱 Seeding database...');

  // Skip seeding if data already exists
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log('✅ Database already seeded, skipping.');
    return;
  }

  // Create demo users with realistic profiles
  const password = await bcrypt.hash('password123', 12);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'priya.sharma@gmail.com',
        username: 'priya_codes',
        password,
        bio: 'Full-stack dev | React & Node.js | 3x hackathon winner | CS @ IIT Delhi',
      },
    }),
    prisma.user.create({
      data: {
        email: 'arjun.mehta@outlook.com',
        username: 'arjunm',
        password,
        bio: 'Backend engineer obsessed with system design. Rust & Go enthusiast.',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sneha.reddy@gmail.com',
        username: 'sneha_dev',
        password,
        bio: 'ML researcher turned product engineer. Building AI tools for education.',
      },
    }),
    prisma.user.create({
      data: {
        email: 'rohan.patel@proton.me',
        username: 'rohan42',
        password,
        bio: 'Smart contract auditor & DeFi builder. Solidity + Foundry.',
      },
    }),
    prisma.user.create({
      data: {
        email: 'ananya.krishnan@gmail.com',
        username: 'ananya_k',
        password,
        bio: 'UI/UX designer who codes. Figma → React pipeline. Design systems nerd.',
      },
    }),
    prisma.user.create({
      data: {
        email: 'vikram.singh@yahoo.com',
        username: 'vikram_s',
        password,
        bio: 'DevOps & Cloud native. Kubernetes, Terraform, and CI/CD pipelines.',
      },
    }),
  ]);

  const [priya, arjun, sneha, rohan, ananya, vikram] = users;

  // Create hackathons with realistic details
  const hackathons = await Promise.all([
    prisma.hackathon.create({
      data: {
        name: 'ETH India 2025',
        description: 'India\'s largest Ethereum hackathon. Build DeFi protocols, NFT platforms, and Web3 infrastructure with mentorship from top blockchain engineers.',
        domain: 'Blockchain',
        techStack: 'Solidity,React,Ethers.js,Hardhat,IPFS,The Graph',
        keywords: 'defi,nft,web3,ethereum,smart-contracts,dapp,dao',
        startDate: new Date('2025-08-15'),
        endDate: new Date('2025-08-17'),
        website: 'https://ethindia.co',
      },
    }),
    prisma.hackathon.create({
      data: {
        name: 'Google AI Hackathon',
        description: 'Solve real-world challenges using Gemini APIs, TensorFlow, and Vertex AI. Focused on healthcare, accessibility, and climate tech.',
        domain: 'AI/ML',
        techStack: 'Python,TensorFlow,PyTorch,FastAPI,React,Gemini API',
        keywords: 'machine-learning,deep-learning,nlp,computer-vision,healthcare,gemini',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2025-09-14'),
        website: 'https://googleai.devpost.com',
      },
    }),
    prisma.hackathon.create({
      data: {
        name: 'HackMIT 2025',
        description: 'MIT\'s flagship hackathon bringing together 1000+ hackers to build projects across web, mobile, hardware, and beyond.',
        domain: 'Web Development',
        techStack: 'React,Next.js,Node.js,PostgreSQL,Tailwind CSS,Vercel',
        keywords: 'fullstack,web-app,saas,rest-api,deployment,nextjs',
        startDate: new Date('2025-10-04'),
        endDate: new Date('2025-10-06'),
        website: 'https://hackmit.org',
      },
    }),
    prisma.hackathon.create({
      data: {
        name: 'MLH Global Hack Week',
        description: 'A week-long hackathon series by Major League Hacking. Open to all skill levels with workshops and mentorship.',
        domain: 'Open Innovation',
        techStack: 'Python,JavaScript,React,Flutter,Firebase,Docker',
        keywords: 'beginner-friendly,open-source,community,learning,mlh',
        startDate: new Date('2025-06-09'),
        endDate: new Date('2025-06-15'),
        website: 'https://ghw.mlh.io',
      },
    }),
    prisma.hackathon.create({
      data: {
        name: 'Solana Grizzlython',
        description: 'Build the next generation of Solana dApps with $5M in prizes. Focus on payments, DePIN, and consumer crypto.',
        domain: 'Blockchain',
        techStack: 'Rust,Anchor,React,TypeScript,Solana Web3.js',
        keywords: 'solana,rust,depin,payments,crypto,anchor',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-07-31'),
        website: 'https://solana.com/grizzlython',
      },
    }),
  ]);

  const [ethIndia, googleAI, hackMIT, mlhGHW, solanaGrizzly] = hackathons;

  // Create communities with members
  const community1 = await prisma.community.create({
    data: {
      name: 'DeFi Protocol Builders',
      description: 'Building a lending/borrowing protocol with flash loans for ETH India 2025',
      hackathonId: ethIndia.id,
      createdById: priya.id,
      members: {
        create: [
          { userId: priya.id, role: 'ADMIN' },
          { userId: rohan.id, role: 'MEMBER' },
          { userId: arjun.id, role: 'MEMBER' },
        ],
      },
    },
  });

  const community2 = await prisma.community.create({
    data: {
      name: 'MedAI Squad',
      description: 'AI-powered diagnostic assistant for rural healthcare clinics',
      hackathonId: googleAI.id,
      createdById: sneha.id,
      members: {
        create: [
          { userId: sneha.id, role: 'ADMIN' },
          { userId: priya.id, role: 'MEMBER' },
          { userId: ananya.id, role: 'MEMBER' },
        ],
      },
    },
  });

  const community3 = await prisma.community.create({
    data: {
      name: 'DevFlow',
      description: 'Building an open-source project management tool for developer teams',
      hackathonId: hackMIT.id,
      createdById: arjun.id,
      members: {
        create: [
          { userId: arjun.id, role: 'ADMIN' },
          { userId: vikram.id, role: 'MEMBER' },
          { userId: ananya.id, role: 'MEMBER' },
        ],
      },
    },
  });

  // Add realistic chat messages
  await prisma.message.createMany({
    data: [
      // DeFi Protocol Builders
      { content: 'Hey team! I\'ve drafted the smart contract architecture for our lending pool. Using Aave V3 as reference.', userId: priya.id, communityId: community1.id },
      { content: 'Nice! I can handle the Solidity audit checklist. Should we use OpenZeppelin\'s AccessControl?', userId: rohan.id, communityId: community1.id },
      { content: 'Definitely. I\'ll set up the Hardhat testing environment and deployment scripts.', userId: arjun.id, communityId: community1.id },
      { content: 'Let\'s also integrate The Graph for indexing on-chain events. I have a subgraph template ready.', userId: priya.id, communityId: community1.id },
      { content: 'PR is up for the flash loan module — review when you get a chance 👀', userId: rohan.id, communityId: community1.id },

      // MedAI Squad
      { content: 'Just got access to the Gemini API! The vision model is insanely good for medical imaging.', userId: sneha.id, communityId: community2.id },
      { content: 'I\'ll build the React frontend with a clean upload flow for X-ray scans.', userId: priya.id, communityId: community2.id },
      { content: 'Working on the UI mockups in Figma. Going for a calming blue palette — clinics need that vibe.', userId: ananya.id, communityId: community2.id },
      { content: 'Training data preprocessed. We have 12K labeled chest X-rays from NIH dataset.', userId: sneha.id, communityId: community2.id },

      // DevFlow
      { content: 'Decided on the stack: Next.js + tRPC + PostgreSQL + Prisma. Any objections?', userId: arjun.id, communityId: community3.id },
      { content: 'Perfect. I\'ll handle the Docker setup and GitHub Actions CI pipeline.', userId: vikram.id, communityId: community3.id },
      { content: 'Starting the component library today. Cards, badges, kanban board — all with Tailwind.', userId: ananya.id, communityId: community3.id },
    ],
  });

  // Add deadlines
  await Promise.all([
    prisma.deadline.create({
      data: {
        title: 'Smart Contract MVP',
        description: 'Complete lending pool + flash loan contracts with basic tests',
        dueDate: new Date('2025-08-16T18:00:00Z'),
        communityId: community1.id,
        createdById: priya.id,
      },
    }),
    prisma.deadline.create({
      data: {
        title: 'Frontend Integration',
        description: 'Connect wallet, deposit, borrow, and repay flows working end-to-end',
        dueDate: new Date('2025-08-17T12:00:00Z'),
        communityId: community1.id,
        createdById: priya.id,
      },
    }),
    prisma.deadline.create({
      data: {
        title: 'Model Training Complete',
        description: 'Achieve 90%+ accuracy on chest X-ray classification',
        dueDate: new Date('2025-09-07T23:59:00Z'),
        communityId: community2.id,
        createdById: sneha.id,
      },
    }),
    prisma.deadline.create({
      data: {
        title: 'Demo Video',
        description: 'Record 3-minute demo showing end-to-end diagnostic flow',
        dueDate: new Date('2025-09-13T18:00:00Z'),
        communityId: community2.id,
        createdById: sneha.id,
      },
    }),
    prisma.deadline.create({
      data: {
        title: 'Kanban Board Prototype',
        description: 'Drag-and-drop board with real-time sync via WebSockets',
        dueDate: new Date('2025-10-05T20:00:00Z'),
        communityId: community3.id,
        createdById: arjun.id,
      },
    }),
  ]);

  console.log('✅ Seed complete!');
  console.log(`   Users: ${users.map(u => u.username).join(', ')}`);
  console.log(`   Hackathons: ${hackathons.map(h => h.name).join(', ')}`);
  console.log(`   Communities: ${community1.name}, ${community2.name}, ${community3.name}`);
  console.log('   Login: any user email + password123');
}

seed()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
