"use client";
import { Button } from "@/components/ui/button";
import { FaFileContract } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import Link from "next/link";
import Stats from "@/components/section/Stats";
import Projects from "@/components/section/Projects";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import {
  motion,
  useReducedMotion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

const navLinks = [
  { label: "Who's behind the code", href: "#profile" },
  { label: "Projects", href: "#projects" },
  { label: "Activity & Progress", href: "#progress" },
];

const socials = [
  {
    icon: <FaGithub className="size-6" />,
    href: "https://github.com/tavongachitambira",
    label: "GitHub",
  },
  {
    icon: <FaLinkedin className="size-6" />,
    href: "https://www.linkedin.com/in/tavonga-chitambira-213745309/",
    label: "LinkedIn",
  },
  {
    icon: <MdOutlineEmail className="size-6" />,
   href: "mailto:obichitas03@gmail.com",
    label: "Email",
  },
  {
    icon: <FaInstagram className="size-6" />,
    href: "#",
    label: "Instagram",
  },
];

// ─── Framer motion variants ──────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function ModeToggle() {
  const [activeSection, setActiveSection] = useState("profile");
  const [isMobile, setIsMobile] = useState(false);
  const leftAsideRef = useRef<HTMLElement>(null);
  const rightAsideRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [showMobileNav, setShowMobileNav] = useState(false);

  // Mouse spotlight
  const rawX = useMotionValue(-999);
  const rawY = useMotionValue(-999);
  const springConfig = { stiffness: 80, damping: 20, mass: 0.5 };
  const spotX = useSpring(rawX, springConfig);
  const spotY = useSpring(rawY, springConfig);
  const bgMotion = useMotionValue("none");

  // Show mobile nav only after scrolling past intro
  useEffect(() => {
    if (!isMobile) return;

    const handleMobileNavVisibility = () => {
      const profileSection = document.getElementById("profile");
      if (!profileSection) return;

      const triggerPoint = profileSection.offsetTop;

      setShowMobileNav(window.scrollY > triggerPoint + 280);
    };

    handleMobileNavVisibility();

    window.addEventListener("scroll", handleMobileNavVisibility, {
      passive: true,
    });

    return () =>
      window.removeEventListener("scroll", handleMobileNavVisibility);
  }, [isMobile]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [rawX, rawY]);

  // Detect mobile breakpoint (< lg = 1024px)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Forward wheel events from left aside → right aside (desktop only)
  useEffect(() => {
    if (isMobile) return;
    const left = leftAsideRef.current;
    const right = rightAsideRef.current;
    if (!left || !right) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      right.scrollBy({ top: e.deltaY, behavior: "instant" });
    };

    left.addEventListener("wheel", handleWheel, { passive: false });
    return () => left.removeEventListener("wheel", handleWheel);
  }, [isMobile]);

  // Track active section — window scroll on mobile, aside scroll on desktop
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace("#", ""));

    const handleScroll = () => {
      const container = isMobile ? null : rightAsideRef.current;
      const containerTop = container
        ? container.getBoundingClientRect().top
        : 0;
      const containerHeight = container
        ? container.clientHeight
        : window.innerHeight;

      let currentSection = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - containerTop <= containerHeight * 0.15) {
          currentSection = id;
        }
      }
      setActiveSection(currentSection);
    };

    handleScroll();

    if (isMobile) {
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      const container = rightAsideRef.current;
      if (!container) return;
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [isMobile]);

  // Unified nav click handler
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    if (isMobile) {
      const mobileNavHeight = 48;
      const top =
        el.getBoundingClientRect().top + window.scrollY - mobileNavHeight - 20;
      window.scrollTo({ top, behavior: "smooth" });
    } else if (rightAsideRef.current) {
      rightAsideRef.current.scrollTo({
        top: el.offsetTop - 20,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="flex lg:flex-row flex-col lg:h-screen lg:overflow-hidden">
      {/* ── Mouse spotlight overlay ──────────────────────────────────────── */}
      {!shouldReduceMotion && (
        <motion.div
          className="hidden lg:block z-40 fixed inset-0 pointer-events-none"
          style={{
            background: bgMotion,
          }}
          ref={(node) => {
            if (!node) return;
            const update = () => {
              node.style.background = `radial-gradient(700px circle at ${spotX.get()}px ${spotY.get()}px, rgba(var(--primary-rgb, 21 93 256) / 0.07), transparent 70%)`;
            };
            const unsubX = spotX.on("change", update);
            const unsubY = spotY.on("change", update);
            return () => {
              unsubX();
              unsubY();
            };
          }}
        />
      )}

      {/* ── Left Aside ───────────────────────────────────────────────────── */}
      <aside
        ref={leftAsideRef}
        className="lg:top-0 lg:sticky flex flex-col justify-between gap-8 px-4 lg:px-12  py-8 w-full lg:w-2/5 lg:h-screen lg:overflow-hidden"
      >
        <section className="flex flex-row space-x-6">
          <div className="flex flex-col justify-start space-y-6">
            <div className="flex flex-row items-center">
              <div className="flex flex-col space-y-6">
                <motion.span
                  className="flex flex-row font-sans font-semibold text-3xl"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                >
                  <p className="font-bold text-neutral-100 text-4xl lg:text-5xl leading-tight text-wrap tracking-tight">
                    Tavonga Chitambira
                  </p>
                </motion.span>

                <motion.span
                  className="font-semibold text-neutral-200 text-xl lg:text-2xl"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                >
                  Full Stack Engineer
                </motion.span>
              </div>
            </div>

            <motion.span
              className="flex flex-row space-x-3"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
            >
             <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">
  <Button className="bg-primary/30 hover:bg-primary/40 font-medium">
    <FaFileContract />
    View Resume
  </Button>
</Link>
            </motion.span>
          </div>
        </section>

        {/* Desktop-only nav */}
        <section className="hidden lg:block">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link, i) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <motion.div
                  key={link.href}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={i + 3}
                >
                  <Link
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`
                      group flex items-center gap-3 py-2 font-semibold
                      text-[11px] tracking-[0.06em] uppercase
                      no-underline transition-colors duration-200
                      ${isActive ? "text-primary" : "text-neutral-300"}
                      hover:text-blue-300
                    `}
                  >
                    <span
                      className={`
                        inline-block h-[0.5px] shrink-0
                        transition-all duration-300 ease-in-out
                        ${isActive ? "w-8 bg-blue-300" : "w-4 bg-neutral-300"}
                       ${!isActive ? "group-hover:w-6" : "w-8"} group-hover:bg-primary
                      `}
                    />
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </section>

        {/* Social Links */}
        <motion.section
          className="flex flex-row justify-start items-center space-x-3 w-full"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          {socials.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.07, duration: 0.4 }}
            >
              <Link
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex text-neutral-300 hover:text-primary transition-all hover:-translate-y-0.5 duration-200"
              >
                {s.icon}
              </Link>
            </motion.div>
          ))}
        </motion.section>
      </aside>

      {/* ── Right side wrapper ───────────────────────────────────────────── */}
      <div className="relative lg:w-3/5 lg:h-screen lg:overflow-hidden">
        {/* ── Mobile sticky section label (lg: hidden) ────────────────── */}
        <AnimatePresence>
          {showMobileNav && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden top-0 z-50 sticky flex items-center bg-background/80 backdrop-blur-md px-8 py-3 border-white/10 border-b h-11 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="font-medium text-[11px] text-primary uppercase tracking-widest"
                >
                  {
                    navLinks.find(
                      (l) => l.href.replace("#", "") === activeSection,
                    )?.label
                  }
                </motion.span>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Right Aside — scrollable ─────────────────────────────────── */}
        <aside
          ref={rightAsideRef}
          className="space-y-8 px-4 lg:px-0 py-10 lg:pr-10 w-full lg:h-screen overflow-x-hidden overflow-y-auto lg:pb-24"
        >
          {/* Profile */}
          <section id="profile" className="h-auto">
            <div className="flex flex-col justify-center items-center space-y-2">
              <motion.h3
                className="font-bold text-neutral-300 text-2xl tracking-wide"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                Who&apos;s behind the code
              </motion.h3>
              <motion.div
                className="bg-primary/40 rounded-full w-12 h-0.5"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              />
             
              <div className="w-full space-y-4">
                <motion.p
                  className="text-neutral-300 tracking-wide leading-6.5"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={1}
                >
                  I&apos;m a full-stack engineer and Computer Science student at Vishwakarma University, Pune, with a sharp focus on systems that have to work under pressure — real-time, concurrent, and distributed. I care about the architectural decisions that separate a system that holds up from one that collapses under load, and I do my clearest thinking at the intersection of backend design and the UX that sits on top of it.
                </motion.p>
                
                <motion.p
                  className="text-neutral-300 tracking-wide leading-6.5"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={2}
                >
                  Right now I&apos;m building SyncBoard — a real-time multiplayer incident management workspace. Think PagerDuty meets Notion: Socket.io clusters bridged via Redis Pub/Sub, Yjs CRDTs for conflict-free collaborative editing, and an optimistic UI state machine that rolls back gracefully when the network disagrees. The architecture problem is interesting; solving it without over-engineering it is the actual challenge.
                </motion.p>
                
                <motion.p
                  className="text-neutral-300 tracking-wide leading-6.5"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={3}
                >
                  I&apos;m working toward GenAI engineering in parallel — building up from linear algebra and backpropagation through to fine-tuning and production LLM systems. The plan is to eventually bring that into the incident-management space: auto-classification, runbook RAG lookup, on-call summarisation.
                </motion.p>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section id="projects" className="h-auto">
            <div className="flex flex-col justify-center items-center space-y-2">
              <motion.h3
                className="font-bold text-neutral-300 text-2xl tracking-wide"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                Projects
              </motion.h3>
              <motion.div
                className="bg-primary/40 rounded-full w-12 h-0.5"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              />
              <Projects />
            </div>
          </section>

          {/* Progress */}
          <section id="progress" className="h-auto">
            <div className="flex flex-col justify-center items-center space-y-2">
              <motion.h3
                className="font-bold text-neutral-300 text-2xl tracking-wide"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                Activity &amp; Progress
              </motion.h3>
              <motion.div
                className="bg-primary/40 rounded-full w-12 h-0.5"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              />
              <Stats />
            </div>
          </section>
        </aside>

        {/* ── Footer / Attribution (Sticky on desktop, inline on mobile) ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className={`
            ${!isMobile ? 'lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:bg-linear-to-t lg:from-background lg:from-60% lg:to-transparent lg:pt-8 lg:pb-4 xs:px-4 ' : ''}
            flex flex-col items-start gap-1.5 lg:px-0 pb-4 px-4
          `}
        >
          <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-neutral-500">
            <span>Design inspired by</span>
            <a
              href="https://github.com/bchiang7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 hover:text-primary transition-colors duration-200 font-medium"
            >
              @Brittany Chiang
            </a>
            <span>·</span>
            <a
              href="https://github.com/cypherx72/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-primary transition-colors duration-200"
            >
              View Source
            </a>
          </div>
          <p className="text-[11px] text-neutral-500 tracking-wide">
            © {new Date().getFullYear()} Tavonga Chitambira 
          </p>
        </motion.div>
      </div>
    </main>
  );
}
