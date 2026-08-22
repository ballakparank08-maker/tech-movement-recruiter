import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'id' | 'zh';

export interface Translations {
  nav: {
    openRoles: string;
    trackApp: string;
    recruiterPortal: string;
    backToCareers: string;
    signOut: string;
  };
  hero: {
    badge: string;
    titleMain: string;
    titleHighlight: string;
    subtitle: string;
    searchPlaceholder: string;
    showingRoles: string;
    of: string;
    roles: string;
    newestFirst: string;
    highestSalary: string;
    clearFilters: string;
    allRoles: string;
    engineering: string;
    productDesign: string;
    aiData: string;
    cybersecurity: string;
    cloudOps: string;
  };
  culture: {
    badge: string;
    title: string;
    subtitle: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    evaluatedStat: string;
    browseRoles: string;
  };
  authGate: {
    badge: string;
    title: string;
    subtitle: string;
    passcodeLabel: string;
    passcodePlaceholder: string;
    authorizeBtn: string;
    verifying: string;
    orContinueWith: string;
    googleSSO: string;
    returnToCareers: string;
    securityBadge: string;
  };
  tracker: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    searchBtn: string;
    noAppsFound: string;
    appliedFor: string;
    submittedOn: string;
  };
  modal: {
    applyNow: string;
    jobDetails: string;
    responsibilities: string;
    requirements: string;
    benefits: string;
    techStack: string;
    submitApp: string;
    candidateName: string;
    email: string;
    phone: string;
    currentRole: string;
    company: string;
    coverNote: string;
    videoRecorder: string;
    close: string;
  };
  footer: {
    about: string;
    quickLinks: string;
    privacy: string;
    terms: string;
    rights: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      openRoles: 'Open Roles',
      trackApp: 'Track Application',
      recruiterPortal: 'Recruiter',
      backToCareers: 'Back to Careers',
      signOut: 'Lock Recruiter Session'
    },
    hero: {
      badge: 'Elite Digital Roles & Industry-Leading Rewards',
      titleMain: 'Build Your Career at the Forefront of',
      titleHighlight: 'Digital Transformation',
      subtitle: 'Tech Movement builds mission-critical enterprise systems, resilient cloud architectures, and scalable digital products. Explore our open positions and join world-class talent across all disciplines.',
      searchPlaceholder: 'Search by job title, skill (e.g. React, Kubernetes, AI), or location...',
      showingRoles: 'Showing',
      of: 'of',
      roles: 'roles',
      newestFirst: 'Newest First',
      highestSalary: 'Highest Salary',
      clearFilters: 'Clear Filters',
      allRoles: 'All Roles',
      engineering: 'Engineering',
      productDesign: 'Product & Design',
      aiData: 'AI & Data Science',
      cybersecurity: 'Cybersecurity',
      cloudOps: 'Cloud & Infrastructure'
    },
    culture: {
      badge: 'Why Build With Tech Movement',
      title: 'Engineering at the Forefront of Enterprise Scale',
      subtitle: 'We believe great software is born from autonomous teams, rigorous engineering standards, and high-impact digital transformation. Here is what defines life at Tech Movement:',
      pillar1Title: 'Frontier AI & Cloud Architecture',
      pillar1Desc: 'Ship production LLM pipelines, autonomous agents, and multi-region Kubernetes clusters handling petabytes of transactional traffic.',
      pillar2Title: 'Global Remote-First Mindset',
      pillar2Desc: 'Work from anywhere with asynchronous autonomy, zero micromanagement, home office allowances, and annual team summits worldwide.',
      pillar3Title: 'Uncapped Growth & Equity',
      pillar3Desc: 'Competitive top-tier compensation bands, aggressive equity grants, 401(k) matching, and dedicated weekly innovation research time.',
      evaluatedStat: 'Over 42+ builders evaluated this month',
      browseRoles: 'Browse Open Positions'
    },
    authGate: {
      badge: 'Restricted Recruiter Access',
      title: 'Recruiter Portal',
      subtitle: 'Confidential candidate evaluation pipeline & executive portal.',
      passcodeLabel: 'Master Security Key / Passcode',
      passcodePlaceholder: 'Enter Security Key or Passcode',
      authorizeBtn: 'Authorize Access',
      verifying: 'Verifying Authorization...',
      orContinueWith: 'Or Continue With',
      googleSSO: 'Sign in with Google Workspace',
      returnToCareers: 'Return to Public Careers',
      securityBadge: 'TLS 256-Bit & Firestore Security Guard'
    },
    tracker: {
      title: 'Track Candidate Application Status',
      subtitle: 'Enter your applicant email address to view live evaluation progress and recruiter status updates.',
      inputPlaceholder: 'Enter your candidate email address...',
      searchBtn: 'Search Application',
      noAppsFound: 'No application record found for this email.',
      appliedFor: 'Applied for',
      submittedOn: 'Submitted on'
    },
    modal: {
      applyNow: 'Apply for Position',
      jobDetails: 'Role Summary',
      responsibilities: 'Key Responsibilities',
      requirements: 'Requirements & Qualifications',
      benefits: 'Perks & Benefits',
      techStack: 'Tech Stack & Tools',
      submitApp: 'Submit Candidate Application',
      candidateName: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      currentRole: 'Current Role / Title',
      company: 'Current Company / School',
      coverNote: 'Cover Note / Key Highlight',
      videoRecorder: 'Optional Video Introduction',
      close: 'Close Window'
    },
    footer: {
      about: 'Join Tech Movement in building high-impact enterprise AI platforms and cloud architectures.',
      quickLinks: 'Quick Links',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      rights: 'All rights reserved.'
    }
  },
  id: {
    nav: {
      openRoles: 'Lowongan Kerja',
      trackApp: 'Lacak Lamaran',
      recruiterPortal: 'Portal Rekrutmen',
      backToCareers: 'Kembali ke Karir',
      signOut: 'Kunci Sesi Rekrutmen'
    },
    hero: {
      badge: 'Peran Digital Elit & Penghargaan Terdepan di Industri',
      titleMain: 'Bangun Karir Anda di Garis Depan',
      titleHighlight: 'Transformasi Digital',
      subtitle: 'Tech Movement membangun sistem enterprise misi-kritis, arsitektur cloud tangguh, dan produk digital berskala besar. Jelajahi posisi terbuka kami dan bergabunglah dengan talenta kelas dunia di semua disiplin ilmu.',
      searchPlaceholder: 'Cari berdasarkan posisi, keahlian (misal: React, Kubernetes, AI), atau lokasi...',
      showingRoles: 'Menampilkan',
      of: 'dari',
      roles: 'posisi',
      newestFirst: 'Terbaru',
      highestSalary: 'Gaji Tertinggi',
      clearFilters: 'Hapus Filter',
      allRoles: 'Semua Posisi',
      engineering: 'Rekayasa Perangkat Lunak',
      productDesign: 'Produk & Desain',
      aiData: 'AI & Sains Data',
      cybersecurity: 'Keamanan Siber',
      cloudOps: 'Cloud & Infrastruktur'
    },
    culture: {
      badge: 'Mengapa Berkarya di Tech Movement',
      title: 'Rekayasa di Garis Depan Skala Enterprise',
      subtitle: 'Kami percaya perangkat lunak hebat lahir dari tim otonom, standar rekayasa ketat, dan transformasi digital berdampak tinggi. Inilah budaya kerja kami:',
      pillar1Title: 'AI Terdepan & Arsitektur Cloud',
      pillar1Desc: 'Meluncurkan pipa LLM produksi, agen otonom, dan kluster Kubernetes multi-wilayah yang menangani lalu lintas transaksi berskala petabita.',
      pillar2Title: 'Budaya Kerja Remote Global',
      pillar2Desc: 'Bekerja dari mana saja secara asinkron tanpa mikromanajemen, fasilitas ruang kerja rumah, dan summit tahunan tim global.',
      pillar3Title: 'Pertumbuhan & Ekuitas Tanpa Batas',
      pillar3Desc: 'Paket kompensasi tingkat atas yang kompetitif, hibah ekuitas agresif, serta alokasi waktu riset inovasi mingguan.',
      evaluatedStat: 'Lebih dari 42+ talenta dievaluasi bulan ini',
      browseRoles: 'Jelajahi Posisi Terbuka'
    },
    authGate: {
      badge: 'Akses Terbatas Perekrut',
      title: 'Portal Rekrutmen',
      subtitle: 'Pipa evaluasi kandidat rahasia & portal eksekutif.',
      passcodeLabel: 'Kunci Keamanan / Kode Akses Utama',
      passcodePlaceholder: 'Masukkan Kunci Keamanan atau Kode Akses',
      authorizeBtn: 'Otorisasi Akses',
      verifying: 'Memverifikasi Otorisasi...',
      orContinueWith: 'Atau Lanjutkan Dengan',
      googleSSO: 'Masuk dengan Google Workspace',
      returnToCareers: 'Kembali ke Karir Publik',
      securityBadge: 'Enkripsi TLS 256-Bit & Keamanan Firestore'
    },
    tracker: {
      title: 'Lacak Status Lamaran Kandidat',
      subtitle: 'Masukkan alamat email Anda untuk melihat perkembangan evaluasi dan pembaruan dari tim rekrutmen.',
      inputPlaceholder: 'Masukkan alamat email Anda...',
      searchBtn: 'Cari Lamaran',
      noAppsFound: 'Tidak ada catatan lamaran yang ditemukan untuk email ini.',
      appliedFor: 'Melamar untuk',
      submittedOn: 'Dikirim pada'
    },
    modal: {
      applyNow: 'Lamar Posisi Ini',
      jobDetails: 'Ringkasan Peran',
      responsibilities: 'Tanggung Jawab Utama',
      requirements: 'Persyaratan & Kualifikasi',
      benefits: 'Fasilitas & Keuntungan',
      techStack: 'Teknologi & Perangkat',
      submitApp: 'Kirim Lamaran Kandidat',
      candidateName: 'Nama Lengkap',
      email: 'Alamat Email',
      phone: 'Nomor Telepon',
      currentRole: 'Posisi / Jabatan Saat Ini',
      company: 'Perusahaan / Perguruan Tinggi',
      coverNote: 'Catatan Sampul / Keunggulan Utama',
      videoRecorder: 'Video Perkenalan Opsional',
      close: 'Tutup Jendela'
    },
    footer: {
      about: 'Bergabunglah dengan Tech Movement dalam membangun platform AI enterprise dan arsitektur cloud berdampak tinggi.',
      quickLinks: 'Tautan Cepat',
      privacy: 'Kebijakan Privasi',
      terms: 'Syarat Layanan',
      rights: 'Hak cipta dilindungi undang-undang.'
    }
  },
  zh: {
    nav: {
      openRoles: '招聘职位',
      trackApp: '申请状态追踪',
      recruiterPortal: '招聘人员门户',
      backToCareers: '返回招聘首页',
      signOut: '锁定招聘人员会话'
    },
    hero: {
      badge: '精英数字职位与行业领先回报',
      titleMain: '站在最前沿打造您的职业生涯：',
      titleHighlight: '数字化转型',
      subtitle: 'Tech Movement 专注于构建任务关键型企业系统、弹性云架构与可扩展数字产品。探索我们的开放职位，加入涵盖各个领域的世界级顶尖人才团队。',
      searchPlaceholder: '按职位名称、技能（如 React、Kubernetes、AI）或工作地点搜索...',
      showingRoles: '显示',
      of: '共',
      roles: '个职位',
      newestFirst: '最新发布',
      highestSalary: '最高薪资',
      clearFilters: '清除筛选',
      allRoles: '所有职位',
      engineering: '软件工程',
      productDesign: '产品与设计',
      aiData: '人工智能与数据科学',
      cybersecurity: '网络安全',
      cloudOps: '云架构与运维'
    },
    culture: {
      badge: '为何加入 Tech Movement',
      title: '前沿工程与企业级规模应用',
      subtitle: '我们坚信优秀的代码源于自主团队、严苛的工程标准与高影响力的数字化转型。以下是定义我们的核心文化：',
      pillar1Title: '前沿 AI 与云架构',
      pillar1Desc: '部署生产级大语言模型（LLM）管道、自主 Agent，以及处理 PB 级交易流量的多区域 Kubernetes 集群。',
      pillar2Title: '全球远程优先理念',
      pillar2Desc: '随时随地自由工作，具备异步自主性、零微观管理、家庭办公室津贴以及年度全球团队峰会。',
      pillar3Title: '无上限成长与股权激励',
      pillar3Desc: '极具竞争力的顶尖薪酬、丰厚的股权期权、401(k) 匹配，以及专用的每周创新研究时间。',
      evaluatedStat: '本月已评估超过 42+ 位顶尖人才',
      browseRoles: '浏览所有开放职位'
    },
    authGate: {
      badge: '受限招聘人员访问',
      title: '招聘人员门户',
      subtitle: '保密候选人评估管道与高管门户。',
      passcodeLabel: '主安全密钥 / 访问口令',
      passcodePlaceholder: '输入安全密钥或通行口令',
      authorizeBtn: '授权访问',
      verifying: '正在验证授权...',
      orContinueWith: '或通过以下方式继续',
      googleSSO: '使用 Google Workspace 登录',
      returnToCareers: '返回公共招聘页面',
      securityBadge: 'TLS 256 位加密与 Firestore 安全防护'
    },
    tracker: {
      title: '查询求职申请状态',
      subtitle: '输入您的求职邮箱地址，随时查看评估进度与招聘团队更新。',
      inputPlaceholder: '输入您的求职邮箱地址...',
      searchBtn: '查询申请进度',
      noAppsFound: '未找到该邮箱的求职申请记录。',
      appliedFor: '申请职位：',
      submittedOn: '提交时间：'
    },
    modal: {
      applyNow: '申请此职位',
      jobDetails: '职位概要',
      responsibilities: '核心职责',
      requirements: '任职要求与资格',
      benefits: '福利待遇',
      techStack: '技术栈与工具',
      submitApp: '提交求职申请',
      candidateName: '姓名',
      email: '电子邮箱',
      phone: '联系电话',
      currentRole: '当前职位 / 称谓',
      company: '当前公司 / 院校',
      coverNote: '求职信 / 个人亮点',
      videoRecorder: '可选视频自我介绍',
      close: '关闭窗口'
    },
    footer: {
      about: '加入 Tech Movement，共同构建高影响力的企业级 AI 平台与云架构。',
      quickLinks: '快速链接',
      privacy: '隐私政策',
      terms: '服务条款',
      rights: '保留所有权利。'
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('tm_app_language');
      if (saved === 'en' || saved === 'id' || saved === 'zh') {
        return saved;
      }
    } catch (e) {
      console.warn('Language parse error:', e);
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('tm_app_language', lang);
    } catch (e) {
      console.warn('Language save error:', e);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
