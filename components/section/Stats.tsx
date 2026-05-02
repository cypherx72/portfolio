"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

interface GitHubStats {
  totalCommits: number;
  weeks: { days: number[] }[];
}
interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
}

const GITHUB_USERNAME = "cypherx72";
const LEETCODE_USERNAME = "obichitas";

const fallbackGH: GitHubStats = { totalCommits: 0, weeks: [] };
const fallbackLC: LeetCodeStats = {
  totalSolved: 0,
  easySolved: 0,
  mediumSolved: 0,
  hardSolved: 0,
  ranking: 0,
};

// Dynamic color — must stay inline (value depends on runtime count)
function getColor(count: number) {
  if (count === 0) return "oklch(95% 0.052 163.051)";
  if (count < 3) return "oklch(76.5% 0.177 163.223)";
  if (count < 6) return "oklch(50.8% 0.118 165.612)";
  if (count < 10) return "oklch(26.2% 0.051 172.552)";
  return "var(--accent)";
}

function Heatmap({ weeks }: { weeks: { days: number[] }[] }) {
  const placeholder = Array.from({ length: 52 }, () => ({
    days: Array(7).fill(0),
  }));
  const data = weeks.length ? weeks : placeholder;

  return (
    // Outer: full width, scrollable horizontally — stays within the card
    <div className="relative pb-1 w-full overflow-x-auto">
      {/* Inner: min-w-max keeps columns in a single row; no overflow here */}
      <div
        className={`flex gap-0.75 min-w-max transition-opacity ${
          weeks.length ? "opacity-100" : "opacity-30"
        }`}
      >
        {data.map((w, wi) => (
          <div key={wi} className="flex flex-col gap-0.75">
            {w.days.map((count, di) => (
              <div
                key={di}
                title={`${count} contributions`}
                className="rounded-xs w-2.5 h-2.5 hover:scale-[1.4] transition-transform duration-100 cursor-default"
                style={{ background: getColor(count) }}
              />
            ))}
          </div>
        ))}
      </div>

      {!weeks.length && (
        <div className="absolute inset-0 flex justify-center items-center gap-1.5 font-mono text-[10px] text-muted">
          <AlertCircle size={11} /> Add your GitHub username to load real data
        </div>
      )}
    </div>
  );
}

const colorMap: Record<string, string> = {
  amber: "text-amber-500",
  red: "text-red-500",
  green: "text-emerald-500",
};

function DiffBar({
  label,
  solved,
  total,
  color,
}: {
  label: string;
  solved: number;
  total: number;
  color: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1.25 font-mono text-[11px] text-neutral-300">
        <span className={colorMap[color]}>{label}</span>
        {/* dynamic label color — stays inline */}
        <span>
          {solved}
          <span className="mx-0.75 text-neutral-400">/</span>
          <span className="text-neutral-400">{total || "—"}</span>
        </span>
      </div>
    </div>
  );
}

export default function Stats() {
  const [github, setGithub] = useState<GitHubStats>(fallbackGH);
  const [leetcode, setLeetcode] = useState<LeetCodeStats>(fallbackLC);
  const [ghError, setGhError] = useState(false);
  const [lcError, setLcError] = useState(false);
  const [ghLoading, setGhLoading] = useState(true);
  const [lcLoading, setLcLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`,
    )
      .then((r) => r.json())
      .then((data) => {
        const contributions = data.contributions as { count: number }[];
        const weeks: { days: number[] }[] = [];
        for (let i = 0; i < contributions.length; i += 7) {
          weeks.push({
            days: contributions.slice(i, i + 7).map((c) => c.count),
          });
        }
        const totalCommits = contributions.reduce((sum, c) => sum + c.count, 0);
        setGithub({ totalCommits, weeks });
      })
      .catch(() => setGhError(true))
      .finally(() => setGhLoading(false));

    fetch(`https://leetcode-stats.tashif.codes/${LEETCODE_USERNAME}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "error") throw new Error();
        setLeetcode({
          totalSolved: data.totalSolved,
          easySolved: data.easySolved,
          mediumSolved: data.mediumSolved,
          hardSolved: data.hardSolved,
          ranking: data.ranking,
        });
      })
      .catch(() => setLcError(true))
      .finally(() => setLcLoading(false));
  }, []);

  return (
    <section id="activity-progress" className="pt-10 w-full">
      <div className="flex flex-col space-y-4">
        {/* ── GitHub Card ─────────────────────────────────── */}
        <div className="p-6 border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2 mb-5 text-emerald-500">
            <FaGithub />
            <span className="font-mono font-medium text-xs">GitHub</span>
            {ghError && (
              <span className="flex items-center gap-1 ml-auto font-mono text-[10px] text-neutral-300">
                <AlertCircle size={10} /> unavailable
              </span>
            )}
          </div>

          {/* Commit count */}
          <div className="mb-5">
            <div className="font-mono font-bold text-neutral-300 text-3xl">
              {ghLoading ? "—" : github.totalCommits.toLocaleString()}
            </div>
            <div className="font-mono text-[10px] text-neutral-300 tracking-widest">
              CONTRIBUTIONS THIS YEAR
            </div>
          </div>

          <Heatmap weeks={github.weeks} />
        </div>

        {/* ── LeetCode Card ───────────────────────────────── */}
        <div className="p-6 border rounded-lg">
          {/* Header */}
          <div className="flex items-center gap-2 mb-5 text-emerald-500">
            <SiLeetcode />
            <span className="font-mono font-medium text-xs">LeetCode</span>
            {lcError && (
              <span className="flex items-center gap-1 ml-auto font-mono text-[10px] text-amber-500">
                <AlertCircle size={10} /> unavailable
              </span>
            )}
          </div>

          {/* Problems count */}
          <div className="mb-5">
            <div className="font-mono font-bold text-neutral-300 text-3xl">
              {lcLoading ? "—" : leetcode.totalSolved}
            </div>
            <div className="font-mono text-[10px] text-neutral-300 tracking-widest">
              PROBLEMS SOLVED
            </div>
          </div>

          <DiffBar
            label="Easy"
            solved={leetcode.easySolved}
            total={800}
            color="green"
          />
          <DiffBar
            label="Medium"
            solved={leetcode.mediumSolved}
            total={1600}
            color="amber"
          />
          <DiffBar
            label="Hard"
            solved={leetcode.hardSolved}
            total={700}
            color="red"
          />

          {leetcode.ranking > 0 && (
            <div className="mt-4 font-mono text-[11px] text-neutral-300">
              Global Ranking:{" "}
              <span className="text-amber-400">
                #{leetcode.ranking.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
