import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Project } from "../types";

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
  isDark: boolean;
}

// Glassmorphism card styles
const getGlassCardClass = (isDark: boolean) =>
  `backdrop-blur-2xl border flex flex-col justify-center text-left transition-all duration-300 rounded-[8px] p-5 pointer-events-auto ${
    isDark
      ? "bg-black/60 border-white/20 hover:bg-black/80"
      : "bg-white/80 border-black/40 hover:bg-white/90"
  }`;

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  onClose,
  isDark,
}) => {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);
  const activeImageIndex = index;
  const setIsStoryExpanded = (val: boolean) => _setIsStoryExpanded(val);
  const [isStoryExpanded, _setIsStoryExpanded] = useState(false);
  const [isPaletteExpanded, setIsPaletteExpanded] = useState(false);
  const [hasTouch, setHasTouch] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  useEffect(() => {
    // Check if the primary pointer is 'coarse' (typical for mobile/tablet touch)
    // to avoid enabling mouse-drag on laptops with trackpads/mice.
    const mql = window.matchMedia("(pointer: coarse)");
    setHasTouch(mql.matches);

    const handler = (e: MediaQueryListEvent) => setHasTouch(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const windowWidth = windowSize.width;
  const windowHeight = windowSize.height;

  const isMobile = windowWidth < 900;
  const isTablet = windowWidth >= 900 && windowWidth < 1280;
  const isDesktop = windowWidth >= 1280 && windowWidth < 1920;
  const isTV = windowWidth >= 1920;

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color.toUpperCase());
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  // Reset image index when project changes
  useEffect(() => {
    setIndex([0, 0]);
  }, [project.id]);

  // Dynamic Palette logic
  const itemSize = windowWidth >= 1024 ? 40 : 32; // lg:w-10 (40px) vs w-8 (32px)
  const itemGap = windowWidth >= 1024 ? 12 : 8; // lg:gap-3 (12px) vs gap-2 (8px)
  const cardPadding = 40; // p-5 (20px) on both sides
  const availableWidth = isMobile
    ? windowWidth - 32 - cardPadding
    : 240 - cardPadding;

  const potentialCount = Math.floor(
    (availableWidth + itemGap) / (itemSize + itemGap),
  );
  const showPlusButton = project.palette.length > potentialCount;
  const maxColors = showPlusButton ? potentialCount - 1 : potentialCount;

  const nextImage = (e?: React.MouseEvent | any) => {
    e?.stopPropagation();
    const nextIdx = (activeImageIndex + 1) % project.images.length;
    setIndex([nextIdx, 1]);
  };

  const prevImage = (e?: React.MouseEvent | any) => {
    e?.stopPropagation();
    const prevIdx =
      (activeImageIndex - 1 + project.images.length) % project.images.length;
    setIndex([prevIdx, -1]);
  };

  // Animation variants for the scattered cards
  const scatterVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      x: 0,
      y: 0,
      filter: "blur(10px)",
    },
    visible: (custom: {
      x: string;
      y: string;
      tabletX?: string;
      tabletY?: string;
      tvX?: string;
      tvY?: string;
    }) => {
      if (isMobile)
        return { opacity: 1, scale: 1, x: 0, y: 0, filter: "blur(0px)" };

      // 1. Determine Preferred Destination
      let prefX = parseInt(
        isTV
          ? custom.tvX || custom.x
          : isTablet
            ? custom.tabletX || custom.x
            : custom.x,
      );
      let prefY = parseInt(
        isTV
          ? custom.tvY || custom.y
          : isTablet
            ? custom.tabletY || custom.y
            : custom.y,
      );

      // 2. Dynamic Image & Card Geometry
      // We prioritize the SIDE LANES. The image must shrink if there isn't enough room.
      let imageWidth = 460;
      if (windowWidth >= 1536) imageWidth = 720;
      else if (windowWidth >= 1280) imageWidth = 600;
      else if (isTablet) imageWidth = 340;

      const halfImage = imageWidth / 2;

      // 3. Card Visual Constants
      const baseCardWidth = 260;
      const sideMargin = 50;
      const imageGap = 50;

      const sideLaneWidth = windowWidth / 2 - halfImage;

      // Calculate scale to fit lane: Lane - spacing - margin
      const availableLane = sideLaneWidth - imageGap - sideMargin;
      const cardScale = Math.max(
        0.65,
        Math.min(1, availableLane / baseCardWidth),
      );

      const currentHalfW = (baseCardWidth * cardScale) / 2;
      const currentHalfH = (260 * cardScale) / 2; // Much taller safety buffer

      // 4. Strict Safety Envelopes
      const minX = halfImage + imageGap + currentHalfW;
      const maxX = windowWidth / 2 - sideMargin - currentHalfW;

      const minY = -(windowHeight / 2) + currentHalfH + 80;
      const maxY = windowHeight / 2 - currentHalfH - 120; // Room for Dock

      // 5. Position & Enforced Clamping
      const dirX = prefX >= 0 ? 1 : -1;
      let x = Math.abs(prefX);

      // MANDATORY: Keep inside screen (maxX)
      x = Math.min(x, maxX);
      // PRIORITY 2: Clear image (minX) - if conflict, screen containment wins
      x = Math.max(x, Math.min(maxX, minX));

      let y = Math.max(minY, Math.min(maxY, prefY));

      // Neighbor buffering
      if (prefY < -50) y = Math.min(y, -70);
      if (prefY > 50) y = Math.max(y, 70);

      return {
        opacity: 1,
        scale: cardScale,
        x: x * dirX + "px",
        y: y + "px",
        filter: "blur(0px)",
        transition: {
          type: "spring" as const,
          stiffness: 100,
          damping: 20,
          delay: 0.15,
        },
      };
    },
    exit: {
      opacity: 0,
      scale: 0.1,
      scaleX: 0.05,
      x: 0,
      y: 400, // Pull towards dock
      filter: "blur(20px)",
      transition: {
        duration: 0.6,
        ease: [0.32, 0, 0.67, 0] as [number, number, number, number],
      },
    },
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : direction < 0 ? "-100%" : 0,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : direction > 0 ? "-100%" : 0,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-12 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
    >
      {/* Click outside to close backdrop */}
      <div
        className="absolute inset-0 bg-white/10 backdrop-blur-md pointer-events-auto"
        onClick={onClose}
      />

      <div
        className={`relative w-full h-full flex flex-col items-center justify-center pointer-events-auto ${isMobile ? "overflow-y-auto no-scrollbar py-20 px-4" : "md:overflow-visible md:py-0 custom-scrollbar"}`}
      >
        {/* Main Center Image Container */}
        <motion.div
          className="relative z-20 transition-all duration-300 2xl:w-[720px] 2xl:h-[405px] xl:w-[600px] xl:h-[338px] lg:w-[460px] lg:h-[259px] md:w-[340px] md:h-[191px] w-[90%] aspect-video flex-shrink-0"
          exit={{
            scale: 0.05,
            scaleX: 0.01,
            y: 500,
            opacity: 0,
            transition: { duration: 0.6, ease: [0.32, 0, 0.67, 0] },
          }}
        >
          <motion.div
            layoutId={`project-img-container-${project.id}`}
            transition={{
              type: "spring",
              stiffness: 240,
              damping: 24,
              mass: 1.2,
            }}
            className={`w-full h-full rounded-[8px] relative overflow-hidden group border shadow-md ${
              isDark ? "bg-[#111] border-white/20" : "bg-white border-black/20"
            }`}
          >
            <div
              className={`w-full h-full flex flex-col overflow-hidden ${
                isDark ? "bg-[#111]" : "bg-white"
              }`}
            >
              {/* macOS Window Header */}
              <div
                className={`h-9 px-4 flex items-center border-b flex-shrink-0 relative ${
                  isDark
                    ? "bg-zinc-900/50 border-white/10"
                    : "bg-gray-50/50 border-gray-100"
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span
                    className={`text-[11px] font-medium font-sans tracking-tight ${
                      isDark ? "text-zinc-400" : "text-black"
                    }`}
                  >
                    {project.title.toLowerCase().replace(/\s+/g, "-")}.jpg
                  </span>
                </div>
                <div className="flex-1" />
                <div className="flex gap-2 relative z-10">
                  <div
                    onClick={onClose}
                    className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] cursor-pointer hover:bg-[#ff7b73] transition-colors"
                  />
                </div>
              </div>

              {/* Image Carousel Area */}
              <div className="relative flex-1 bg-white overflow-hidden group">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={activeImageIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    layoutId={
                      activeImageIndex === 0
                        ? `project-img-${project.id}`
                        : undefined
                    }
                    src={project.images[activeImageIndex]}
                    alt={project.title}
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    drag={hasTouch ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(_, { offset, velocity }) => {
                      const swipe =
                        Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 500;
                      if (swipe) {
                        if (offset.x > 0) prevImage();
                        else nextImage();
                      }
                    }}
                    className={`absolute inset-0 w-full h-full object-fit ${
                      hasTouch ? "cursor-grab active:cursor-grabbing" : ""
                    } ${isDark ? "bg-[#0a0a0a]" : "bg-gray-50"}`}
                  />
                </AnimatePresence>

                {/* Carousel Controls */}
                <div
                  className={`absolute inset-0 flex items-center justify-between p-4 z-30 pointer-events-none transition-opacity ${isMobile ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
                >
                  <button
                    onClick={prevImage}
                    className="bg-white/90 p-3 rounded-full hover:bg-white transition-all active:scale-95 pointer-events-auto shadow-sm"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="bg-white/90 p-3 rounded-full hover:bg-white transition-all active:scale-95 pointer-events-auto shadow-sm"
                  >
                    <ChevronRight size={22} />
                  </button>
                </div>
              </div>
            </div>

            {/* Pagination Dots (Inside the Image Area) */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2.5 z-30 pointer-events-none">
              {project.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeImageIndex ? "bg-white scale-125" : "bg-white/40"}`}
                />
              ))}
            </div>
          </motion.div>

          {/* Visit Site Button - Overlapping Bottom Right Corner */}
          <motion.a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className={`absolute bottom-4 right-4 z-30 p-2.5 border rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center group ${
              isDark
                ? "bg-zinc-900 border-white/20 text-white hover:bg-zinc-800"
                : "bg-white border-black/40 text-black hover:bg-gray-50"
            }`}
          >
            <ArrowUpRight
              size={22}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </motion.a>
        </motion.div>

        {/* Scattered Cards Container */}
        <div
          className={`${isMobile ? "flex flex-col items-center w-full gap-6 mt-12 mb-32" : "md:absolute md:inset-0 pointer-events-none flex flex-row items-center justify-center md:mt-0 md:px-0 md:mb-0"}`}
        >
          {/* 1. Title & Category (Top Left) */}
          <motion.div
            className={`${isMobile ? "relative w-full" : "md:absolute md:w-60"} ${getGlassCardClass(isDark)}`}
            custom={{
              x: "-650px",
              y: "-180px",
              tabletX: "-440px",
              tabletY: "-160px",
              tvX: "-900px",
              tvY: "-300px",
            }}
            variants={scatterVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2
              className={`font-serif italic text-2xl lg:text-3xl mb-1.5 leading-tight ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {project.title}
            </h2>
            <span className="text-[10px] lg:text-xs uppercase tracking-[0.2em] text-accent font-bold">
              {project.category}
            </span>
          </motion.div>

          {/* 2. Story (Right Side) */}
          <motion.div
            className={`${isMobile ? "relative w-full" : "md:absolute md:w-64"} cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${getGlassCardClass(isDark)}`}
            custom={{
              x: "650px",
              y: "-150px",
              tabletX: "440px",
              tabletY: "-120px",
              tvX: "900px",
              tvY: "-200px",
            }}
            variants={scatterVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setIsStoryExpanded(true)}
          >
            <h3 className="font-sans font-bold text-[10px] lg:text-xs mb-3 text-accent uppercase tracking-wider">
              The Story
            </h3>
            <div
              className={`font-sans text-[14px] lg:text-[15px] leading-relaxed ${
                isDark ? "text-zinc-300" : "text-gray-800"
              }`}
            >
              {project.description.length > 120
                ? project.description.substring(0, 120) + "..."
                : project.description}
            </div>
          </motion.div>

          {/* 3. Tech Stack (Bottom Left) */}
          <motion.div
            className={`${isMobile ? "relative w-full" : "md:absolute md:w-60"} ${getGlassCardClass(isDark)}`}
            custom={{
              x: "-620px",
              y: "150px",
              tabletX: "-420px",
              tabletY: "130px",
              tvX: "-850px",
              tvY: "250px",
            }}
            variants={scatterVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="font-sans font-bold text-[10px] lg:text-xs mb-4 text-accent uppercase tracking-wider">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2 lg:gap-2.5">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className={`px-2.5 py-0.5 lg:px-3 lg:py-1 rounded-full text-[10px] lg:text-xs font-medium border ${
                    isDark
                      ? "text-zinc-400 border-white/10"
                      : "text-black/70 border-black/40"
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* 4. Color Palette (Bottom Right) */}
          <motion.div
            className={`${isMobile ? "relative w-full" : "md:absolute md:w-60"} cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${getGlassCardClass(isDark)}`}
            custom={{
              x: "620px",
              y: "250px",
              tabletX: "420px",
              tabletY: "220px",
              tvX: "850px",
              tvY: "350px",
            }}
            variants={scatterVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setIsPaletteExpanded(true)}
          >
            <h3 className="font-sans font-bold text-[10px] lg:text-xs mb-4 text-accent uppercase tracking-wider">
              Palette
            </h3>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              {project.palette.slice(0, maxColors).map((color) => (
                <div key={color} className="group relative">
                  <div
                    className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full border transition-transform group-hover:scale-110 ${
                      isDark ? "border-white/20" : "border-black/40"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                </div>
              ))}
              {project.palette.length > maxColors && (
                <div
                  className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full border flex items-center justify-center text-[9px] lg:text-[10px] font-bold ${
                    isDark
                      ? "border-white/10 bg-zinc-900 text-zinc-500"
                      : "border-black/20 bg-gray-50 text-gray-400"
                  }`}
                >
                  +{project.palette.length - maxColors}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Expanded Story Popup */}
      <AnimatePresence>
        {isStoryExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 pb-[80px] md:pb-[110px] bg-black/40 backdrop-blur-md pointer-events-auto"
            onClick={() => setIsStoryExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl max-h-[80vh] rounded-xl shadow-2xl overflow-hidden border flex flex-col ${
                isDark
                  ? "bg-zinc-900/95 backdrop-blur-xl border-white/10"
                  : "bg-white/95 backdrop-blur-xl border-black/10"
              }`}
            >
              {/* macOS Style Bar */}
              <div
                className={`h-10 px-4 flex items-center border-b flex-shrink-0 relative ${
                  isDark
                    ? "bg-zinc-800/80 border-white/5"
                    : "bg-gray-50/80 border-gray-100"
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span
                    className={`text-[11px] font-medium tracking-tight ${
                      isDark ? "text-zinc-500" : "text-black"
                    }`}
                  >
                    the-story.txt
                  </span>
                </div>
                <div className="flex-1" />
                <div className="flex gap-2 relative z-10">
                  <div
                    onClick={() => setIsStoryExpanded(false)}
                    className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] cursor-pointer hover:bg-[#ff7b73] transition-colors"
                  />
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="px-6 md:px-10 py-6 overflow-y-auto custom-scrollbar">
                <p
                  className={`font-sans text-base md:text-lg leading-relaxed whitespace-pre-wrap ${
                    isDark ? "text-zinc-300" : "text-gray-800"
                  }`}
                >
                  {project.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Palette Popup */}
      <AnimatePresence>
        {isPaletteExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 pb-[80px] md:pb-[110px] bg-black/40 backdrop-blur-md pointer-events-auto"
            onClick={() => setIsPaletteExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-xl max-h-[80vh] rounded-xl shadow-2xl overflow-hidden border flex flex-col ${
                isDark
                  ? "bg-zinc-900/95 backdrop-blur-xl border-white/10"
                  : "bg-white/95 backdrop-blur-xl border-black/10"
              }`}
            >
              {/* macOS Style Bar */}
              <div
                className={`h-10 px-4 flex items-center border-b flex-shrink-0 relative ${
                  isDark
                    ? "bg-zinc-800/80 border-white/5"
                    : "bg-gray-50/80 border-gray-100"
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span
                    className={`text-[11px] font-medium tracking-tight ${
                      isDark ? "text-zinc-500" : "text-gray-400"
                    }`}
                  >
                    color-palette.json
                  </span>
                </div>
                <div className="flex-1" />
                <div className="flex gap-2 relative z-10">
                  <div
                    onClick={() => setIsPaletteExpanded(false)}
                    className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] cursor-pointer hover:bg-[#ff7b73] transition-colors"
                  />
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="px-10 py-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                  {project.palette.map((color) => (
                    <div
                      key={color}
                      className="flex flex-col items-center gap-3 group relative"
                    >
                      <div
                        onClick={() => handleCopy(color)}
                        className="w-20 h-20 rounded-[8px] group-hover:rounded-[16px] transition-all duration-300 cursor-pointer relative"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex flex-col items-center">
                        <span
                          className={`text-[12px] font-sans tracking-wide ${
                            isDark ? "text-white/70" : "text-black/70"
                          }`}
                        >
                          {color.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Copy Notification */}
      <AnimatePresence>
        {copiedColor && (
          <motion.div
            initial={{ opacity: 0, x: 20, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20, y: 0 }}
            className="fixed bottom-8 right-8 z-[200] px-4 py-2 bg-black text-white text-[12px] rounded-[8px] shadow-lg tracking-widest pointer-events-none border border-white/20"
          >
            HEX COPIED TO CLIPBOARD
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
