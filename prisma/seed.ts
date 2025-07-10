import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create users first
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: "ADMIN",
      password: await bcrypt.hash("password", 10),
      avatar: "/avatars/admin.jpg",
    },
  });

  const editorUser = await prisma.user.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      email: "jane@example.com",
      name: "Jane Smith",
      role: "EDITOR",
      password: await bcrypt.hash("password", 10),
      avatar: "/avatars/jane.jpg",
    },
  });

  const authorUser = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      name: "John Doe",
      role: "AUTHOR",
      password: await bcrypt.hash("password", 10),
      avatar: "/avatars/john.jpg",
    },
  });

  // Create sample tags
  const nextjsTag = await prisma.tag.upsert({
    where: { slug: "nextjs" },
    update: {},
    create: {
      name: "Next.js",
      slug: "nextjs",
      color: "#000000",
    },
  });

  const typescriptTag = await prisma.tag.upsert({
    where: { slug: "typescript" },
    update: {},
    create: {
      name: "TypeScript",
      slug: "typescript",
      color: "#3178c6",
    },
  });

  // Create sample blog posts
  await prisma.blogPost.upsert({
    where: { slug: "getting-started-nextjs-15" },
    update: {},
    create: {
      title: "Getting Started with Next.js 15",
      slug: "getting-started-nextjs-15",
      excerpt: "Learn how to build modern web applications with Next.js 15...",
      content:
        "This is a comprehensive guide to getting started with Next.js 15. In this post, we'll cover all the new features and improvements...",
      status: "PUBLISHED",
      authorId: authorUser.id,
      publishedAt: new Date("2024-01-15"),
      views: 1234,
      readTime: 5,
      seoTitle: "Getting Started with Next.js 15 - Complete Guide",
      seoDescription:
        "Learn Next.js 15 with this comprehensive guide covering all new features and improvements.",
      tags: {
        connect: [{ id: nextjsTag.id }],
      },
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "advanced-typescript-patterns" },
    update: {},
    create: {
      title: "Advanced TypeScript Patterns",
      slug: "advanced-typescript-patterns",
      excerpt:
        "Explore advanced TypeScript patterns for better code organization...",
      content:
        "TypeScript offers many advanced patterns that can help you write better, more maintainable code...",
      status: "DRAFT",
      authorId: editorUser.id,
      readTime: 8,
      tags: {
        connect: [{ id: typescriptTag.id }],
      },
    },
  });

  // Create sample podcasts
  await prisma.podcast.upsert({
    where: { id: "podcast-1" },
    update: {},
    create: {
      id: "podcast-1",
      title: "Episode 23: Web Development Trends 2024",
      description:
        "Exploring the latest trends in web development and what's coming next.",
      status: "PUBLISHED",
      authorId: editorUser.id,
      audioUrl: "/podcasts/episode-23.mp3",
      duration: "45:30",
      fileSize: "32.5 MB",
      publishedAt: new Date("2024-01-15"),
      downloads: 1234,
    },
  });

  await prisma.podcast.upsert({
    where: { id: "podcast-2" },
    update: {},
    create: {
      id: "podcast-2",
      title: "Episode 24: The Future of AI in Development",
      description: "How AI is transforming the software development landscape.",
      status: "DRAFT",
      authorId: authorUser.id,
      duration: "52:45",
      downloads: 0,
    },
  });

  // Create sample media files
  await prisma.mediaFile.upsert({
    where: { id: "media-1" },
    update: {},
    create: {
      id: "media-1",
      name: "hero-image.jpg",
      originalName: "hero-image.jpg",
      type: "IMAGE",
      url: "/images/hero-image.jpg",
      size: "2.4 MB",
      mimeType: "image/jpeg",
      alt: "Hero section background image",
      dimensions: "1920x1080",
      uploaderId: adminUser.id,
    },
  });

  // Create dashboard items from your existing data.json
  const dashboardItems = [
    {
      header: "Cover page",
      type: "Cover page",
      status: "IN_PROCESS" as const,
      target: "18",
      limit: "5",
      reviewer: "Eddie Lake",
      order: 1,
    },
    {
      header: "Table of contents",
      type: "Table of contents",
      status: "DONE" as const,
      target: "29",
      limit: "24",
      reviewer: "Eddie Lake",
      order: 2,
    },
    {
      header: "Executive summary",
      type: "Narrative",
      status: "DONE" as const,
      target: "10",
      limit: "13",
      reviewer: "Eddie Lake",
      order: 3,
    },
    {
      header: "Technical approach",
      type: "Narrative",
      status: "DONE" as const,
      target: "27",
      limit: "23",
      reviewer: "Jamik Tashpulatov",
      order: 4,
    },
    {
      header: "User Authentication System",
      type: "Technical content",
      status: "DONE" as const,
      target: "28",
      limit: "31",
      reviewer: "Eddie Lake",
      order: 5,
    },
  ];

  for (const item of dashboardItems) {
    await prisma.dashboardItem.create({
      data: item,
    });
  }

  // Create site settings
  const siteSettings = [
    { key: "site_name", value: "Admin Dashboard", type: "TEXT" as const },
    {
      key: "site_description",
      value: "A modern admin dashboard for content management",
      type: "TEXT" as const,
    },
    {
      key: "site_url",
      value: "https://admindashboard.com",
      type: "TEXT" as const,
    },
    {
      key: "contact_email",
      value: "contact@admindashboard.com",
      type: "TEXT" as const,
    },
    { key: "posts_per_page", value: "6", type: "NUMBER" as const },
    { key: "episodes_per_page", value: "12", type: "NUMBER" as const },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(
    `👤 Created users: ${adminUser.name}, ${editorUser.name}, ${authorUser.name}`
  );
  console.log(`📝 Created blog posts and podcasts`);
  console.log(`📊 Created dashboard items`);
  console.log(`⚙️ Created site settings`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
