"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";

interface PageProps {
  next: () => void;
  prev: () => void;
}

/* ─── ADD NEW PAGES HERE ─── */
const PAGE_CONTENTS: React.FC<PageProps>[] = [
  // Page 1 (Left Base - Always visible beneath)
  ({ next, prev }) => (
    <div className="w-full h-full relative bg-white">
      <div className="w-full h-[40%] bg-accent flex justify-between items-center p-8">
        <h1 className="mgz-serif text-4xl md:text-6xl font-bold text-white">
          A little bit <br />
          of everything.
        </h1>{" "}
        <a href="/" className="absolute bottom-0 left-0 hover:opacity-80 transition-opacity z-20 cursor-pointer">
          <h1 className="mgz-serif text-xl md:text-3xl font-bold px-8 py-6 bg-white text-[#472f7a]">
            pa1.
          </h1>
        </a>
      </div>
      <div className="w-full h-[60%] flex bg-[url('https://res.cloudinary.com/pa1/image/upload/v1775834846/100_0658_h05ndy.jpg')] bg-cover bg-center"></div>
    </div>
  ),

  // Page 2 (Right Front Cover)
  ({ next, prev }) => (
    <div className="w-full h-full relative bg-[#fcfbf9] text-black">
      <div className="w-full h-full overflow-y-auto p-8 pb-24 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <p className="text-justify">
          You probably read that clickbaity headline first. See that&apos;s user
          psychology at play{" "}
          <span className="italic">
            (if you didn&apos;t then you&apos;re not a normal user - it&apos;s
            your fault :-p)
          </span>
          . Hello, I am Pawan! If you are here, you want to explore more than
          just my technical side. Well, to be honest I love this side of me more
          than my tech-bro persona. There is no way I could write this long ass
          paragraph as a personal magazine on my{" "}
          <a
            href="https://www.pawankamat.com"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-1 text-[#472f7a] hover:opacity-70 transition-all duration-200"
          >
            front-end portfolio
          </a>
          .
        </p>
        <h2 className="font-serif text-6xl text-black my-8">
          PAWAN DOESN&apos;T LIKE TECH INDUSTRY?
        </h2>
        <p className="text-justify mb-8">
          I was always the creative types, I was 5 years old when my mom
          enrolled me in art class because she could see I had the knack for
          drawing. I did art class till 8th grade and got an A in Elementary and
          Intermediate state level drawing exams. I also used to shoot and make
          short films and compilations of our family trips since I was little.
          My dad always loved photography and videography and that was passed
          onto me as well hehe.
          <br />
          <br />
          That&apos;s not all, let me be a little more braggadocious, I have a
          Blue-1 belt in Taekwondo, I was the captain of both the Under-16 and
          Under-19 Football teams at my high school. I was also the General
          Secretary of the Student&apos;s Council at my engineering college and
          also I am my coolest cousin&apos;s favourite cousin (that&apos;s a
          merit too!)
        </p>
      </div>

      <button
        onClick={next}
        className="hidden md:block absolute bottom-8 right-8 z-10 px-6 py-2 bg-accent text-white hover:opacity-80 transition-all duration-300 cursor-pointer"
      >
        Next Page
      </button>
    </div>
  ),

  // Page 3 (Left side after 1 flip - Back of Sheet 0)
  ({ next, prev }) => (
    <div className="w-full h-full relative bg-[#fcfbf9] text-black">
      <div className="w-full h-full overflow-y-auto p-8 pb-24 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <p className="text-justify">
          Now here are a few things I would like you to see. I record everyday
          memories on the regular and turn them into short film by writing a
          script around the clips and release them on YouTube. You can check out
          some of my films{" "}
          <a
            href="https://www.youtube.com/@keepupwithpawan"
            className="underline underline-offset-1 text-[#472f7a] hover:opacity-70 transition-all duration-200"
          >
            here
          </a>
          . I actually started a film making venture with one of my closest
          friend in college but we both got so busy after putting out 1 film
          that we never got to make another one. The venture was called{" "}
          <a
            href="https://www.youtube.com/@DirectedByThem"
            className="underline underline-offset-1 text-[#472f7a] hover:opacity-70 transition-all duration-200"
          >
            Directed By Them
          </a>
          .
        </p>
        <h2 className="font-serif text-6xl text-black my-8">
          FUN FACT: I HAD A STARTUP!
        </h2>
        <div className="mb-8">
          <p className="text-justify">
            Before graduating me and 3 of my friends started Vetra, it was a
            pinterest alternative but for developers. It had a curated
            collection of projects, portfolios, landing pages and more with
            their live site, the Github Repo, the dev details and more. But
            since 2 of my friends moved to US to pursue their master&apos;s, we
            decided to give it a rest.
            <br />
            <br />
            Here are few of the important links:
          </p>
          <div className="my-4 w-full grid grid-cols-2 lg:flex lg:flex-wrap items-center gap-3 md:gap-4">
            {[
              {
                label: "LinkedIn",
                color: "bg-[#0077b5]",
                href: "https://www.linkedin.com/in/pawankamat",
              },
              {
                label: "GitHub",
                color: "bg-[#24292e]",
                href: "https://github.com/keepupwithpawan",
              },
              {
                label: "Pinterest",
                color: "bg-[#e60023]",
                href: "https://in.pinterest.com/keepupwithpawan",
              },
              {
                label: "Instagram",
                color: "bg-[#c13584]",
                href: "https://www.instagram.com/keepupwithpawan",
              },
            ].map(({ label, color, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden flex-1 px-4 py-10 border border-black/10 cursor-pointer group text-white md:text-black md:hover:text-white transition-colors duration-500 flex justify-center items-center"
              >
                <div
                  className={`absolute inset-0 w-full h-full ${color} translate-x-0 md:-translate-x-[105%] md:group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] z-0`}
                />
                <span className="relative z-10">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={prev}
        className="hidden md:block absolute bottom-8 left-8 z-10 px-6 py-2 bg-accent text-white hover:opacity-80 transition-all duration-300 cursor-pointer"
      >
        Previous Page
      </button>
    </div>
  ),

  // Page 4 (Right side after 1 flip - Front of Sheet 1)
  ({ next, prev }) => (
    <div className="w-full h-full relative bg-[#fcfbf9] text-black">
      <div className="w-full h-full overflow-y-auto p-8 pb-24 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <h1 className="mgz-serif text-4xl md:text-6xl text-center my-2 md:my-4 font-bold text-accent">
          Gallery
        </h1>

        {/* Abstract Magazine Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full mt-6 auto-rows-[160px] pb-8 grid-flow-dense">
          {[
            {
              src: "https://res.cloudinary.com/pa1/image/upload/v1775845843/100_0628_g5llq4.jpg",
              span: "col-span-2 row-span-2",
            },
            {
              src: "https://res.cloudinary.com/pa1/image/upload/v1775845864/100_0730_lga8pq.jpg",
              span: "col-span-1 row-span-1",
            },
            {
              src: "https://res.cloudinary.com/pa1/image/upload/v1775845877/100_0738_djo5jl.jpg",
              span: "col-span-1 row-span-1",
            },
            {
              src: "https://res.cloudinary.com/pa1/image/upload/v1775845899/100_0723_g5jfwk.jpg",
              span: "col-span-1 row-span-1",
            },
            {
              src: "https://res.cloudinary.com/pa1/image/upload/v1775845965/653668010_18096341099075239_2060828916065555154_n_mczt2w.webp",
              span: "col-span-2 row-span-2",
            },
            {
              src: "https://res.cloudinary.com/pa1/image/upload/v1775845952/669653454_18577546972026972_6718318350358987408_n_kckkmf.webp",
              span: "col-span-1 row-span-1",
            },
          ].map((item, i) => (
            <div key={i} className={`relative overflow-hidden ${item.span}`}>
              <img
                src={item.src}
                alt="Artistic gallery item"
                className="w-full h-full object-cover transition-all duration-200"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
];

// ────────────────────────────────────────────────────────────

interface SheetProps {
  index: number;
  front: React.ReactNode;
  back: React.ReactNode;
  isFlipped: boolean;
  isActiveFront: boolean;
  isActiveBack: boolean;
}

function PageSheet({
  index,
  front,
  back,
  isFlipped,
  isActiveFront,
  isActiveBack,
}: SheetProps) {
  // Use a motion value that we update via effect so framer-motion reacts strictly to state changes
  const rotateYMotion = useMotionValue(0);

  useEffect(() => {
    rotateYMotion.set(isFlipped ? -180 : 0);
  }, [isFlipped, rotateYMotion]);

  // Use a spring physics simulation for a realistic, slightly weighty page flip
  const rotateY = useSpring(rotateYMotion, {
    stiffness: 45,
    damping: 15,
    restDelta: 0.05,
    restSpeed: 0.05,
  });

  // Dynamically swap z-index exactly as the page crosses the 90-degree spine
  const zIndex = useTransform(rotateY, (r) => (r < -90 ? index : 50 - index));

  // Dynamic lighting/shadows simulating real-life page shading
  // (gets darker as it turns perpendicular to camera)
  const shadowFront = useTransform(rotateY, [0, -90], [0, 0.15]);
  const shadowBack = useTransform(rotateY, [-90, -180], [0.15, 0]);

  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full"
      style={{
        rotateY,
        zIndex,
        transformOrigin: "left center",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Front Face (Right Page) */}
      <div
        className="absolute inset-0 bg-white overflow-hidden shadow-[-2px_0_10px_rgba(0,0,0,0.05)]"
        style={{
          backfaceVisibility: "hidden",
          pointerEvents: isActiveFront ? "auto" : "none",
        }}
      >
        {front}
        <motion.div
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: shadowFront }}
        />
      </div>

      {/* Back Face (Left Page) */}
      <div
        className="absolute inset-0 bg-white overflow-hidden shadow-[2px_0_10px_rgba(0,0,0,0.05)]"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(-180deg)",
          pointerEvents: isActiveBack ? "auto" : "none",
        }}
      >
        {back}
        <motion.div
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: shadowBack }}
        />
      </div>
    </motion.div>
  );
}

