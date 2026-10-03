import { getPayload } from 'payload'
import configPromise from './payload.config'

const projects = [
  {
    name: 'Opsflow API',
    slug: 'opsflow-api',
    description: 'A production-style backend for managing tasks, approvals, and audit trails across internal teams.',
    featured: true,
    order: 1,
    techStack: [{ tech: 'Node.js' }, { tech: 'PostgreSQL' }, { tech: 'Redis' }, { tech: 'Docker' }],
    metrics: [
      { value: '42ms', label: 'Average API Response' },
      { value: '18', label: 'Service Endpoints' },
      { value: '99.9%', label: 'Local Test Uptime' },
    ],
    repoUrl: 'https://github.com/mdiksann/opsflow-api',
    liveUrl: 'https://opsflow-demo.vercel.app',
  },
  {
    name: 'Laravel Commerce API',
    slug: 'laravel-commerce-api',
    description: 'An e-commerce backend and admin workflow for products, carts, orders, payments, and role-based staff access.',
    featured: true,
    order: 2,
    techStack: [{ tech: 'Laravel' }, { tech: 'PHP' }, { tech: 'MySQL' }, { tech: 'Redis' }, { tech: 'Sanctum' }],
    metrics: [
      { value: '5', label: 'Core Modules' },
      { value: 'RBAC', label: 'Staff Access' },
      { value: 'Queue', label: 'Async Jobs' },
    ],
    repoUrl: 'https://github.com/mdiksann/laravel-commerce-api',
  },
  {
    name: 'Deploy Watcher',
    slug: 'deploy-watcher',
    description: 'A compact monitoring tool that tracks deploy status, build logs, and failed checks in one place.',
    featured: false,
    order: 3,
    techStack: [{ tech: 'Go' }, { tech: 'Webhooks' }, { tech: 'REST API' }, { tech: 'SQLite' }],
    metrics: [
      { value: '6 providers', label: 'Integrations' },
      { value: '<1s', label: 'Webhook Processing' },
    ],
    repoUrl: 'https://github.com/mdiksann/deploy-watcher',
  },
  {
    name: 'AWS 3-Tier Web Architecture',
    slug: 'aws-3-tier-web-architecture',
    description: 'Architecture diagram for a highly available AWS web application: CloudFront and an ALB route traffic to EC2 web servers in two public subnets, backed by Multi-AZ RDS in private subnets.',
    featured: true,
    order: 4,
    techStack: [{ tech: 'AWS' }, { tech: 'VPC' }, { tech: 'ALB' }, { tech: 'EC2' }, { tech: 'RDS' }, { tech: 'Terraform' }],
    metrics: [
      { value: '3-tier', label: 'Architecture Pattern' },
      { value: '2 AZ', label: 'Availability Layout' },
      { value: 'IaC', label: 'Terraform Definition' },
    ],
  },
  {
    name: 'AWS Serverless API Architecture',
    slug: 'aws-serverless-api-architecture',
    description: 'Topology only: an event-driven API path from API Gateway to Lambda, DynamoDB, SQS, and CloudWatch.',
    featured: false,
    order: 5,
    techStack: [{ tech: 'AWS' }, { tech: 'API Gateway' }, { tech: 'Lambda' }, { tech: 'DynamoDB' }, { tech: 'SQS' }, { tech: 'CloudWatch' }],
    metrics: [
      { value: 'Serverless', label: 'Compute Model' },
      { value: 'Event-driven', label: 'Integration Pattern' },
      { value: 'IaC', label: 'Deployment Notes' },
    ],
  },
  {
    name: 'Booking System API',
    slug: 'booking-system-api',
    description: 'A backend for appointments, availability, booking confirmation, and reminders across customers and service providers.',
    featured: false,
    order: 6,
    techStack: [{ tech: 'Node.js' }, { tech: 'PostgreSQL' }, { tech: 'Redis' }, { tech: 'REST API' }],
    metrics: [
      { value: '3', label: 'User Roles' },
      { value: 'UTC', label: 'Time-safe Scheduling' },
    ],
    repoUrl: 'https://github.com/mdiksann/booking-system-api',
  },
  {
    name: 'Real-Time Chat App',
    slug: 'real-time-chat-app',
    description: 'A fullstack messaging app with conversations, presence, unread counts, and durable message history.',
    featured: false,
    order: 7,
    techStack: [{ tech: 'Next.js' }, { tech: 'TypeScript' }, { tech: 'WebSocket' }, { tech: 'PostgreSQL' }, { tech: 'Redis' }],
    metrics: [
      { value: 'Live', label: 'Presence Updates' },
      { value: '2 roles', label: 'Conversation Access' },
    ],
    repoUrl: 'https://github.com/mdiksann/real-time-chat-app',
  },
  {
    name: 'API Health Console',
    slug: 'api-health-console',
    description: 'A lightweight operations console for checking API uptime, latency, and failing endpoint patterns.',
    featured: false,
    order: 8,
    techStack: [{ tech: 'Next.js' }, { tech: 'Go' }, { tech: 'PostgreSQL' }, { tech: 'Docker' }],
    metrics: [
      { value: '10', label: 'Tracked Services' },
      { value: '5m', label: 'Check Interval' },
    ],
    repoUrl: 'https://github.com/mdiksann/api-health-console',
  },
]

