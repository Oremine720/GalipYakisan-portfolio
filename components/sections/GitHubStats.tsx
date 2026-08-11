"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Github,
  Star,
  GitFork,
  BookOpen,
  Users,
  TrendingUp,
  ExternalLink,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getRelativeTime } from "@/lib/utils";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
  login: string;
}

const LANG_COLORS: Record<string, string> = {
  "C#": "#178600",
  Python: "#3572A5",
  PHP: "#4F5D95",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Kotlin: "#A97BFF",
  "C++": "#f34b7d",
  Java: "#b07219",
};

const INITIAL_COUNT = 6;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function GitHubStats() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch("https://api.github.com/users/Oremine720"),
          fetch(
            "https://api.github.com/users/Oremine720/repos?sort=updated&per_page=100"
          ),
        ]);

        if (!userRes.ok || !reposRes.ok) throw new Error("GitHub API error");

        const [userData, reposData] = await Promise.all([
          userRes.json(),
          reposRes.json(),
        ]);

        const sorted = (reposData as GitHubRepo[]).sort((a, b) => {
          const aScore = a.stargazers_count * 10;
          const bScore = b.stargazers_count * 10;
          if (bScore !== aScore) return bScore - aScore;
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        });

        setUser(userData);
        setRepos(sorted);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (inView) fetchData();
  }, [inView]);

  const visibleRepos = showAll ? repos : repos.slice(0, INITIAL_COUNT);

  const stats = [
    { icon: BookOpen, label: "Repositories", value: user?.public_repos ?? "—" },
    { icon: Users, label: "Followers", value: user?.followers ?? "—" },
    { icon: TrendingUp, label: "Following", value: user?.following ?? "—" },
    {
      icon: Star,
      label: "Total Stars",
      value: repos.reduce((acc, r) => acc + r.stargazers_count, 0) || "—",
    },
  ];

  return (
    <section id="github" className="section-padding relative">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-10 flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <span className="overline">04 — Açık kaynak</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              GitHub aktivitesi
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-mute-2">
              Katkılarım ve son güncellenen depolarım.
            </p>
          </div>
          <a
            href="https://github.com/Oremine720"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <Github size={15} />
            @Oremine720
            <ExternalLink size={13} />
          </a>
        </motion.div>

        {/* Stat tiles */}
        <div className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5"
            >
              <stat.icon size={16} className="mb-4 text-mute-2" />
              <div className="text-metal text-2xl font-semibold tracking-tight">
                {loading ? (
                  <div className="h-7 w-14 animate-pulse rounded bg-white/[0.06]" />
                ) : (
                  stat.value
                )}
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-mute-3">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Repos */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-white/[0.07] p-5"
              >
                <div className="mb-3 h-4 w-3/4 rounded bg-white/[0.06]" />
                <div className="mb-2 h-3 w-full rounded bg-white/[0.05]" />
                <div className="h-3 w-2/3 rounded bg-white/[0.05]" />
              </div>
            ))
          ) : error ? (
            <div className="col-span-full py-12 text-center text-mute-3">
              <Github size={28} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">GitHub verileri yüklenemedi.</p>
              <a
                href="https://github.com/Oremine720"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm text-indigo-400 hover:underline"
              >
                Profili ziyaret et <ExternalLink size={12} />
              </a>
            </div>
          ) : (
            visibleRepos.map((repo, i) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (i % INITIAL_COUNT) * 0.05 }}
                className="group flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-white/[0.015] p-5 transition-colors duration-200 hover:border-white/[0.16] hover:bg-white/[0.03]"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="truncate text-sm font-medium text-zinc-200 group-hover:text-white">
                    {repo.name}
                  </span>
                  <ExternalLink
                    size={13}
                    className="shrink-0 text-zinc-700 transition-colors group-hover:text-indigo-400"
                  />
                </div>

                {repo.description && (
                  <p className="line-clamp-2 text-xs leading-relaxed text-mute-2">
                    {repo.description}
                  </p>
                )}

                {/* flex-wrap: yıldız+fork / dil+tarih grupları dar telefonda
                    tek satıra sığmayıp karttan taşıyordu. */}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 pt-2 font-mono text-[11px] text-mute-3">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Star size={11} />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={11} />
                      {repo.forks_count}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              LANG_COLORS[repo.language] ?? "#8b949e",
                          }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {getRelativeTime(repo.updated_at)}
                    </span>
                  </div>
                </div>
              </motion.a>
            ))
          )}
        </div>

        {/* Toggle */}
        {!loading && !error && repos.length > INITIAL_COUNT && (
          <div className="mt-8">
            <button
              onClick={() => setShowAll((s) => !s)}
              className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              {showAll ? (
                <>
                  <ChevronUp size={16} />
                  Daha az göster
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Tüm depoları göster ({repos.length})
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
