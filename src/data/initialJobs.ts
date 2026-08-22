import { Job } from '../types';

export const INITIAL_JOBS: Omit<Job, 'id'>[] = [
  {
    title: 'Senior Full-Stack AI Engineer',
    department: 'AI & Machine Learning',
    type: 'Full-time',
    location: 'San Francisco, CA / Remote',
    workLocation: 'Remote',
    experienceLevel: 'Senior',
    salaryRange: '$165,000 - $215,000',
    featured: true,
    isOpen: true,
    createdAt: Date.now() - 86400000 * 2,
    description: 'We are seeking an experienced Full-Stack AI Engineer to architect and ship intelligent digital transformation software for global enterprise clients at Tech Movement. You will integrate modern LLMs, real-time agent pipelines, and high-performance React frontends.',
    responsibilities: [
      'Architect and develop full-stack applications with React, TypeScript, Node.js, and Python backend services',
      'Integrate frontier LLM APIs, embedding vectors, and real-time streaming architectures into client portals',
      'Optimize latency, serverless execution, and multi-tenant cloud deployments across AWS and Google Cloud',
      'Collaborate with UI/UX designers and enterprise partners to convert business requirements into sleek digital products'
    ],
    requirements: [
      '5+ years of production experience in full-stack web engineering (React, TypeScript, Node.js or Python)',
      'Demonstrated experience building AI-powered features, vector search, or autonomous agents in production',
      'Strong expertise in REST/GraphQL API design, caching layers (Redis), and distributed microservices',
      'Solid understanding of security best practices, CI/CD pipelines, and cloud native architectures'
    ],
    niceToHave: [
      'Experience with LangChain, LlamaIndex, or Google Gemini / OpenAI SDKs',
      'Open-source contributions in the AI/TypeScript ecosystem'
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'GCP'],
    benefits: [
      '100% remote flexibility with home office equipment stipend ($2,500)',
      'Comprehensive health, dental, and vision insurance with full premium coverage',
      '401(k) retirement plan with 5% immediate company match',
      'Unlimited Paid Time Off (PTO) + annual learning & conference stipend ($3,000)'
    ]
  },
  {
    title: 'Lead Cloud Infrastructure & DevOps Architect',
    department: 'Cloud & DevOps',
    type: 'Full-time',
    location: 'Austin, TX / Hybrid',
    workLocation: 'Hybrid',
    experienceLevel: 'Lead / Principal',
    salaryRange: '$180,000 - $235,000',
    featured: true,
    isOpen: true,
    createdAt: Date.now() - 86400000 * 4,
    description: 'Lead the next generation of cloud infrastructure, Kubernetes clusters, automated zero-downtime pipelines, and enterprise-grade multi-region reliability at Tech Movement.',
    responsibilities: [
      'Design, provision, and maintain secure multi-cloud Kubernetes clusters (EKS / GKE) using Terraform',
      'Establish automated CI/CD deployment pipelines with GitOps (ArgoCD / GitHub Actions)',
      'Drive zero-trust security postures, observability stacks (Prometheus, Grafana, Datadog), and disaster recovery',
      'Mentor senior DevOps engineers and advise enterprise clients on modernization roadmaps'
    ],
    requirements: [
      '7+ years in DevOps, SRE, or Cloud Architecture roles handling high-traffic production workloads',
      'Deep mastery of Kubernetes, Docker containerization, and Infrastructure as Code (Terraform / Pulumi)',
      'Expertise in Linux internals, networking protocols, TLS/mTLS, and cloud IAM security',
      'Proven track record implementing automated incident management and 99.99% SLA reliability'
    ],
    niceToHave: [
      'Certified Kubernetes Administrator (CKA) or AWS/GCP Solutions Architect Professional',
      'Experience with eBPF network monitoring tools'
    ],
    techStack: ['Kubernetes', 'Terraform', 'AWS', 'GCP', 'ArgoCD', 'Prometheus', 'Golang', 'Bash'],
    benefits: [
      'Competitive base salary + equity stock options',
      'Flexible hybrid schedule (2 days in office, 3 days remote)',
      'Top-tier medical coverage for employee and dependents',
      'Wellness stipend and quarterly team hackathons & retreats'
    ]
  },
  {
    title: 'Senior Cyber Defense & AppSec Specialist',
    department: 'Cybersecurity',
    type: 'Full-time',
    location: 'New York, NY / Remote',
    workLocation: 'Remote',
    experienceLevel: 'Senior',
    salaryRange: '$170,000 - $220,000',
    featured: false,
    isOpen: true,
    createdAt: Date.now() - 86400000 * 5,
    description: 'Ensure end-to-end security posture for Tech Movement client applications, conduct penetration testing, vulnerability assessments, and embed DevSecOps security across codebases.',
    responsibilities: [
      'Perform security architecture reviews, threat modeling, and SAST/DAST automation in build pipelines',
      'Lead red team exercises, penetration testing, and incident response readiness across client products',
      'Enforce compliance frameworks including SOC 2 Type II, ISO 27001, and HIPAA across infrastructure',
      'Conduct regular security training and secure coding workshops for engineering teams'
    ],
    requirements: [
      '5+ years dedicated experience in application security, penetration testing, or cloud cybersecurity',
      'Hands-on experience auditing web applications (OWASP Top 10) and cloud environments (AWS/GCP)',
      'Proficiency in scripting languages (Python, Go, or Bash) to automate vulnerability scanning',
      'Familiarity with container security tools (Trivy, Falco, Snyk)'
    ],
    niceToHave: [
      'OSCP, CISSP, CEH, or AWS Certified Security Specialist certifications',
      'CVE discoveries or public security research publications'
    ],
    techStack: ['Burp Suite', 'Snyk', 'Trivy', 'Falco', 'Python', 'AWS Security Hub', 'WAF'],
    benefits: [
      'Remote-first culture with global co-working pass (WeWork / Industrious)',
      'Annual $4,000 budget for security certifications and Black Hat / DEF CON attendance',
      'Generous parental leave (16 weeks fully paid)',
      'Performance-based annual cash bonus'
    ]
  },
  {
    title: 'Senior Product Designer (UI/UX & Systems)',
    department: 'Product & Design',
    type: 'Full-time',
    location: 'Remote (US / Europe)',
    workLocation: 'Remote',
    experienceLevel: 'Senior',
    salaryRange: '$140,000 - $185,000',
    featured: true,
    isOpen: true,
    createdAt: Date.now() - 86400000 * 6,
    description: 'Craft immersive, high-contrast dark mode interfaces, design systems, and intuitive workflows for next-gen digital enterprise products at Tech Movement.',
    responsibilities: [
      'Lead end-to-end product design from user research and wireframing to high-fidelity interactive prototypes in Figma',
      'Maintain and expand our unified Tech Movement design system token library and component kits',
      'Partner closely with front-end engineers to ensure pixel-perfect, accessible (WCAG AA), and fluid UI executions',
      'Conduct usability tests with real enterprise customers and iterate based on quantitative & qualitative feedback'
    ],
    requirements: [
      '4+ years designing complex SaaS, developer tooling, or digital enterprise web products',
      'Exceptional portfolio showcasing typography, layout hierarchy, dark theme mastery, and motion interaction',
      'Deep proficiency with Figma, auto-layout, design tokens, and interactive component states',
      'Strong communication skills and ability to present design rationale to executive stakeholders'
    ],
    niceToHave: [
      'Basic knowledge of React/Tailwind CSS or HTML/CSS to bridge design-to-code handoffs',
      'Experience with 3D product rendering or motion graphics (Spline, After Effects)'
    ],
    techStack: ['Figma', 'FigJam', 'Tokens Studio', 'Spline', 'Protopie', 'Tailwind UI'],
    benefits: [
      'Full workstation setup budget (Apple MacBook Pro M-series + Pro Display)',
      'Flexible working hours across global timezones',
      'Paid health, vision, and mental wellness coverage',
      'Yearly company retreat in international tech hubs'
    ]
  },
  {
    title: 'Data & Machine Learning Analytics Engineer',
    department: 'Data & Analytics',
    type: 'Full-time',
    location: 'Chicago, IL / Hybrid',
    workLocation: 'Hybrid',
    experienceLevel: 'Mid-Level',
    salaryRange: '$130,000 - $165,000',
    featured: false,
    isOpen: true,
    createdAt: Date.now() - 86400000 * 8,
    description: 'Transform raw data into real-time analytical intelligence, operational metrics, and predictive models powering digital transformation initiatives.',
    responsibilities: [
      'Design and build scalable ETL/ELT pipelines with dbt, Apache Airflow, and Snowflake / BigQuery',
      'Develop real-time data streaming architectures with Apache Kafka or Google Pub/Sub',
      'Create interactive executive BI dashboards in Tableau and custom embedded web visuals with D3/Recharts',
      'Collaborate with AI researchers to feed clean feature sets into production inference models'
    ],
    requirements: [
      '3+ years experience in data engineering or analytics engineering with production SQL mastery',
      'Proficiency with Python, dbt, and modern cloud data warehouses (Snowflake, BigQuery, or Databricks)',
      'Experience modeling dimensional data schemas (Star/Snowflake) and ensuring data quality testing',
      'Strong problem-solving and statistical analysis mindset'
    ],
    niceToHave: [
      'Experience with PySpark or DuckDB for fast in-memory data processing',
      'Prior exposure to ML feature stores (Feast, Hopsworks)'
    ],
    techStack: ['SQL', 'Python', 'dbt', 'BigQuery', 'Snowflake', 'Airflow', 'Kafka', 'Tableau'],
    benefits: [
      'Hybrid work flexibility with modern downtown office perks',
      'Comprehensive 401(k) with company match',
      'Annual gym and wellness membership subsidy',
      'Dedicated weekly innovation & self-directed research time (Friday afternoons)'
    ]
  },
  {
    title: 'Frontend Experience Engineer (React & WebGL)',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Seattle, WA / Remote',
    workLocation: 'Remote',
    experienceLevel: 'Senior',
    salaryRange: '$150,000 - $195,000',
    featured: false,
    isOpen: true,
    createdAt: Date.now() - 86400000 * 10,
    description: 'Build blazing-fast, visually stunning web interfaces with fluid micro-interactions, canvas/WebGL effects, and modular component architectures.',
    responsibilities: [
      'Develop responsive, accessible, high-performance web applications using React, TypeScript, and Tailwind CSS',
      'Implement smooth layout animations using Motion and interactive visualizations with canvas/Three.js',
      'Optimize Core Web Vitals, bundle sizes, and client-side rendering bottlenecks',
      'Author reusable component packages and write automated unit/integration tests with Vitest & Playwright'
    ],
    requirements: [
      '4+ years building sophisticated front-end applications with modern React and TypeScript',
      'Deep understanding of browser rendering pipelines, CSS architecture, and responsive design',
      'Passion for craft, micro-interactions, subtle glowing aesthetics, and typography precision',
      'Experience with state management libraries, custom hooks, and WebSocket data streams'
    ],
    niceToHave: [
      'Experience with Three.js / WebGL shaders or canvas animations',
      'Active contributions to UI libraries or design systems'
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Motion', 'Vite', 'Three.js', 'Playwright'],
    benefits: [
      '100% remote anywhere in the US / Canada',
      'Ergonomic desk and chair reimbursement ($1,500)',
      'Generous stock option incentives with high upside',
      'Comprehensive dental, vision, and health packages'
    ]
  }
];
