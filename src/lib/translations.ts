export type Language = "en" | "id";

export type ProjectTranslation = {
  name: string;
  description: string;
  metrics?: { value: string; label: string }[];
};

export type ExperienceTranslation = {
  title: string;
  company: string;
  description: string;
  achievements: string[];
};

export const translations = {
  en: {
    nav: {
      home: "Home",
      work: "Work",
      experience: "Experience",
      stack: "Stack",
      contact: "Contact",
      blog: "Blog",
      more: "More",
      backHome: "Back to home",
      switchLang: "Switch to Bahasa Indonesia",
      label: "Main navigation",
      toggleMenu: "Toggle navigation menu",
    },
    hero: {
      headline: "Making products work, from code to cloud.",
      about:
        "I build products from clean interfaces and reliable backends to cloud infrastructure that keeps everything running smoothly.",
      viewWork: "View work",
      contactMe: "Contact me",
      locationLabel: "Location",
      locationValue: "Yogyakarta, Indonesia",
      focusLabel: "Focus",
      focusValue: "Fullstack / Backend / Cloud",
      statusLabel: "Status",
      statusValue: "Available for freelance projects",
    },
    projects: {
      eyebrow: "Selected work",
      title: "Systems with a visible pulse.",
      description:
        "A compact set of backend-heavy builds, cloud topologies, and interface experiments shaped around real delivery constraints.",
      allWorkEyebrow: "All work",
      allWorkTitle: "Projects from the shelf.",
      allWorkDescription:
        "A fuller archive of backend systems, AWS topologies, deployment tooling, and interface work.",
      openImage: "Open full-size image",
      case: "Case",
      featured: "Featured",
      viewSource: "View Source",
      liveDemo: "Live Demo",
      seeAllProjects: "See all projects",
    },
    experience: {
      eyebrow: "Experience",
      title: "Practice, shipped in public.",
      description:
        "A practical path through teams, client work, and production-ready web systems.",
    },
    skills: {
      title: "Tools I Use",
      description:
        "The stack I reach for when designing, building, and shipping digital products.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Have a system that needs shipping?",
      description:
        "Send the problem, the timeline, and the current state. I will reply with the cleanest next step.",
      directChannel: "Direct channel",
      base: "Base",
    },
    footer: {
      copyright: "All rights reserved.",
    },
    blog: {
      eyebrow: "Blog",
      title: "Behind the architecture.",
      description:
        "A closer look at the projects: how the systems work, why they were designed that way, and the trade-offs behind each build.",
      backHome: "Back to home",
      architectureNotes: "Architecture notes",
      readArticle: "Read article",
      emptyTitle: "Architecture notes are on the way.",
      emptyDescription:
        "The project collection is a good place to start. Detailed write-ups will appear here as they are published.",
      exploreProjects: "Explore the projects",
      allArticles: "All articles",
      aboutProject: "About this project",
      relatedProject: "Related project",
      technologyStack: "Technology stack",
      openDiagram: "Open full-size architecture diagram",
      viewProject: "View project",
      caption: "Select the diagram to view it at full size.",
      notFoundTitle: "Article not found.",
      notFoundDescription:
        "This article may have been removed or is not published yet. You can find the available architecture notes on the blog.",
      backToBlog: "Back to blog",
    },
  },
  id: {
    nav: {
      home: "Beranda",
      work: "Proyek",
      experience: "Pengalaman",
      stack: "Stack",
      contact: "Kontak",
      blog: "Blog",
      more: "Lainnya",
      backHome: "Kembali ke beranda",
      switchLang: "Switch to English",
      label: "Navigasi utama",
      toggleMenu: "Buka atau tutup menu",
    },
    hero: {
      headline: "Membangun aplikasi, dari kode sampai cloud.",
      about:
        "Saya membangun aplikasi web dengan UI yang nyaman dipakai dan backend yang andal. Saya juga menyiapkan infrastruktur cloud untuk menjalankannya.",
      viewWork: "Lihat proyek",
      contactMe: "Hubungi saya",
      locationLabel: "Lokasi",
      locationValue: "Yogyakarta, Indonesia",
      focusLabel: "Fokus",
      focusValue: "Fullstack / Backend / Cloud",
      statusLabel: "Status",
      statusValue: "Terbuka untuk proyek freelance",
    },
    projects: {
      eyebrow: "Proyek pilihan",
      title: "Beberapa proyek yang saya kerjakan.",
      description:
        "Dari API dan arsitektur cloud sampai eksperimen UI. Di sini kamu bisa melihat apa yang saya bangun dan teknologi yang saya pakai.",
      allWorkEyebrow: "Semua proyek",
      allWorkTitle: "Kumpulan proyek saya.",
      allWorkDescription:
        "Lihat lebih banyak proyek yang saya kerjakan, mulai dari backend dan arsitektur AWS sampai tools deployment dan UI.",
      openImage: "Lihat gambar ukuran penuh",
      case: "Proyek",
      featured: "Unggulan",
      viewSource: "Lihat source code",
      liveDemo: "Live demo",
      seeAllProjects: "Lihat semua proyek",
    },
    experience: {
      eyebrow: "Pengalaman",
      title: "Pengalaman di balik proyek-proyek ini.",
      description:
        "Saya belajar lewat kerja tim dan proyek klien. Berikut pengalaman saya mengembangkan aplikasi web hingga siap dipakai.",
    },
    skills: {
      title: "Tools yang saya gunakan",
      description:
        "Tools yang menemani pekerjaan saya sehari-hari, dari menulis kode sampai menjalankan aplikasi.",
    },
    contact: {
      eyebrow: "Kontak",
      title: "Ada proyek yang ingin kamu bangun?",
      description:
        "Ceritakan idemu, kebutuhan proyek, dan target waktunya lewat email. Saya akan bantu menentukan langkah awalnya.",
      directChannel: "Email",
      base: "Lokasi",
    },
    footer: {
      copyright: "Hak cipta dilindungi.",
    },
    blog: {
      eyebrow: "Blog",
      title: "Cerita di balik sistem yang saya bangun.",
      description:
        "Saya membahas cara kerja proyek-proyek ini dan alasan memilih arsitekturnya. Termasuk trade-off yang perlu dipertimbangkan saat membangunnya.",
      backHome: "Kembali ke beranda",
      architectureNotes: "Catatan arsitektur",
      readArticle: "Baca artikel",
      emptyTitle: "Artikel sedang disiapkan.",
      emptyDescription:
        "Sambil menunggu, kamu bisa melihat proyek yang sudah saya kerjakan. Cerita dan pembahasan teknisnya akan saya bagikan di sini.",
      exploreProjects: "Lihat proyek",
      allArticles: "Semua artikel",
      aboutProject: "Tentang proyek ini",
      relatedProject: "Proyek terkait",
      technologyStack: "Stack teknologi",
      openDiagram: "Lihat diagram arsitektur ukuran penuh",
      viewProject: "Lihat proyek",
      caption: "Klik diagram untuk melihat versi ukuran penuh.",
      notFoundTitle: "Artikel tidak ditemukan.",
      notFoundDescription:
        "Artikel ini mungkin sudah dihapus atau belum terbit. Kamu bisa kembali ke blog untuk membaca artikel lainnya.",
      backToBlog: "Kembali ke blog",
    },
  },
} as const;

