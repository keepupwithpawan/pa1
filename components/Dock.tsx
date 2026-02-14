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
}

const DockItem: React.FC<DockItemProps> = ({
  project,
  mouseX,
  isActive,
  onClick,
  isDark,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  // Calculate distance from mouse to this item's center
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Maginfication logic
  const widthSync = useTransform(distance, [-150, 0, 150], [48, 80, 48]);
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

  return (
    <div className="fixed bottom-6 left-0 right-0 flex flex-col items-center z-50 pointer-events-none">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={`flex items-end gap-2 px-3 pb-3 h-[68px] backdrop-blur-xl border shadow-2xl rounded-[12px] pointer-events-auto transition-colors duration-500 ${
          isDark ? "bg-black/40 border-white/20" : "bg-white/40 border-black/20"
        }`}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {projects.map((project) => (
          <DockItem
            key={project.id}
            project={project}
            mouseX={mouseX}
            isActive={activeProjectId === project.id}
            onClick={() => onSelect(project.id)}
            isDark={isDark}
          />
        ))}

        {/* Separator */}
        <div
          className={`w-[1px] h-8 mx-1 self-center transition-colors ${
            isDark ? "bg-white/10" : "bg-black/10"
          }`}
        />

        {/* View Resume */}
        <a
          href="https://drive.google.com/file/d/1g3xoGs944mBZ6kO9BpB6Hoe-VTa5iixL/view?usp=sharing"
          target="_blank"
          rel="noreferrer"
          className={`flex items-center justify-center w-12 h-12 cursor-pointer rounded-lg transition-colors group relative ${
            isDark ? "hover:bg-white/10" : "hover:bg-black/5"
          }`}
        >
          <FileText
            size={20}
            className={isDark ? "text-white" : "text-black"}
          />

          {/* Tooltip */}
          <div
            className={`absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 backdrop-blur-md text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ${
              isDark ? "bg-white text-black" : "bg-black/80 text-white"
            }`}
          >
            View Resume
          </div>
        </a>

        {/* Theme Toggle */}
        <div
          onClick={toggleTheme}
          className={`flex items-center justify-center w-12 h-12 cursor-pointer rounded-lg transition-colors group relative ${
            isDark ? "hover:bg-white/10" : "hover:bg-black/5"
          }`}
        >
          {isDark ? (
            <Sun size={20} className="text-white" />
          ) : (
            <Moon size={20} className="text-black" />
          )}

          {/* Tooltip */}
          <div
            className={`absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 backdrop-blur-md text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap ${
              isDark ? "bg-white text-black" : "bg-black/80 text-white"
            }`}
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
