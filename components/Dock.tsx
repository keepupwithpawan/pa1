import React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
  AnimatePresence,
} from "framer-motion";
import { Project } from "../types";
import { Moon, Sun, FileText } from "lucide-react";

interface DockProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelect: (id: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

interface DockItemProps {
  project: Project;
  mouseX: MotionValue<number>;
  isActive: boolean;
  onClick: () => void;
  isDark: boolean;
  isMobile: boolean;
  isXS: boolean;
}

const DockItem: React.FC<DockItemProps> = ({
  project,
  mouseX,
  isActive,
  onClick,
  isDark,
  isMobile,
  isXS,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  // Calculate distance from mouse to this item's center
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Maginfication logic
  const baseWidth = isXS ? 32 : isMobile ? 40 : 48;
  const targetWidth = isXS ? 60 : 80;
  const widthSync = useTransform(
    distance,
    [-150, 0, 150],
    [baseWidth, targetWidth, baseWidth],
  );
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="relative flex items-center justify-center cursor-pointer group"
      onClick={onClick}
    >
      <div className="w-full aspect-square rounded-lg overflow-hidden transition-opacity duration-300">
        <img
          src={
            (isDark && project.thumbnailDark) ||
            project.thumbnail ||
            project.images[0]
          }
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Tooltip */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 backdrop-blur-md text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {project.title}
      </div>

      {/* Active Dot */}
      {isActive && (
        <div
          className={`absolute -bottom-1 w-1 h-1 rounded-full ${isDark ? "bg-white" : "bg-black"}`}
        />
      )}
    </motion.div>
  );
};

export const Dock: React.FC<DockProps> = ({
  projects,
  activeProjectId,
  onSelect,
  isDark,
  toggleTheme,
}) => {
  const mouseX = useMotionValue(Infinity);
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isXS = windowWidth < 360;

  return (
    <div className="fixed bottom-4 md:bottom-6 left-0 right-0 flex flex-col items-center z-50 pointer-events-none">
      <motion.div
        onMouseMove={(e) => !isMobile && mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={`flex items-end ${isXS ? "gap-1 px-1.5 pb-1.5 h-[44px]" : "gap-1.5 md:gap-2 px-2 md:px-3 pb-2 md:pb-3 h-[52px] md:h-[68px]"} backdrop-blur-xl border shadow-2xl rounded-[12px] md:rounded-[16px] pointer-events-auto transition-all duration-500 overflow-x-auto md:overflow-visible max-w-[98vw] no-scrollbar ${
          isDark ? "bg-black/40 border-white/20" : "bg-white/40 border-black/20"
        }`}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div
          className={`flex items-end ${isXS ? "gap-1" : "gap-1.5 md:gap-2"} min-w-max`}
        >
          {projects.map((project) => (
            <DockItem
              key={project.id}
              project={project}
              mouseX={mouseX}
              isActive={activeProjectId === project.id}
              onClick={() => onSelect(project.id)}
              isDark={isDark}
              isMobile={isMobile}
              isXS={isXS}
            />
          ))}
        </div>

        {/* Separator */}
        <div
          className={`w-[1px] ${isXS ? "h-4 mx-0" : "h-6 md:h-8 mx-0.5 md:mx-1"} self-center transition-colors flex-shrink-0 ${
            isDark ? "bg-white/10" : "bg-black/10"
          }`}
        />

        <div className="flex items-center gap-1 flex-shrink-0">
          {/* View Resume */}
          <a
            href="https://drive.google.com/file/d/1g3xoGs944mBZ6kO9BpB6Hoe-VTa5iixL/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className={`flex items-center justify-center ${isXS ? "w-8 h-8" : "w-9 h-9 md:w-12 md:h-12"} cursor-pointer rounded-lg transition-colors group relative ${
              isDark ? "hover:bg-white/10" : "hover:bg-black/5"
            }`}
          >
            <FileText
              size={isXS ? 14 : 16}
              className={isDark ? "text-white" : "text-black"}
            />

            {/* Tooltip */}
            <div
              className={`absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 backdrop-blur-md text-[10px] md:text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ${
                isDark ? "bg-white text-black" : "bg-black/80 text-white"
              }`}
            >
              View Resume
            </div>
          </a>

          {/* Theme Toggle */}
          <div
            onClick={toggleTheme}
            className={`flex items-center justify-center ${isXS ? "w-8 h-8" : "w-9 h-9 md:w-12 md:h-12"} cursor-pointer rounded-lg transition-colors group relative ${
              isDark ? "hover:bg-white/10" : "hover:bg-black/5"
            }`}
          >
            {isDark ? (
              <Sun size={isXS ? 14 : 16} className="text-white" />
            ) : (
              <Moon size={isXS ? 14 : 16} className="text-black" />
            )}

            {/* Tooltip */}
            <div
              className={`absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 backdrop-blur-md text-[10px] md:text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ${
                isDark ? "bg-white text-black" : "bg-black/80 text-white"
              }`}
            >
              {isDark ? "Light Mode" : "Dark Mode"}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
