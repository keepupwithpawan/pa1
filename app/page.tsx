"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dock } from "../components/Dock";
import { ProjectDetail } from "../components/ProjectDetail";
import { PROJECTS } from "../constants";

export default function HomePage() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  const activeProject = PROJECTS.find((p) => p.id === activeProjectId);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden font-sans transition-colors duration-500 selection:bg-accent selection:text-white ${
        isDark ? "bg-[#0a0a0a] text-white" : "bg-white text-black"
      }`}
    >
      <main className="relative z-10 flex h-screen w-full flex-col items-center justify-center p-6 md:p-12">
        <AnimatePresence>
          {!activeProjectId && (
            <>
              <AnimatePresence>
                {!activeProjectId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className={`pointer-events-auto rounded-full border px-4 py-1.5 text-[13px] font-medium ${
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
                className="my-8 flex max-w-3xl flex-col gap-4 text-center"
              >
                <h1 className="font-serif text-4xl italic tracking-wide md:text-5xl xl:text-6xl 2xl:text-7xl">
                  Pawan Kamat
                </h1>
                <p
                  className={`mx-auto max-w-xl text-md font-light leading-relaxed md:text-lg xl:max-w-2xl xl:text-xl ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Front End Developer based in Mumbai
                </p>
              </motion.div>
            </>
          )}
        </AnimatePresence>

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
