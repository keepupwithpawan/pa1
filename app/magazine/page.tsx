"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useMotionValue,
  AnimatePresence,
  animate,
} from "framer-motion";

interface PageProps {
  next: () => void;
  prev: () => void;
}

const imageCache = new Set<string>();

// Inject Cloudinary responsive transforms so mobile never downloads a
// full-resolution original. w_900 is plenty for a half-screen magazine page;
// q_auto and f_auto let Cloudinary pick the best quality and format (WebP/AVIF).
function cdnImg(url: string): string {
  return url.replace(
    "/image/upload/",
    "/image/upload/w_900,q_auto,f_auto/",
  );
}

// The handwritten note's content lives in one place so the tucked-in copy and
// the focused, centered copy stay identical.
function NoteContent({ className = "" }: { className?: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p
        className={`leading-relaxed text-[#1f2d24] text-center ${className}`}
        style={{ fontFamily: '"Shadows Into Light", cursive' }}
      >
        Thank you for reading!
      </p>
      <img
        src="/assets/doggie.png"
        alt=""
        draggable={false}
        className="w-16 h-16 md:w-24 md:h-24 object-contain pointer-events-none"
      />
      <p
        className="text-base text-[#1f2d24]/60 text-center"
        style={{ fontFamily: '"Shadows Into Light", cursive' }}
      >
        with love pa1.
      </p>
    </div>
  );
}

// One spring drives the note's shared-layout morph in BOTH directions, so
// tucking it back is the exact reverse of pulling it out.
const NOTE_MORPH = { type: "spring" as const, stiffness: 200, damping: 26 };