function MobileMagazine({ pages }: { pages: React.FC<PageProps>[] }) {
  const [currentPage, setCurrentPage] = useState(0);

  const next = () => {
    if (currentPage < pages.length - 1) setCurrentPage((c) => c + 1);
  };
  const prev = () => {
    if (currentPage > 0) setCurrentPage((c) => c - 1);
  };

  const Page = pages[currentPage];

  return (
    <div className="w-full h-[100dvh] relative overflow-hidden bg-[#fcfbf9] text-black">
      {/* Top Progress Bar for stunning feel */}
      <div className="absolute top-0 left-0 w-full h-1 bg-black/10 z-50">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full absolute inset-0 shadow-2xl"
          drag="x"
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, { offset, velocity }) => {
            if (offset.x < -50 || velocity.x < -200) {
              next();
            } else if (offset.x > 50 || velocity.x > 200) {
              prev();
            }
          }}
        >
          <Page next={next} prev={prev} />
        </motion.div>
      </AnimatePresence>

      {/* Global Mobile Controls (Floating) */}
      <div className="pointer-events-none absolute bottom-6 w-full flex justify-between px-6 z-40">
        {currentPage > 0 ? (
          <button
            onClick={prev}
            className="pointer-events-auto px-6 py-2 bg-accent text-white hover:opacity-80 transition-all duration-300 cursor-pointer"
          >
            Previous
          </button>
        ) : (
          <div />
        )}

        {currentPage < pages.length - 1 ? (
          <button
            onClick={next}
            className="pointer-events-auto px-6 py-2 bg-accent text-white hover:opacity-80 transition-all duration-300 cursor-pointer"
          >
            Next
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

export default function Magazine() {
  const [currentSpread, setCurrentSpread] = useState(0);

  const next = () => {
    // Only allow flipping if there are remaining pages
    const maxSpreads = Math.floor((PAGE_CONTENTS.length - 1) / 2);
    if (currentSpread < maxSpreads) {
      setCurrentSpread((c) => c + 1);
    }
  };

  const prev = () => {
    if (currentSpread > 0) {
      setCurrentSpread((c) => c - 1);
    }
  };

  // Convert linear array of pages into 3D physical sheets (front/back mapping)
  const sheets = [];
  for (let i = 1; i < PAGE_CONTENTS.length; i += 2) {
    const FrontPage = PAGE_CONTENTS[i];
    const BackPage = PAGE_CONTENTS[i + 1];

    sheets.push({
      front: <FrontPage next={next} prev={prev} />,
      back: BackPage ? (
        <BackPage next={next} prev={prev} />
      ) : (
        <div className="w-full h-full bg-[#fcfbf9]" /> // Blank paper if odd amount of pages
      ),
    });
  }

  const BaseLeftPage = PAGE_CONTENTS[0];

  return (
    <>
      <div className="block md:hidden">
        <MobileMagazine pages={PAGE_CONTENTS} />
      </div>
      <main
        className="hidden md:flex relative w-full h-screen justify-center items-center bg-[#f0f0f0] overflow-hidden"
        style={{ perspective: "3000px" }}
      >
        <div
          className="flex w-full h-full shadow-2xl relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Foundation Left Page (Never moves) */}
          <div className="w-1/2 h-full z-0 overflow-hidden relative border-r border-black/10">
            <BaseLeftPage next={next} prev={prev} />
          </div>

          {/* Foundation Right Page (Container for dynamically turning sheets) */}
          <div
            className="w-1/2 h-full relative z-10"
            style={{ transformStyle: "preserve-3d" }}
          >
            {sheets.map((sheet, idx) => (
              <PageSheet
                key={idx}
                index={idx + 1} // 1-indexed to keep z-index logic clean
                front={sheet.front}
                back={sheet.back}
                isFlipped={idx < currentSpread} // if index < currentSpread, the sheet should be rotated -180deg
                isActiveFront={idx === currentSpread}
                isActiveBack={idx === currentSpread - 1}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
