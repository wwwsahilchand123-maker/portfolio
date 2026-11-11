/* =====================================================================
   js/data.js: CENTRAL CONTENT FILE
   ---------------------------------------------------------------------
   Edit anything in this file to update the website. No HTML or CSS
   changes are needed for content updates.

   Rules:
   - Keep the quotes, commas, and brackets intact.
   - Values containing "your-", "example.com", or "[Your ...]" are treated
     as placeholders. Links with placeholder URLs are hidden automatically,
     and the browser console lists any remaining placeholders.
   - Leave a URL as "" to hide that item everywhere.
   ===================================================================== */

const portfolioData = {

  /* ---------- 1. IDENTITY ---------- */
  name: "Sahil Chand Rajwar",
  fullName: "Sahil Chand Rajwar",
  initials: "SCR",
  title: "Cybersecurity Student & Vibe Coder",
  status: "BUILDING SECURITY & AI SYSTEMS",

  /* Add your profile photo later at this path. */
  profileImage: "assets/images/profile.jpg",

  /* ---------- 2. CONTACT & SOCIAL LINKS ---------- */
  email: "www.sahilchand123@gmail.com",
  github: "https://github.com/wwwsahilchand123-maker",
  linkedin: "https://www.linkedin.com/in/sahil-chand-rajwar-68b575426/",
  tryhackme: "https://tryhackme.com/p/sahilchand05",
  instagram: "",

  /* ---------- 3. HERO ---------- */
  hero: {
    greeting: "Hi, I'm Sahil Chand Rajwar.",
    /* The heading is split into words. Words listed in `highlight` are red. */
    heading: "SECURING THE DIGITAL WORLD",
    highlight: ["SECURING", "DIGITAL"],
    /* Typed animation cycles through these lines. */
    roles: ["Cybersecurity Student", "Vibe Coder", "AI Security Builder"],
    description:
      "I’m a B.Tech Cyber Security student and vibe coder who enjoys building practical security and AI tools. " +
      "I’m learning network security, ethical hacking, and Python by turning ideas into projects " +
      "that help detect, understand, and respond to real-world security problems.",
    primaryCtaLabel: "Explore My Work",
    secondaryCtaLabel: "Let's Connect",
    /* Decorative floating cards around the hero illustration. */
    floatCards: [
      { label: "Focus", value: "Network Security", icon: "fa-solid fa-network-wired" },
      { label: "Practice", value: "Penetration Testing", icon: "fa-solid fa-user-secret" },
      { label: "Mindset", value: "Defend • Detect • Respond", icon: "fa-solid fa-shield-halved" }
    ]
  },

  /* ---------- 4. ABOUT ---------- */
  about: {
    lead: "I build practical cybersecurity and AI projects while growing my skills in networking, ethical hacking, and Python.",
    profileImageAlt: "Profile photo of Sahil Chand Rajwar",
    bio: [
      "I’m Sahil Chand Rajwar, a B.Tech Cyber Security student and vibe coder interested in how security, automation, and AI can work together.",
      "I learn by building: from network intrusion detection and security workflows to AI-powered tools. My goal is to make useful systems that are clear, practical, and secure."
    ],
    education: [
      { degree: "Diploma in Computer Science & Engineering (CSE)", institution: "", period: "Completed" },
      { degree: "B.Tech in Cyber Security", institution: "", period: "Currently studying" }
    ],
    interests: [
      "Networking and network security",
      "Ethical hacking",
      "Detection engineering and SOC workflows",
      "Threat intelligence and security automation",
      "AI agents and retrieval-augmented generation"
    ],
    goals: [
      "Build practical cybersecurity and AI systems.",
      "Keep improving through hands-on labs and real projects.",
      "Grow into a security engineer focused on detection, response, and automation."
    ]
  },

  /* ---------- 5. STATISTICS ----------
     auto: "projects" | "technologies" | "certifications" counts the data below.
     value: a number you set manually (used when there is no auto key). */
  stats: [
    { label: "Projects Completed", auto: "projects" },
    { label: "Technologies Learned", auto: "technologies" },
    { label: "Certifications", auto: "certifications" },
    { label: "CTF Challenges", value: 0, suffix: "+" }        // update manually
  ],

  /* ---------- 6. SKILLS ----------
     Skills listed without levels are not shown with invented proficiency scores. */
  skills: [
    {
      category: "Network Security",
      icon: "fa-solid fa-network-wired",
      items: ["Networking", "TCP/IP", "DNS", "Nmap", "Wireshark"]
    },
    {
      category: "Cybersecurity",
      icon: "fa-solid fa-shield-halved",
      items: ["Ethical Hacking", "Detection Engineering", "SOC / SOAR", "Threat Intelligence", "MITRE ATT&CK"]
    },
    {
      category: "Programming & AI",
      icon: "fa-solid fa-code",
      items: ["Python", "FastAPI", "AI Agents", "RAG", "React", "TypeScript"]
    },
    {
      category: "Systems & Tools",
      icon: "fa-solid fa-terminal",
      items: ["Linux", "Docker", "Scapy", "PostgreSQL"]
    }
  ],

  /* ---------- 7. PROJECTS ---------- */
  projects: [
    {
      name: "Advanced Network IDS",
      category: "Network Security",
      description: "Network monitoring and intrusion detection with packet and flow analysis, detection logic, event correlation, risk scoring, and SOC-style visualization.",
      thumbnail: "assets/projects/project-montage.svg?v=project-art-2",
      spriteIndex: 0,
      tech: ['Python', 'FastAPI', 'Scapy', 'React'],
      github: "https://github.com/wwwsahilchand123-maker/Advanced-Network-IDS",
      liveDemo: ""
    },
    {
      name: "SentinelFlow SOAR",
      category: "Security Automation",
      description: "Security orchestration concept for incident workflows, threat intelligence, approvals, automated playbooks, and audit trails.",
      thumbnail: "assets/projects/project-montage.svg?v=project-art-2",
      spriteIndex: 1,
      tech: ['FastAPI', 'React', 'PostgreSQL', 'Docker'],
      github: "https://github.com/wwwsahilchand123-maker/SentinelFlow-SOAR",
      liveDemo: ""
    },
    {
      name: "NEXA AI",
      category: "AI & Automation",
      description: "Windows-focused AI-agent foundation with memory, file intelligence, browser automation, and permission-aware tools.",
      thumbnail: "assets/projects/project-montage.svg?v=project-art-2",
      spriteIndex: 2,
      tech: ['Python', 'FastAPI', 'Electron', 'React'],
      github: "https://github.com/wwwsahilchand123-maker/Nexa-Ai-like-jarvis",
      liveDemo: ""
    },
    {
      name: "SecureLearn Cyber Lab",
      category: "Security Training",
      description: "Cybersecurity learning platform combining phishing analysis, ML classification, awareness simulations, and security quizzes.",
      thumbnail: "assets/projects/project-montage.svg?v=project-art-2",
      spriteIndex: 3,
      tech: ['Python', 'Flask', 'Machine Learning', 'SQLite'],
      github: "https://github.com/wwwsahilchand123-maker/SecureLearn-Cyber-Lab",
      liveDemo: ""
    },
    {
      name: "PackIntel-AI",
      category: "AI & Research",
      description: "AI-assisted recommendation system for food-packaging material selection using retrieval and explainable scoring.",
      thumbnail: "assets/projects/project-montage.svg?v=project-art-2",
      spriteIndex: 4,
      tech: ['Python', 'FastAPI', 'RAG', 'AI'],
      github: "https://github.com/wwwsahilchand123-maker/PackIntel-AI",
      liveDemo: ""
    },
    {
      name: "AES Encryption Project",
      category: "Cryptography",
      description: "Desktop cryptography learning project exploring AES-based file protection workflows.",
      thumbnail: "assets/projects/project-montage.svg?v=project-art-2",
      spriteIndex: 5,
      tech: ['Python', 'AES', 'Tkinter', 'PyCryptodome'],
      github: "https://github.com/wwwsahilchand123-maker/AES-Encryption-Project",
      liveDemo: ""
    },
    {
      name: "WeatherNova",
      category: "Web Development",
      description: "Animated, responsive weather dashboard with live conditions, forecasts, air quality, maps, and smart insights.",
      thumbnail: "assets/projects/project-montage.svg?v=project-art-2",
      spriteIndex: 6,
      tech: ['HTML', 'CSS', 'JavaScript', 'Open-Meteo'],
      github: "https://github.com/wwwsahilchand123-maker/weather-report-project-",
      liveDemo: ""
    }
  ],

  /* ---------- 8. CERTIFICATIONS & ACHIEVEMENTS ----------
     Add ONLY real entries. Each entry needs a category from the list below.
     Optional fields: image (path to certificate), verifyUrl, description.

     Example (uncomment and edit):
     {
       title: "Pre Security",
       issuer: "TryHackMe",
       category: "TryHackMe",
       date: "2025-01",
       image: "assets/certificates/pre-security.jpg",
       verifyUrl: "https://tryhackme.com/...",
       description: "Covered networking, Linux, and web fundamentals."
     },
  */
  certificationCategories: [
    "TryHackMe",
    "Training",
    "CTF",
    "Certification",
    "Workshop & Events"
  ],
  certifications: [
    {
      title: "Programming with Python",
      category: "Training",
      issuer: "Internshala Trainings",
      date: "2023-08-02",
      certificateNumber: "1uqclpj4aak",
      image: "assets/certificates/programming-with-python.png",
      verifyUrl: "https://trainings.internshala.com/verify_certificate",
      description: "6-week online training covering Python fundamentals, variables, object-oriented programming, SQLite, PyQt GUI development, and a final project. Certificate notes top-performer status."
    },
    {
      title: "Ethical Hacking with AI",
      category: "Training",
      issuer: "Internshala Trainings · IITM Pravartak",
      date: "2025-08-26",
      certificateNumber: "38asi6tofay",
      image: "assets/certificates/ethical-hacking-with-ai.png",
      verifyUrl: "https://trainings.internshala.com/verify_certificate",
      description: "8-week online training covering information security, networking, web development, OWASP Top 10 VAPT, VAPT automation, and vulnerability reporting. Certificate notes top-performer status."
    }
  ],

  /* ---------- 9. EXPERIENCE / LEARNING JOURNEY ---------- */
  experience: [
    {
      type: "education",
      date: "Completed",
      title: "Diploma in Computer Science & Engineering (CSE)",
      org: "",
      description: "Completed a diploma in computer science and engineering."
    },
    {
      type: "education",
      date: "Currently studying",
      title: "B.Tech in Cyber Security",
      org: "",
      description: "Building a foundation in cybersecurity and practical security engineering."
    },
    {
      type: "project",
      date: "Ongoing",
      title: "Cybersecurity and AI projects",
      org: "GitHub",
      description: "Building projects across intrusion detection, security orchestration, AI tools, and cryptography."
    },
    {
      type: "learning",
      date: "Ongoing",
      title: "TryHackMe learning",
      org: "TryHackMe",
      description: "Follow my public profile for the latest rooms, badges, and learning progress."
    }
  ],

  /* ---------- 10. TERMINAL ---------- */
  terminal: {
    user: "sahil",
    host: "portfolio",
    cwd: "~",
    whoami: [
      "B.Tech Cyber Security Student",
      "Networking and Ethical Hacking",
      "Building Cybersecurity and AI Projects"
    ]
  },

  /* ---------- 11. CONTACT FORM ----------
     formEndpoint: "" uses the mailto fallback (opens the visitor's email app).
     To deliver messages directly to your inbox, paste a form endpoint, such as
     one from Formspree (https://formspree.io) or Web3Forms (https://web3forms.com).
     See README section 7 for setup steps. */
  contact: {
    message:
      "I’m interested in cybersecurity, AI, and practical engineering projects. " +
      "Reach out to connect, collaborate, or discuss my work.",
    formEndpoint: ""
  }
};

/* Share the content object with main.js, animations.js, and terminal.js. */
window.portfolioData = portfolioData;