function EnvelopeCard() {
  // All three envelope images share one 1844x2304 canvas, so stacking them
  // full-size lines the flap, note opening and pocket up perfectly.
  const ENV_W = 1844;
  const ENV_H = 2304;
  // The note slides vertically between two states:
  //   y = REST_HIDDEN (0)  → tucked inside, only a lip showing above the opening
  //   y = PULLED_OUT       → dragged fully up and out of the envelope
  const REST_HIDDEN = 0;
  const PULLED_OUT = -300;

  const y = useMotionValue(REST_HIDDEN);
  // `focused` drives the centered, blurred-background reveal. While focused the
  // tucked-in note is hidden so it doesn't double up with the centered copy.
  const [focused, setFocused] = useState(false);

  // The note's shadow deepens as it's dragged out for a lift-off feel.
  const noteShadow = useTransform(
    y,
    [REST_HIDDEN, PULLED_OUT],
    ["0 4px 10px rgba(0,0,0,0.12)", "0 28px 50px rgba(0,0,0,0.28)"],
  );

  // Tuck the note back in — the exact reverse of pulling it out. First unfocus
  // so the in-envelope note (which sits BEHIND the front pocket) reappears at the
  // pulled-out position, then slide it DOWN through the opening into rest, so it
  // visibly disappears into the slot from the top rather than just shrinking.
  // `returning` is true while the note is morphing center→opening on its way
  // back in. Once that morph completes we slide it DOWN into the slot.
  const [returning, setReturning] = useState(false);

  const tuckBack = () => {
    y.set(PULLED_OUT);
    setReturning(true);
    setFocused(false);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-[#fcfbf9] text-black px-6 select-none overflow-hidden">
      {/* Envelope assembly — three stacked layers sharing one canvas:
          1. envelope-top.png   (open flap)   → BEHIND the note   (z-0)
          2. the note                          → MIDDLE            (z-10)
          3. envelope-bottom.png (front pocket) → IN FRONT of note (z-20)
          so the note is genuinely tucked inside and emerges from the opening. */}
      <div
        className="relative"
        style={{
          width: `min(${ENV_W / 4.2}px, 62vw)`,
          aspectRatio: `${ENV_W} / ${ENV_H}`,
        }}
      >
        {/* 1. Open flap (behind everything) */}
        <img
          src="/assets/envelope-top.png"
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain z-0 pointer-events-none"
        />

        {/* 2. Note — tucked between the flap and the pocket. Anchored from its
            BOTTOM so the body grows UPWARD and stays contained; at rest only a
            small lip peeks above the pocket opening. Dragging UP past halfway
            hands off to the focused, centered reveal below. */}
        {!focused && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 z-10 cursor-grab active:cursor-grabbing"
            style={{
              y,
              bottom: "30%",
              width: "60%",
              // Claim this touch entirely so the parent x-swipe handler never
              // sees it — prevents fast upward drags from triggering prev/next.
              touchAction: "none",
            }}
            drag="y"
            dragConstraints={{ top: PULLED_OUT, bottom: REST_HIDDEN }}
            dragElastic={0.05}
            onDragStart={(e) => e.stopPropagation()}
            onDragEnd={(e) => {
              e.stopPropagation();
              // Pulled past halfway → lift it out into the centered focus view.
              if (y.get() < PULLED_OUT / 2) {
                setFocused(true);
              } else {
                animateNote(y, REST_HIDDEN);
              }
            }}
            whileTap={{ cursor: "grabbing" }}
          >
            <motion.div
              layoutId="envelope-note"
              className="bg-[#fdf6b2] px-4 md:px-8 pt-3 md:pt-4 pb-5 md:pb-7"
              style={{ rotate: -1.4, boxShadow: noteShadow }}
              transition={NOTE_MORPH}
              onLayoutAnimationComplete={() => {
                if (returning) {
                  setReturning(false);
                  animateNote(y, REST_HIDDEN);
                }
              }}
            >
              <NoteContent className="text-base md:text-2xl" />
            </motion.div>
          </motion.div>
        )}

        {/* 3. Front pocket (in front of the note's lower half). Drags pass
            through to the note above via pointer-events-none. */}
        <img
          src="/assets/envelope-bottom.png"
          alt="Envelope"
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none"
        />
      </div>

      {/* Backdrop blur — only the blur lives in AnimatePresence so it can fade.
          Clicking it tucks the note back. */}
      <AnimatePresence>
        {focused && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-md pointer-events-auto cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={tuckBack}
          />
        )}
      </AnimatePresence>

      {/* Focused note — kept OUTSIDE AnimatePresence and gated only by `focused`
          so it mounts/unmounts in the SAME render as the tucked-in card. That
          lets the shared layoutId morph the note both ways with one spring, so
          tucking back is the exact reverse of the pull-out. */}
      {focused && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 pointer-events-none">
          <motion.div
            layoutId="envelope-note"
            className="bg-[#fdf6b2] px-8 py-10 md:px-14 md:py-16 cursor-default pointer-events-auto"
            style={{ boxShadow: "0 30px 70px rgba(0,0,0,0.35)" }}
            initial={{ rotate: -1.4 }}
            animate={{ rotate: 0 }}
            transition={NOTE_MORPH}
            onClick={(e) => e.stopPropagation()}
          >
            <NoteContent className="text-xl md:text-4xl" />
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Eased spring-snap for the note using framer-motion's imperative animate.
function animateNote(y: ReturnType<typeof useMotionValue<number>>, to: number) {
  animate(y, to, { type: "spring", stiffness: 260, damping: 30 });
}

function GhostImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(() => imageCache.has(src));
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) {
      setLoaded(true);
      imageCache.add(src);
    }
  }, [src]);

  const handleLoad = () => {
    setLoaded(true);
    imageCache.add(src);
  };

  return (
    <div className="relative w-full h-full">
      {!loaded && <div className="skeleton-shimmer absolute inset-0" />}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
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
        <a
          href="/"
          className="absolute bottom-0 left-0 hover:opacity-80 transition-opacity z-20 cursor-pointer"
        >
          <h1 className="mgz-serif text-xl md:text-3xl font-bold px-8 py-6 bg-white text-[#472f7a]">
            pa1.
          </h1>
        </a>
      </div>
      <div className="w-full h-[60%] flex bg-cover bg-center" style={{ backgroundImage: `url('${cdnImg("https://res.cloudinary.com/pa1/image/upload/v1775834846/100_0658_h05ndy.jpg")}')` }}></div>
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
              src: cdnImg("https://res.cloudinary.com/pa1/image/upload/v1775845843/100_0628_g5llq4.jpg"),
              span: "col-span-2 row-span-2",
            },
            {
              src: cdnImg("https://res.cloudinary.com/pa1/image/upload/v1775845864/100_0730_lga8pq.jpg"),
              span: "col-span-1 row-span-1",
            },
            {
              src: cdnImg("https://res.cloudinary.com/pa1/image/upload/v1775845877/100_0738_djo5jl.jpg"),
              span: "col-span-1 row-span-1",
            },
            {
              src: cdnImg("https://res.cloudinary.com/pa1/image/upload/v1775845899/100_0723_g5jfwk.jpg"),
              span: "col-span-1 row-span-1",
            },
            {
              src: cdnImg("https://res.cloudinary.com/pa1/image/upload/v1775845965/653668010_18096341099075239_2060828916065555154_n_mczt2w.webp"),
              span: "col-span-2 row-span-2",
            },
            {
              src: cdnImg("https://res.cloudinary.com/pa1/image/upload/v1775845952/669653454_18577546972026972_6718318350358987408_n_kckkmf.webp"),
              span: "col-span-1 row-span-1",
            },
          ].map((item, i) => (
            <div key={i} className={`relative overflow-hidden ${item.span}`}>
              <GhostImage src={item.src} alt="Artistic gallery item" />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={next}
        className="hidden md:block absolute bottom-8 right-8 z-10 px-6 py-2 bg-accent text-white hover:opacity-80 transition-all duration-300 cursor-pointer"
      >
        Next Page
      </button>
    </div>
  ),

  //Page 5 (Left side after 2 flips - Back of Sheet 1)
  ({ next, prev }) => (
    <div className="w-full h-full relative bg-[#fcfbf9] text-black">
      <div className="w-full h-full overflow-y-auto p-8 pb-24 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <h2 className="font-serif text-6xl text-black my-8">
          THE TIME I DIRECTED A BRAND CAMPAIGN!
        </h2>
        <div className="mb-8">
          <p className="text-justify">
            So back in January of 2021 I was approached by my dear friend Arya
            Sawant (Co-Founder of{" "}
            <a
              href="https://onepx.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-1 text-[#472f7a] hover:opacity-70 transition-all duration-200"
            >
              1PX
            </a>{" "}
            and Founder of{" "}
            <a
              href="https://www.instagram.com/bayrack.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-1 text-[#472f7a] hover:opacity-70 transition-all duration-200"
            >
              BayRack Clothing
            </a>
            ) to shoot a brand campaign for his latest drop. I was working with
            my friend{" "}
            <a
              href="https://www.instagram.com/aahanabobade1/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-1 text-[#472f7a] hover:opacity-70 transition-all duration-200"
            >
              Aahana Bobade
            </a>{" "}
            on DirectedByThem and we decided to do this shoot under our brand.
            <br />
            <br />
            Here are few of the important links:
          </p>
          <div className="my-4 w-full grid grid-cols-2 lg:flex lg:flex-wrap items-center gap-3 md:gap-4">
            {[
              {
                label: "my fav reel",
                color: "bg-[#c13584]",
                href: "https://www.instagram.com/reel/DFYAJWNyJ-R/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
              },
              {
                label: "bayrack insta",
                color: "bg-[#c13584]",
                href: "https://www.instagram.com/bayrack.in",
              },
              {
                label: "directedbythem insta",
                color: "bg-[#c13584]",
                href: "https://www.instagram.com/directedbythem/",
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

  // Page 6 (Right side after 1 flip - Front of Sheet 1)
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
              src: cdnImg("https://res.cloudinary.com/pa1/image/upload/v1777473765/Shot_14_rtlwqt.jpg"),
              span: "col-span-2 row-span-2",
            },
            {
              src: cdnImg("https://res.cloudinary.com/pa1/image/upload/v1777473765/Shot_2_tb2poj.jpg"),
              span: "col-span-1 row-span-1",
            },
            {
              src: cdnImg("https://res.cloudinary.com/pa1/image/upload/v1777473765/Shot_3_yboo7u.jpg"),
              span: "md:col-span-2 col-span-1 row-span-2",
            },
            {
              src: cdnImg("https://res.cloudinary.com/pa1/image/upload/v1777473766/Shot_12_fvrzx7.jpg"),
              span: "col-span-1 row-span-2",
            },
            {
              src: cdnImg("https://res.cloudinary.com/pa1/image/upload/v1777473766/Shot_6_ocmlzf.jpg"),
              span: "col-span-1 row-span-1",
            },
            {
              src: cdnImg("https://res.cloudinary.com/pa1/image/upload/v1777473771/Shot_10_vhopu2.jpg"),
              span: "md:col-span-3 col-span-2 row-span-2",
            },
          ].map((item, i) => (
            <div key={i} className={`relative overflow-hidden ${item.span}`}>
              <GhostImage src={item.src} alt="Artistic gallery item" />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={next}
        className="hidden md:block absolute bottom-8 right-8 z-10 px-6 py-2 bg-accent text-white hover:opacity-80 transition-all duration-300 cursor-pointer"
      >
        Next Page
      </button>
    </div>
  ),
];

/* The interactive envelope is the magazine's finale. On desktop it is rendered
   as a standalone full-page overlay (NOT part of the fold/flip sheet system);
   on mobile it is appended as its own full-screen page. */

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
  // The envelope finale is a standalone full-page overlay, not a folded sheet.
  const [showEnvelope, setShowEnvelope] = useState(false);

  const maxSpreads = Math.floor((PAGE_CONTENTS.length - 1) / 2);

  const next = () => {
    if (currentSpread < maxSpreads) {
      setCurrentSpread((c) => c + 1);
    } else {
      // Past the last spread → reveal the envelope finale.
      setShowEnvelope(true);
    }
  };

  const prev = () => {
    if (showEnvelope) {
      setShowEnvelope(false);
    } else if (currentSpread > 0) {
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

  // Mobile reads pages linearly, so the envelope is just another full-screen page.
  const EnvelopePage: React.FC<PageProps> = () => <EnvelopeCard />;
  const mobilePages = [...PAGE_CONTENTS, EnvelopePage];

  return (
    <>
      <div className="block md:hidden">
        <MobileMagazine pages={mobilePages} />
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

        {/* Envelope finale — full-page overlay, NOT folded into the spread. */}
        <AnimatePresence>
          {showEnvelope && (
            <motion.div
              key="envelope-finale"
              className="absolute inset-0 z-[60]"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <EnvelopeCard />
              <button
                onClick={prev}
                className="absolute bottom-8 left-8 z-10 px-6 py-2 bg-accent text-white hover:opacity-80 transition-all duration-300 cursor-pointer"
              >
                Previous Page
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
