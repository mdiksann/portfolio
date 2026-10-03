import { randomUUID } from 'node:crypto'
import Database from 'better-sqlite3'

const db = new Database('payload.db')
const now = () => new Date().toISOString()

const projects = [
  {
    name: 'Opsflow API',
    slug: 'opsflow-api',
    description: 'A production-style backend for managing tasks, approvals, and audit trails across internal teams.',
    featured: 1,
    order: 1,
    techStack: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    metrics: [
      ['42ms', 'Average API Response'],
      ['18', 'Service Endpoints'],
      ['99.9%', 'Local Test Uptime'],
    ],
    repoUrl: 'https://github.com/mdiksann/opsflow-api',
    liveUrl: 'https://opsflow-demo.vercel.app',
  },
  {
    name: 'Laravel Commerce API',
    slug: 'laravel-commerce-api',
    description: 'An e-commerce backend and admin workflow for products, carts, orders, payments, and role-based staff access.',
    featured: 1,
    order: 2,
    techStack: ['Laravel', 'PHP', 'MySQL', 'Redis', 'Sanctum'],
    metrics: [
      ['5', 'Core Modules'],
      ['RBAC', 'Staff Access'],
      ['Queue', 'Async Jobs'],
    ],
    repoUrl: 'https://github.com/mdiksann/laravel-commerce-api',
    liveUrl: null,
  },
  {
    name: 'Deploy Watcher',
    slug: 'deploy-watcher',
    description: 'A compact monitoring tool that tracks deploy status, build logs, and failed checks in one place.',
    featured: 0,
    order: 3,
    techStack: ['Go', 'Webhooks', 'REST API', 'SQLite'],
    metrics: [
      ['6 providers', 'Integrations'],
      ['<1s', 'Webhook Processing'],
    ],
    repoUrl: 'https://github.com/mdiksann/deploy-watcher',
    liveUrl: null,
  },
  {
    name: 'AWS 3-Tier Web Architecture',
    slug: 'aws-3-tier-web-architecture',
    description: 'Architecture diagram for a highly available AWS web application: CloudFront and an ALB route traffic to EC2 web servers in two public subnets, backed by Multi-AZ RDS in private subnets.',
    featured: 1,
    order: 4,
    techStack: ['AWS', 'VPC', 'ALB', 'EC2', 'RDS', 'Terraform'],
    metrics: [
      ['3-tier', 'Architecture Pattern'],
      ['2 AZ', 'Availability Layout'],
      ['IaC', 'Terraform Definition'],
    ],
    repoUrl: null,
    liveUrl: null,
  },
  {
    name: 'AWS Serverless API Architecture',
    slug: 'aws-serverless-api-architecture',
    description: 'Topology only: an event-driven API path from API Gateway to Lambda, DynamoDB, SQS, and CloudWatch.',
    featured: 0,
    order: 5,
    techStack: ['AWS', 'API Gateway', 'Lambda', 'DynamoDB', 'SQS', 'CloudWatch'],
    metrics: [
      ['Serverless', 'Compute Model'],
      ['Event-driven', 'Integration Pattern'],
      ['IaC', 'Deployment Notes'],
    ],
    repoUrl: null,
    liveUrl: null,
  },
  {
    name: 'Booking System API',
    slug: 'booking-system-api',
    description: 'A backend for appointments, availability, booking confirmation, and reminders across customers and service providers.',
    featured: 0,
    order: 6,
    techStack: ['Node.js', 'PostgreSQL', 'Redis', 'REST API'],
    metrics: [
      ['3', 'User Roles'],
      ['UTC', 'Time-safe Scheduling'],
    ],
    repoUrl: 'https://github.com/mdiksann/booking-system-api',
    liveUrl: null,
  },
  {
    name: 'Real-Time Chat App',
    slug: 'real-time-chat-app',
    description: 'A fullstack messaging app with conversations, presence, unread counts, and durable message history.',
    featured: 0,
    order: 7,
    techStack: ['Next.js', 'TypeScript', 'WebSocket', 'PostgreSQL', 'Redis'],
    metrics: [
      ['Live', 'Presence Updates'],
      ['2 roles', 'Conversation Access'],
    ],
    repoUrl: 'https://github.com/mdiksann/real-time-chat-app',
    liveUrl: null,
  },
  {
    name: 'API Health Console',
    slug: 'api-health-console',
    description: 'A lightweight operations console for checking API uptime, latency, and failing endpoint patterns.',
    featured: 0,
    order: 8,
    techStack: ['Next.js', 'Go', 'PostgreSQL', 'Docker'],
    metrics: [
      ['10', 'Tracked Services'],
      ['5m', 'Check Interval'],
    ],
    repoUrl: 'https://github.com/mdiksann/api-health-console',
    liveUrl: null,
  },
]

