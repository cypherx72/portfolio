// components/section/Projects.tsx
"use client";

import { motion , Variants} from "framer-motion";
import Image from "next/image";
import { Empty, EmptyHeader, EmptyDescription, EmptyMedia, EmptyTitle } from "../ui/empty";
import { RiArrowRightUpLine } from "react-icons/ri";
import { FaRegFolderOpen } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { MdLink } from "react-icons/md";

// ─── Types ──────────────────────────────────────────────────────────────
interface Project {
  name: string;
  description: string;
  thumb?: string;                    // Optional thumbnail image
  tags: string[];
  status?: "IN PROGRESS" | "COMPLETED" | "ARCHIVED";  // Optional status
  link?: string;                     // Optional project link (website/demo)
  github?: string;                   // Optional GitHub repository link
  featured?: boolean;                // Optional featured flag
  startDate?: string;                // Optional start date
  endDate?: string;                  // Optional end date
  teamSize?: number;                 // Optional team size
  role?: string;                     // Optional role in the project
}

// ─── Projects Data ──────────────────────────────────────────────────────
const projects: Project[] = [
  {
    name: "SyncBoard",
    description:
      "Real-time multiplayer incident management workspace. Horizontally-scaled Socket.io cluster via Redis Pub/Sub, Yjs CRDT collaborative editing, optimistic locking with 409 rollback, and Stripe usage metering via BullMQ — all without blocking the socket hot path.",
    tags: [
      "Next.js",
      "Socket.io",
      "Yjs",
      "Redis",
      "PostgreSQL",
      "Zustand",
      "BullMQ",
      "Stripe",
      "Kubernetes",
    ],
    role: "Solo Architect & Developer",
    status: "IN PROGRESS",
    featured: false,  
    startDate: "July 2026",
    thumb: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // link: "https://syncboard.dev",       // Uncomment when deployed
    // github: "https://github.com/cypherx72/syncboard",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Projects() {
  const isEmpty = projects.length === 0;

  // Sort projects: featured first, then by status (IN PROGRESS > COMPLETED > ARCHIVED)
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    const statusOrder = { "IN PROGRESS": 0, COMPLETED: 1, ARCHIVED: 2 };
    return (statusOrder[a.status || "ARCHIVED"] || 2) - (statusOrder[b.status || "ARCHIVED"] || 2);
  });

  return (
    <div className="flex flex-col gap-4 w-full py-6">
      {isEmpty ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center py-20 text-center w-full"
        >
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-accent">
                <FaRegFolderOpen className="text-primary" />
              </EmptyMedia>
              <EmptyTitle className="font-medium text-zinc-300 tracking-wide">
                No Projects Yet
              </EmptyTitle>
              <EmptyDescription>
                Projects will show up here once they&apos;re added.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </motion.div>
      ) : (
        sortedProjects.map((p, index) => (
          <motion.div
            key={p.name}
            variants={cardVariants}
            custom={index}
            initial="hidden"
            animate="visible"
            className={`flex flex-col gap-5 sm:grid sm:grid-cols-[140px_1fr] hover:bg-white/5 hover:shadow-sm hover:backdrop-blur-md p-4 border-transparent hover:border-white/15 border-t rounded-xl transition-all duration-300 ${
              p.featured ? "bg-white/5 border-white/10" : ""
            }`}
          >
            {/* Thumbnail */}
            <div className="w-full sm:w-35 h-44 sm:h-22 rounded-lg border border-white/15 bg-white/5 overflow-hidden shrink-0 relative">
              {p.thumb ? (
                <Image
                  src={p.thumb}
                  alt={p.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5">
                  <RiArrowRightUpLine size={20} className="text-neutral-600" />
                </div>
              )}
              {p.featured && (
                <span className="absolute top-1.5 right-1.5 px-2 py-0.5 text-[9px] font-medium tracking-wider uppercase rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Featured
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1.5 min-w-0">
              {/* Header with name, status, and links */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-4 min-w-0">
                  <h4 className="text-sm font-semibold text-neutral-200 truncate">
                    {p.name}
                  </h4>
                  {p.status === "IN PROGRESS" && (
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                      In Progress
                    </span>
                  )}
                  {p.status === "COMPLETED" && (
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
                      Completed
                    </span>
                  )}
                  {p.status === "ARCHIVED" && (
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase rounded-full bg-neutral-500/20 text-neutral-400 border border-neutral-500/30 shrink-0">
                      Archived
                    </span>
                  )}
                </div>
                
                {/* Optional links */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-primary transition-colors p-1 hover:bg-white/5 rounded"
                      aria-label="View GitHub repository"
                    >
                      <FaGithub size={14} />
                    </a>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-primary transition-colors p-1 hover:bg-white/5 rounded"
                      aria-label="View live project"
                    >
                      <MdLink size={14} />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-400 line-clamp-3 leading-relaxed">
                {p.description}
              </p>

              {/* Optional metadata: role, dates, team size */}
              {(p.role || p.startDate || p.teamSize) && (
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500 pt-0.5">
                  {p.role && (
                    <span className="flex items-center gap-1">
                      <span className="text-neutral-600">🕸</span>
                      {p.role}
                    </span>
                  )}
                  {p.startDate && (
                    <span className="flex items-center gap-1">
                      <span className="text-neutral-600">📅</span>
                      {p.startDate}
                      {p.endDate && ` — ${p.endDate}`}
                    </span>
                  )}
                  {p.teamSize && (
                    <span className="flex items-center gap-1">
                      <span className="text-neutral-600">👥</span>
                      {p.teamSize} {p.teamSize === 1 ? "person" : "people"}
                    </span>
                  )}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {p.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium text-neutral-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}