const skills = [
  {
    category: 'Backend',
    description: 'Designing APIs, database schemas, queues, auth flows, and deployment-ready services.',
    order: 1,
    items: [{ name: 'Node.js' }, { name: 'Express' }, { name: 'Go' }, { name: 'REST API' }, { name: 'JWT' }],
  },
  {
    category: 'Frontend',
    description: 'Building polished interfaces with server-rendered React, responsive layouts, and practical animation.',
    order: 2,
    items: [{ name: 'Next.js' }, { name: 'React' }, { name: 'TypeScript' }, { name: 'Tailwind CSS' }],
  },
  {
    category: 'Database & Infrastructure',
    description: 'Working with relational data, local-first development, containers, and deployment pipelines.',
    order: 3,
    items: [{ name: 'PostgreSQL' }, { name: 'SQLite' }, { name: 'Redis' }, { name: 'Docker' }, { name: 'Vercel' }],
  },
  {
    category: 'Tools & Workflow',
    description: 'Keeping projects maintainable with version control, tests, docs, and clear handoff notes.',
    order: 4,
    items: [
      { name: 'Git', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
      { name: 'ESLint', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/eslint/eslint-original.svg' },
      { name: 'Payload CMS', logoUrl: 'https://cdn.simpleicons.org/payloadcms/000000' },
      { name: 'Postman', logoUrl: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/postman.png' },
      { name: 'Linux', logoUrl: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/linux.png' },
    ],
  },
]

export async function seed() {
  const config = await configPromise
  const payload = await getPayload({ config })
  
  // Try to find an existing user
  const { docs: users } = await payload.find({
    collection: 'users',
    limit: 1,
  })

  if (users.length === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'mdiksann@gmail.com',
        password: 'password',
        name: 'Muhammad Iksan',
      },
    })
    console.log('Created admin user: mdiksann@gmail.com / password')
  }

  await payload.updateGlobal({
    slug: 'profile',
    data: {
      name: 'Muhammad Iksan',
      titles: [{ title: 'Fullstack Developer' }, { title: 'Backend Developer' }, { title: 'Cloud Engineer' }],
      about: 'I build products from clean interfaces and reliable backends to cloud infrastructure that keeps everything running smoothly.',
      location: 'Yogyakarta, Indonesia',
      status: 'Available for freelance projects',
      email: 'mdiksann@gmail.com',
      education: [
        {
          school: 'Universitas Teknologi Digital Indonesia',
          major: 'Informatics / Software Engineering',
          gpa: '3.80',
          achievements: [
            { achievement: 'Built multiple web application prototypes with CMS-backed content.' },
            { achievement: 'Focused on backend architecture, API design, and database modelling.' },
          ],
        },
      ],
      experience: [
        {
          title: 'Fullstack Developer Intern',
          company: 'PT Razen Teknologi',
          description: 'Worked on web application features, API integration, and responsive interface implementation.',
          achievements: [
            { achievement: 'Implemented reusable UI sections connected to backend data.' },
            { achievement: 'Improved handoff quality with clearer component structure and documentation.' },
          ],
        },
        {
          title: 'Freelance Web Developer',
          company: 'Independent',
          description: 'Designed and developed CMS-ready portfolio and business websites for small teams.',
          achievements: [
            { achievement: 'Delivered admin-editable pages using modern React and Payload CMS.' },
            { achievement: 'Set up clean deployment flows for preview and production environments.' },
          ],
        },
      ],
      socials: {
        github: 'https://github.com/mdiksann',
        linkedin: 'https://www.linkedin.com/in/mdiksann/',
        twitter: 'https://twitter.com/mdiksann',
      },
    }
  })
  console.log('Updated profile demo data')

  const { docs: existingProjects } = await payload.find({ collection: 'projects', limit: 100 })
  for (const project of existingProjects) {
    await payload.delete({ collection: 'projects', id: project.id })
  }

  for (const project of projects) {
    const thumbnail = project.slug === 'aws-3-tier-web-architecture'
      ? (await payload.find({ collection: 'media', where: { filename: { equals: 'Highly Available Web Infrastructure on AWS.png' } }, limit: 1 })).docs[0]?.id
      : undefined
    await payload.create({ collection: 'projects', data: { ...project, thumbnail } })
  }
  console.log(`Created ${projects.length} demo projects`)

  const { docs: existingSkills } = await payload.find({ collection: 'skills', limit: 100 })
  for (const skill of existingSkills) {
    await payload.delete({ collection: 'skills', id: skill.id })
  }

  for (const skill of skills) {
    await payload.create({ collection: 'skills', data: skill })
  }
  console.log(`Created ${skills.length} demo skill groups`)

  console.log('Seed complete!')
}

// Allow running directly from command line
if (process.argv[1]?.endsWith('seed.ts')) {
  seed().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