export const projectTranslations: Record<
  string,
  { en: ProjectTranslation; id: ProjectTranslation }
> = {
  "sistem-kesehatan": {
    en: {
      name: "Polindes (Village Health System)",
      description:
        "A village health and maternity clinic management platform (Polindes) designed to streamline patient medical records, maternal & child healthcare monitoring, service queue scheduling, and operational reporting.",
      metrics: [
        { value: "5", label: "Core Modules" },
        { value: "RBAC", label: "Staff Access" },
        { value: "Queue", label: "Async Jobs" },
      ],
    },
    id: {
      name: "Polindes (Sistem Kesehatan Desa)",
      description:
        "Aplikasi untuk membantu petugas Polindes mengelola rekam medis dan memantau kesehatan ibu serta anak. Antrean layanan dan laporan operasional juga bisa dikelola di sini.",
      metrics: [
        { value: "5", label: "Modul Utama" },
        { value: "RBAC", label: "Akses Petugas" },
        { value: "Queue", label: "Background jobs" },
      ],
    },
  },
  "opsflow-api": {
    en: {
      name: "Opsflow API",
      description:
        "A production-style backend for managing tasks, approvals, and audit trails across internal teams.",
      metrics: [
        { value: "42ms", label: "Average API Response" },
        { value: "18", label: "Service Endpoints" },
        { value: "99.9%", label: "Local Test Uptime" },
      ],
    },
    id: {
      name: "Opsflow API",
      description:
        "Backend untuk mengatur tugas dan alur persetujuan dalam tim. Aktivitasnya tercatat dalam audit trail agar mudah ditelusuri.",
      metrics: [
        { value: "42ms", label: "Respons API rata-rata" },
        { value: "18", label: "Endpoint layanan" },
        { value: "99.9%", label: "Uptime saat uji lokal" },
      ],
    },
  },
  "deploy-watcher": {
    en: {
      name: "Deploy Watcher",
      description:
        "A compact monitoring tool that tracks deploy status, build logs, and failed checks in one place.",
      metrics: [
        { value: "6 providers", label: "Integrations" },
        { value: "<1s", label: "Webhook Processing" },
      ],
    },
    id: {
      name: "Deploy Watcher",
      description:
        "Tool untuk memantau proses deployment dalam satu tempat. Kamu bisa melihat status deploy, log build, dan checks yang gagal.",
      metrics: [
        { value: "6 penyedia", label: "Integrasi" },
        { value: "<1s", label: "Proses webhook" },
      ],
    },
  },
  "aws-3-tier-web-architecture": {
    en: {
      name: "AWS 3-Tier Web Architecture",
      description:
        "Architecture diagram for a highly available AWS web application: CloudFront and an ALB route traffic to EC2 web servers in two public subnets, backed by Multi-AZ RDS in private subnets.",
      metrics: [
        { value: "3-tier", label: "Architecture Pattern" },
        { value: "2 AZ", label: "Availability Layout" },
        { value: "IaC", label: "Terraform Definition" },
      ],
    },
    id: {
      name: "Arsitektur Web 3-Tier AWS",
      description:
        "Desain aplikasi web di AWS dengan CloudFront dan ALB yang meneruskan request ke EC2 di dua subnet publik. Data disimpan di RDS Multi-AZ pada subnet privat.",
      metrics: [
        { value: "3-tier", label: "Pola Arsitektur" },
        { value: "2 AZ", label: "Availability Zones" },
        { value: "IaC", label: "Konfigurasi Terraform" },
      ],
    },
  },
  "aws-serverless-api-architecture": {
    en: {
      name: "AWS Serverless API Architecture",
      description:
        "A production-oriented serverless platform on AWS, built with Infrastructure as Code, automated CI/CD, observability, security, and cost monitoring.",
      metrics: [
        { value: "Serverless", label: "Compute Model" },
        { value: "Event-driven", label: "Integration Pattern" },
        { value: "IaC", label: "Deployment Notes" },
      ],
    },
    id: {
      name: "Arsitektur API Serverless AWS",
      description:
        "Desain backend serverless di AWS dengan Infrastructure as Code dan CI/CD otomatis. Rancangannya juga mencakup monitoring, keamanan, dan pemantauan biaya.",
      metrics: [
        { value: "Serverless", label: "Model komputasi" },
        { value: "Event-driven", label: "Pola integrasi" },
        { value: "IaC", label: "Catatan deployment" },
      ],
    },
  },
};

