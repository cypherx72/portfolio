import Image from "next/image";
import Link from "next/link";
import { FaRegStar } from "react-icons/fa";
import { RiArrowRightUpLine } from "react-icons/ri";
import { FiDownload } from "react-icons/fi";
import { motion } from "framer-motion";

const projects = [
  {
    name: "Build a Spotify Connected App",
    href: "#",
    description:
      "Video course that teaches how to build a web app with the Spotify Web API. Topics covered include the principles of REST APIs, user auth flows, Node, Express, React, Styled Components, and more.",
    stars: null,
    installs: null,
    stack: [],
    thumb: "/thumbnails/course.png",
  },
  {
    name: "Spotify Profile",
    href: "#",
    description:
      "Web app for visualizing personalized Spotify data. View your top artists, top tracks, recently played tracks, and detailed audio information about each track.",
    stars: 713,
    installs: null,
    stack: ["React", "Express", "Spotify API", "Heroku"],
    thumb: "/thumbnails/spotify.png",
  },
  {
    name: "Halcyon Theme",
    href: "#",
    description:
      "Minimal dark blue theme for VS Code, Sublime Text, Atom, iTerm, and more.",
    stars: null,
    installs: "100k+",
    stack: [],
    thumb: "/thumbnails/halcyon.png",
  },
  {
    name: "Brittany Chiang v4",
    href: "#",
    description:
      "The fourth iteration of brittanychiang.com, built with Gatsby and hosted on Vercel.",
    stars: 1200,
    installs: null,
    stack: ["Gatsby", "React", "GraphQL", "Vercel"],
    thumb: "/thumbnails/portfolio.png",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Projects() {
  return (
    <motion.div
      className="flex flex-col space-y-4 bg-background pt-10 w-full"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {projects.map((p) => (
        <motion.div
          key={p.name}
          variants={cardVariants}
          className="flex flex-col gap-5 sm:grid sm:grid-cols-[140px_1fr] hover:bg-white/5 hover:shadow-sm hover:backdrop-blur-md p-4 border-transparent hover:border-white/15 border-t rounded-xl transition-all duration-300"
        >
          {/* Thumbnail */}
          <div className="w-full sm:w-35 h-44 sm:h-22 rounded-lg border border-white/15 bg-(--surface) overflow-hidden shrink-0">
            {p.thumb && (
              <Image
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt={p.name}
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Content */}
          <div className="min-w-0">
            <Link
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 mb-2"
            >
              <span className="text-[15px] hover:text-primary font-semibold text-(--ink)">
                {p.name}
              </span>
              <RiArrowRightUpLine size={13} className="text-(--ink)" />
            </Link>

            <p className="mb-2.5 text-[13px] text-neutral-300 leading-relaxed">
              {p.description}
            </p>

            {/* Stars / Installs */}
            {(p.stars || p.installs) && (
              <div className="flex items-center gap-3 mb-2.5 font-mono text-[12px] text-neutral-400">
                {p.stars && (
                  <span className="flex items-center gap-1">
                    <FaRegStar size={12} /> {p.stars}
                  </span>
                )}
                {p.installs && (
                  <span className="flex items-center gap-1">
                    <FiDownload size={12} /> {p.installs} Installs
                  </span>
                )}
              </div>
            )}

            {/* Badges */}
            {p.stack.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="bg-white/10 px-2.5 py-0.5 rounded-full font-medium text-[12px] text-primary"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
