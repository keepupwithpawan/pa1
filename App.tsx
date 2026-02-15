import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dock } from "./components/Dock";
import { ProjectDetail } from "./components/ProjectDetail";
import { PROJECTS } from "./constants";
import { MoveRight } from "lucide-react";

function App() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  const activeProject = PROJECTS.find((p) => p.id === activeProjectId);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`relative min-h-screen w-full transition-colors duration-500 overflow-hidden font-sans selection:bg-accent selection:text-white ${
        isDark ? "bg-[#0a0a0a] text-white" : "bg-white text-black"
      }`}
    >
      {/* Main Content Area */}
      <main className="relative z-10 w-full h-screen flex flex-col items-center justify-center p-6 md:p-12">
        {/* Intro Text - Only visible when no project is active */}
        <AnimatePresence>
          {!activeProjectId && (
            <>
              <AnimatePresence>
                {!activeProjectId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className={`px-4 py-1.5 text-[13px] font-medium rounded-full border pointer-events-auto ${
                      isDark
                        ? "border-white/20 text-white/70"
                        : "border-black/40 text-black"
                    }`}
                  >
                    Choose a Project below
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30, transition: { duration: 0.4 } }}
                className="text-center max-w-3xl flex flex-col gap-4 my-8"
              >
                <h1 className="font-serif italic text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl tracking-wide">
                  Pawan Kamat
                </h1>
                <p
                  className={`text-md md:text-lg xl:text-xl font-light leading-relaxed max-w-xl xl:max-w-2xl mx-auto ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Front End Developer based in Mumbai
                </p>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Project Detail View (The Expanded State) */}
        <AnimatePresence>
          {activeProject && (
            <ProjectDetail
              project={activeProject}
              onClose={() => setActiveProjectId(null)}
              isDark={isDark}
            />
          )}
        </AnimatePresence>
      </main>

      {/* The Dock */}
      <Dock
        projects={PROJECTS}
        activeProjectId={activeProjectId}
        onSelect={setActiveProjectId}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
    </div>
  );
}

export default App;