const skills = [
  {
    category: 'Backend',
    description: 'Designing APIs, database schemas, queues, auth flows, and deployment-ready services.',
    order: 1,
    items: ['Node.js', 'Express', 'Go', 'REST API', 'JWT'],
  },
  {
    category: 'Frontend',
    description: 'Building polished interfaces with server-rendered React, responsive layouts, and practical animation.',
    order: 2,
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    category: 'Database & Infrastructure',
    description: 'Working with relational data, local-first development, containers, and deployment pipelines.',
    order: 3,
    items: ['PostgreSQL', 'SQLite', 'Redis', 'Docker', 'Vercel'],
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

db.transaction(() => {
  const date = now()

  db.exec(`
    delete from profile_titles;
    delete from profile_education_achievements;
    delete from profile_education;
    delete from profile_experience_achievements;
    delete from profile_experience;
    delete from projects_tech_stack;
    delete from projects_metrics;
    delete from projects;
    delete from skills_items;
    delete from skills;
  `)

  const profile = db.prepare('select id from profile limit 1').get()
  const profileId = profile?.id || 1

  if (profile) {
    db.prepare(`
      update profile
      set name = ?, about = ?, location = ?, email = ?, status = ?,
          socials_github = ?, socials_linkedin = ?, socials_twitter = ?, updated_at = ?
      where id = ?
    `).run(
      'Muhammad Iksan',
      'I build products from clean interfaces and reliable backends to cloud infrastructure that keeps everything running smoothly.',
      'Yogyakarta, Indonesia',
      'mdiksann@gmail.com',
      'Available for freelance projects',
      'https://github.com/mdiksann',
      'https://www.linkedin.com/in/mdiksann/',
      'https://twitter.com/mdiksann',
      date,
      profileId,
    )
  } else {
    db.prepare(`
      insert into profile
      (id, name, about, location, email, status, socials_github, socials_linkedin, socials_twitter, updated_at, created_at)
      values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      profileId,
      'Muhammad Iksan',
      'I build products from clean interfaces and reliable backends to cloud infrastructure that keeps everything running smoothly.',
      'Yogyakarta, Indonesia',
      'mdiksann@gmail.com',
      'Available for freelance projects',
      'https://github.com/mdiksann',
      'https://www.linkedin.com/in/mdiksann/',
      'https://twitter.com/mdiksann',
      date,
      date,
    )
  }

  const insertTitle = db.prepare('insert into profile_titles (_order, _parent_id, id, title) values (?, ?, ?, ?)')
  ;['Fullstack Developer', 'Backend Developer', 'Cloud Engineer'].forEach((title, order) => {
    insertTitle.run(order + 1, profileId, randomUUID(), title)
  })

  const educationId = randomUUID()
  db.prepare('insert into profile_education (_order, _parent_id, id, school, major, gpa) values (?, ?, ?, ?, ?, ?)').run(
    1,
    profileId,
    educationId,
    'Universitas Teknologi Digital Indonesia',
    'Informatics / Software Engineering',
    '3.80',
  )
  const insertEducationAchievement = db.prepare('insert into profile_education_achievements (_order, _parent_id, id, achievement) values (?, ?, ?, ?)')
  ;[
    'Built multiple web application prototypes with CMS-backed content.',
    'Focused on backend architecture, API design, and database modelling.',
  ].forEach((achievement, order) => insertEducationAchievement.run(order + 1, educationId, randomUUID(), achievement))

  const insertExperience = db.prepare('insert into profile_experience (_order, _parent_id, id, title, company, description) values (?, ?, ?, ?, ?, ?)')
  const insertExperienceAchievement = db.prepare('insert into profile_experience_achievements (_order, _parent_id, id, achievement) values (?, ?, ?, ?)')
  ;[
    {
      title: 'Fullstack Developer Intern',
      company: 'PT Razen Teknologi',
      description: 'Worked on web application features, API integration, and responsive interface implementation.',
      achievements: [
        'Implemented reusable UI sections connected to backend data.',
        'Improved handoff quality with clearer component structure and documentation.',
      ],
    },
    {
      title: 'Freelance Web Developer',
      company: 'Independent',
      description: 'Designed and developed CMS-ready portfolio and business websites for small teams.',
      achievements: [
        'Delivered admin-editable pages using modern React and Payload CMS.',
        'Set up clean deployment flows for preview and production environments.',
      ],
    },
  ].forEach((experience, order) => {
    const experienceId = randomUUID()
    insertExperience.run(order + 1, profileId, experienceId, experience.title, experience.company, experience.description)
    experience.achievements.forEach((achievement, achievementOrder) => {
      insertExperienceAchievement.run(achievementOrder + 1, experienceId, randomUUID(), achievement)
    })
  })

  const insertProject = db.prepare(`
    insert into projects (name, slug, description, thumbnail_id, repo_url, live_url, featured, "order", updated_at, created_at)
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const insertProjectTech = db.prepare('insert into projects_tech_stack (_order, _parent_id, id, tech) values (?, ?, ?, ?)')
  const insertProjectMetric = db.prepare('insert into projects_metrics (_order, _parent_id, id, value, label) values (?, ?, ?, ?, ?)')
  const awsDiagram = db.prepare('select id from media where filename = ?').get('Highly Available Web Infrastructure on AWS.png')
  for (const project of projects) {
    const result = insertProject.run(
      project.name,
      project.slug,
      project.description,
      project.slug === 'aws-3-tier-web-architecture' ? awsDiagram?.id ?? null : null,
      project.repoUrl,
      project.liveUrl,
      project.featured,
      project.order,
      date,
      date,
    )
    project.techStack.forEach((tech, order) => insertProjectTech.run(order + 1, result.lastInsertRowid, randomUUID(), tech))
    project.metrics.forEach(([value, label], order) => insertProjectMetric.run(order + 1, result.lastInsertRowid, randomUUID(), value, label))
  }

  const insertSkill = db.prepare('insert into skills (category, description, "order", updated_at, created_at) values (?, ?, ?, ?, ?)')
  const insertSkillItem = db.prepare('insert into skills_items (_order, _parent_id, id, name, logo_url) values (?, ?, ?, ?, ?)')
  for (const skill of skills) {
    const result = insertSkill.run(skill.category, skill.description, skill.order, date, date)
    skill.items.forEach((item, order) => {
      const name = typeof item === 'string' ? item : item.name
      const logoUrl = typeof item === 'string' ? null : item.logoUrl

      insertSkillItem.run(order + 1, result.lastInsertRowid, randomUUID(), name, logoUrl)
    })
  }
})()

db.close()
console.log(`Seeded ${projects.length} projects and ${skills.length} skill groups.`)
