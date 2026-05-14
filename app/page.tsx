"use client";
import { Button } from "@/components/ui/button";
import { FaFileContract } from "react-icons/fa";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useRef, useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import Link from "next/link";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
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
    href: "https://github.com/your-github",
    label: "GitHub",
  },
  {
    icon: <FaLinkedin className="size-6" />,
    href: "https://linkedin.com/in/your-profile",
    label: "LinkedIn",
  },
  {
    icon: <MdOutlineEmail className="size-6" />,
    href: "mailto:your@email.com",
    label: "Email",
  },
  {
    icon: <FaInstagram className="size-6" />,
    href: "https://instagram.com/your-profile",
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

      setShowMobileNav(window.scrollY > triggerPoint);
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
      // Account for the sticky mobile nav height (~48px)
      const mobileNavHeight = 48;
      const top =
        el.getBoundingClientRect().top + window.scrollY - mobileNavHeight - 16;
      window.scrollTo({ top, behavior: "smooth" });
    } else if (rightAsideRef.current) {
      rightAsideRef.current.scrollTo({
        top: el.offsetTop,
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
        className="lg:top-0 lg:sticky flex flex-col justify-between gap-8 px-8 lg:px-12 py-10 w-full lg:w-2/5 lg:h-screen lg:overflow-hidden"
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
                  <p className="font-bold text-neutral-100 text-4xl lg:text-5xl text-wrap tracking-tight">
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
                  Software Developer
                </motion.span>
              </div>
              {/* Lottie — hidden on mobile/tablet */}
              <article className="hidden relative xl:flex justify-center items-center w-60 aspect-square shrink-0">
                <div className="absolute w-full h-full">
                  <DotLottieReact
                    src="https://lottie.host/f82e25fc-c99a-4c35-9935-3d98e29da621/YRAkAjJFo6.lottie"
                    loop
                    speed={0.8}
                    autoplay
                    className="w-full h-full"
                  />
                </div>
              </article>
            </div>

            <motion.span
              className="flex flex-row space-x-3"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              <Button className="bg-primary/30 hover:bg-primary/40 font-medium">
                <FaFileContract />
                View Résumé
              </Button>
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

      {/* ── Mobile sticky section label (lg: hidden) ────────────────────── */}
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

      {/* ── Right Aside — scrollable ─────────────────────────────────────── */}
      <aside
        ref={rightAsideRef}
        className="space-y-8 px-8 lg:px-0 py-10 lg:pr-10 w-full lg:w-3/5 lg:h-screen overflow-x-hidden lg:overflow-y-auto"
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
            {/* FIX: stack vertically on mobile, row on lg; w-full + overflow-hidden */}
            <div className="flex lg:flex-row flex-col items-center gap-8 pt-10 w-full overflow-hidden">
              {/* Skills column — always vertical, centered on mobile */}
              <motion.article
                className="flex flex-col justify-center items-start gap-3 w-full lg:w-auto lg:min-w-[33%] shrink-0"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={0}
              >
                <Item className="flex-nowrap border-primary/40 border-t-0 border-r-0 border-b-0 border-l-3 rounded-none rounded-l-xs">
                  <ItemMedia variant="image">
                    <Image
                      src="/svg/web-development.svg"
                      alt="web-development"
                      fill
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Web Development</ItemTitle>
                    <ItemDescription />
                  </ItemContent>
                </Item>

                <Separator
                  className="hidden sm:block bg-primary/40 rounded-full min-w-1 min-h-1"
                  orientation="vertical"
                />

                <Item className="flex-nowrap border-primary/40 border-t-0 border-r-0 border-b-0 border-l-3 rounded-none rounded-l-xs">
                  <ItemMedia variant="image">
                    <Image
                      src="/svg/machine-learning.svg"
                      alt="machine-learning"
                      fill
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Machine Learning</ItemTitle>
                    <ItemDescription />
                  </ItemContent>
                </Item>

                <Separator
                  className="hidden sm:block bg-primary/40 rounded-full min-w-1 min-h-1"
                  orientation="vertical"
                />

                <Item className="flex flex-nowrap items-center border-primary/40 border-t-0 border-r-0 border-b-0 border-l-3 rounded-none rounded-l-xs">
                  <ItemMedia variant="image">
                    <Image
                      src="/svg/mobile-development.svg"
                      alt="mobile-development"
                      fill
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Mobile Development</ItemTitle>
                    <ItemDescription />
                  </ItemContent>
                </Item>
              </motion.article>

              <motion.p
                className="w-full text-neutral-300 tracking-wide"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={1}
              >
                I&apos;m a software developer focused on building responsive,
                user-friendly web applications with modern tools like React,
                Next.js, and Tailwind CSS. I have a strong interest in data
                science — working with Python to explore data analysis and
                machine learning concepts. I enjoy crafting interfaces that are
                both functional and intuitive, blending frontend development
                with data-driven features. Currently, I&apos;m building an ERP
                system, focusing on scalable component architecture and
                integrating real-world workflows into the application.
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
    </main>
  );
}