export const experienceTranslations: Record<
  string,
  { en: ExperienceTranslation; id: ExperienceTranslation }
> = {
  "PT Razen Teknologi": {
    en: {
      title: "Fullstack Developer Intern",
      company: "PT Razen Teknologi",
      description:
        "Worked on web application features, API integration, and responsive interface implementation.",
      achievements: [
        "Implemented reusable UI sections connected to backend data.",
        "Improved handoff quality with clearer component structure and documentation.",
      ],
    },
    id: {
      title: "Fullstack Developer Intern",
      company: "PT Razen Teknologi",
      description:
        "Mengembangkan fitur aplikasi web, menghubungkan API, dan membuat UI yang nyaman dipakai di berbagai ukuran layar.",
      achievements: [
        "Membuat komponen UI yang bisa dipakai ulang dan terhubung ke data backend.",
        "Merapikan komponen dan dokumentasi supaya tim lebih mudah melanjutkan pengembangannya.",
      ],
    },
  },
  Independent: {
    en: {
      title: "Freelance Web Developer",
      company: "Independent",
      description:
        "Built custom web applications, APIs, and client-focused landing pages.",
      achievements: [
        "Delivered responsive web interfaces with modern frameworks.",
        "Integrated authentication, databases, and third-party APIs.",
      ],
    },
    id: {
      title: "Freelance Web Developer",
      company: "Independen",
      description:
        "Mengerjakan aplikasi web, API, dan landing page sesuai kebutuhan masing-masing klien.",
      achievements: [
        "Membuat UI web responsif dengan framework modern.",
        "Menghubungkan aplikasi dengan autentikasi, database, dan API pihak ketiga.",
      ],
    },
  },
};

experienceTranslations["Productive.id"] = {
  en: {
    title: "Freelance Web Developer",
    company: "Productive.id",
    description: "Designed and developed CMS-ready portfolio and business websites for small teams.",
    achievements: [
      "Delivered admin-editable pages using modern React and Payload CMS.",
      "Set up clean deployment flows for preview and production environments.",
    ],
  },
  id: {
    title: "Freelance Web Developer",
    company: "Productive.id",
    description: "Membangun website portofolio dan bisnis untuk tim kecil, dengan CMS agar kontennya mudah diperbarui.",
    achievements: [
      "Membuat halaman dengan React dan Payload CMS agar tim bisa memperbarui konten lewat admin.",
      "Menyiapkan alur deployment untuk preview dan production.",
    ],
  },
};
