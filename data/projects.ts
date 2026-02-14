export interface Project {
  id: number;
  title: string;
  description: string;
  image: string; // Main cover image
  screenshots: string[]; // Array of screenshot URLs for the gallery
  members: string[];
  process: string;
  colorPalette: string[]; // Array of hex codes
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Made by Nothing - LinkedIn",
    description: "Redsign of LinkedIn in the design style of Nothing",
    image: "/projects/made-by-nothing/linkedin/made-by-nothing-linkedin-b.png",
    screenshots: [
      "/projects/made-by-nothing/linkedin/made-by-nothing-linkedin-b.png",
      "/projects/made-by-nothing/linkedin/made-by-nothing-linkedin-b.png", // Placeholder, ideally specific screenshots
      "/projects/made-by-nothing/linkedin/made-by-nothing-linkedin-b.png",
    ],
    members: ["Pawan", "Designer 2"],
    process:
      "We started by analyzing the core values of Nothing: transparency, dot matrix typography, and monochrome aesthetics. We then deconstructed LinkedIn's dense UI and rebuilt it using these principles, focusing on high contrast and raw data visualization.",
    colorPalette: ["#000000", "#FFFFFF", "#D3D3D3", "#FF0000"],
  },
  {
    id: 2,
    title: "Gradii",
    description: "AI Powered Interviewing platform",
    image: "/projects/gradii/gradii.png",
    screenshots: [
      "/projects/gradii/gradii.png",
      "/projects/gradii/gradii.png",
      "/projects/gradii/gradii.png",
    ],
    members: ["Pawan", "Backend Dev"],
    process:
      "Gradii was built to solve the inefficiency in technical hiring. We designed a clean, focus-oriented interface that uses AI to generate relevant questions in real-time.",
    colorPalette: ["#4F46E5", "#10B981", "#F3F4F6", "#111827"],
  },
  {
    id: 3,
    title: "Made by Nothing - Instagram",
    description: "Redsign of Instagram in the design style of Nothing",
    image:
      "/projects/made-by-nothing/instagram/made-by-nothing-instagram-b.png",
    screenshots: [
      "/projects/made-by-nothing/instagram/made-by-nothing-instagram-b.png",
      "/projects/made-by-nothing/instagram/made-by-nothing-instagram-w.png",
      "/projects/made-by-nothing/instagram/made-by-nothing-instagram-phone.png",
    ],
    members: ["Pawan"],
    process:
      "Applying the Nothing aesthetic to a visual-heavy platform like Instagram was a challenge. We stripped away all non-essential UI elements to let the content breathe, using the dot matrix font for iconic elements.",
    colorPalette: ["#000000", "#FFFFFF", "#333333"],
  },
  {
    id: 4,
    title: "Yana",
    description: "All in one budget planning tool",
    image: "/projects/yana/yana.png",
    screenshots: [
      "/projects/yana/yana.png",
      "/projects/yana/yana.png",
      "/projects/yana/yana.png",
    ],
    members: ["Pawan", "Finance Expert"],
    process:
      "Yana focuses on financial clarity. The design uses calming colors and soft shapes to reduce money-related anxiety, presenting complex data in simple, digestible charts.",
    colorPalette: ["#14B8A6", "#F59E0B", "#EEF2FF", "#1E293B"],
  },
  {
    id: 5,
    title: "Gita GPT",
    description: "A digital library of Gita verses based on your emotions",
    image: "/projects/gita-gpt/gita-gpt.png",
    screenshots: [
      "/projects/gita-gpt/gita-gpt.png",
      "/projects/gita-gpt/gita-gpt.png",
      "/projects/gita-gpt/gita-gpt.png",
    ],
    members: ["Pawan", "Scholar"],
    process:
      "Users input their emotional state, and the AI serves relevant verses. The UI is designed to be meditative, with smooth transitions and deep, rich colors evoking a spiritual atmosphere.",
    colorPalette: ["#F97316", "#7C2D12", "#FFF7ED", "#431407"],
  },
];
