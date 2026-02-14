import { Project } from "./types";

export const PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Gradii AI",
    category: "AI Powered Recruitment Engine",
    description:
      "While juggling a full-time SDE role at uKnowva HRMS, I took on the exciting challenge of leading front-end development for Gradii, an innovative AI-driven recruitment platform that conducts smart, adaptive AI voice screening, interviews and Background Verification of candidates.\n\nI architected and built the entire modern front-end system from scratch creating intuitive interfaces that let recruiters effortlessly set up job campaigns, interact with AI voice agents, and evaluate candidates with real-time insights. Not satisfied with 'good enough,' I dove deep into performance tuning and slashed page load times from 3 seconds down to 0.5 seconds delivering a noticeably smoother, more responsive experience that candidates and HRs loved.\n\nAs a bonus, I also designed and led the complete front-end architecture for Iris, Gradii’s sister product focused on voice-hunting and talent sourcing extending the same clean, high-performance foundation across the ecosystem. This side project sharpened my ability to own end-to-end front-end systems under time constraints while shipping production-grade quality.",
    techStack: [
      "NextJS",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Lucide React Icons",
      "Neon DB",
    ],
    palette: ["#fc5d5d", "#e3f2b8", "#f7f2c6", "#f7d5da", "#805ad5"],
    link: "https://gradii.ai",
    images: [
      "https://res.cloudinary.com/pa1/image/upload/v1771092212/gradii_df4atm.png",
      "https://res.cloudinary.com/pa1/image/upload/v1771092206/gradii-2_stnukt.png",
      "https://res.cloudinary.com/pa1/image/upload/v1771092206/gradii-3_iyoqab.png",
    ],
    thumbnail:
      "https://gradii.blob.core.windows.net/assets/revamp/revamp-mascot-gradii.png",
  },
  {
    id: "proj-2",
    title: "Gita GPT",
    category: "Spiritual Companion",
    description: `What began as a humble 3rd-year research paper quickly evolved into something far more meaningful: a full-fledged web application that brings timeless wisdom to modern struggles. I set out to tackle a real human challenge—offering genuine emotional support when words fall short.\n\nGita GPT lets users express how they feel, then draws from the Bhagavad Gita to suggest the most relevant verses tailored to their emotions. Powered by Hume AI, the real-time empathetic chatbot turns static scripture into dynamic, supportive conversations—creating a safe space for reflection and comfort during vulnerable moments.\n\nThe project resonated deeply: at SIES GST’s Cognition competition, Gita GPT took 1st place, recognized for its innovative fusion of ancient philosophy, AI, and mental well-being technology.\n\nBuilding this taught me how code can carry compassion, blending frontend craftsmanship with purpose-driven design to make ancient wisdom feel immediate and healing.`,
    techStack: ["HTML", "CSS", "Javascript", "Hume AI"],
    palette: ["#151f1a", "#000000", "#004f2d", "#ffffff"],
    link: "https://gita-gpt-gold.vercel.app",
    images: [
      "https://res.cloudinary.com/pa1/image/upload/v1771093314/gita-gpt_ohohli.png",
      "https://res.cloudinary.com/pa1/image/upload/v1771093320/gita-gpt-2_bxizbp.png",
      "https://res.cloudinary.com/pa1/image/upload/v1771093324/gita-gpt-3_fzavrh.png",
    ],
    thumbnail:
      "https://res.cloudinary.com/pa1/image/upload/v1771095523/gita-gpt-thumbnail_wjfgfr.png",
  },
  {
    id: "proj-3",
    title: "Made by Nothing - LinkedIn",
    category: "Redesign of LinkedIn in Nothing's Design Language",
    description: `Nothing's transparent, rebellious spirit has always captivated me—their dot-matrix Glyphs, strategic red pops against stark monochrome, and fearless embrace of less-is-more. I turned that obsession into an ongoing design exploration series: "Made by Nothing," where I radically reimagine familiar digital products through Nothing's unmistakable lens.\n\nThe first deep dive? A full redesign of LinkedIn's professional networking experience. I stripped away the clutter, built everything in Next.js + React + TypeScript + Tailwind CSS, and channeled pure Nothing DNA: monochromatic dark-mode perfection optimized for OLED true blacks, dot-matrix typography and icons, precise geometry with generous whitespace, subtle red accents for CTAs and interactions, sticky sidebar navigation with gradient flair, smooth-animated floating action buttons, and responsive mobile flows with a clean hamburger menu.\n\nThis series isn't just fan art, it's a playground to push boundaries, experiment with bold minimalism, and prove how a strong design philosophy can transform even the busiest interfaces into something calm, intentional, and unmistakably Nothing.`,
    techStack: ["Next.js", "Tailwind CSS", "TypeScript", "Lucide React Icons"],
    palette: ["#000000", "#ffffff", "#ff0000", "#2a2a2a", "#1a1a1a"],
    link: "https://made-by-nothing-linkedin.vercel.app/",
    images: [
      "https://res.cloudinary.com/pa1/image/upload/v1771094415/made-by-nothing-linkedin_nkh4dq.png",
      "https://res.cloudinary.com/pa1/image/upload/v1771093643/made-by-nothing-linkedin-w_a6q83q.png",
      "https://res.cloudinary.com/pa1/image/upload/v1771093643/made-by-nothing-linkedin-b_cog7aw.png",
    ],
    thumbnail:
      "https://res.cloudinary.com/pa1/image/upload/v1771095748/made-by-nothing-linkedin-thumbnail_rjud3b.png",
    thumbnailDark:
      "https://res.cloudinary.com/pa1/image/upload/v1771097021/made-by-nothing-linkedin-dark-thumbnail_zdjoo3.png",
  },
  {
    id: "proj-4",
    title: "Made by Nothing - Instagram",
    category: "Redesign of Instagram in Nothing's Design Language",
    description: `Nothing's ethos - bold minimalism, playful rebellion through restraint - keeps pulling me back. In this chapter of the "Made by Nothing" series, I reimagined Instagram, the endlessly scrolling feed of photos, stories, and connections, stripped down to its essence using Nothing's signature language.\n\nBuilt with Next.js, TypeScript, and Tailwind CSS, the redesign embraces a native dark mode with deep OLED blacks, a strict monochromatic base (black/white/grays), razor-sharp geometry, intentional whitespace, and those iconic dot-matrix typography and high-precision icons. Red accents hit only where they matter - interactions, emphasis. The result? A sticky sidebar with brand-inspired typography, a fully data-driven responsive feed that feels serene, and a standout resizable Direct Messages panel with dynamic width control for effortless multitasking without the usual visual noise.\n\nThis isn't just cosmetic - it's a deliberate challenge to conventional social UI patterns, proving how Nothing's philosophy can transform overwhelming feeds into focused, intentional experiences. The series continues, one radical redesign at a time.`,
    techStack: ["Next.js", "Tailwind CSS", "TypeScript", "Lucide React Icons"],
    palette: ["#000000", "#ffffff", "#ff0000", "#2a2a2a", "#1a1a1a"],
    link: "https://made-by-nothing-instagram.vercel.app/",
    images: [
      "https://res.cloudinary.com/pa1/image/upload/v1771094437/made-by-nothing-instagram_wirt9s.png",
      "https://res.cloudinary.com/pa1/image/upload/v1771094596/made-by-nothing-instagram-w_ujc876.png",
      "https://res.cloudinary.com/pa1/image/upload/v1771094597/made-by-nothing-instagram-b_c6wsar.png",
    ],
    thumbnail:
      "https://res.cloudinary.com/pa1/image/upload/v1771095857/made-by-nothing-instagram-thumbnail_tsha6k.png",
    thumbnailDark:
      "https://res.cloudinary.com/pa1/image/upload/v1771097021/made-by-nothing-instagram-dark-thumbnail_k3guj9.png",
  },
  {
    id: "proj-5",
    title: "Yana",
    category: "Finance Planner and Budgeting Advisor",
    description: "Coming Soon!",
    techStack: [
      "NextJS",
      "Tailwind CSS",
      "Typescript",
      "Lucide React Icons",
      "Neon DB",
    ],
    palette: ["#ffffff", "#171717", "#a173ff", "#ededed"],
    link: "/",
    images: [
      "https://res.cloudinary.com/pa1/image/upload/v1771094883/yana_pwpaym.png",
    ],
    thumbnail:
      "https://res.cloudinary.com/pa1/image/upload/v1771096043/yana-thumbnail_qv0z0i.png",
    thumbnailDark:
      "https://res.cloudinary.com/pa1/image/upload/v1771096698/yana-dark-thumbnail_cbwlru.png",
  },
];
