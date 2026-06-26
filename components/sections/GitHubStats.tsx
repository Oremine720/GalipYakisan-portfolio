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

        // Fork olmayan kendi projeleri öne al, sonra güncellenme tarihine göre sırala
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
    {
      icon: BookOpen,
      label: "Repositories",
      value: user?.public_repos ?? "—",
      color: "#6366f1",
    },
    {
      icon: Users,
      label: "Followers",
      value: user?.followers ?? "—",
      color: "#8b5cf6",
    },
    {
      icon: TrendingUp,
      label: "Following",
      value: user?.following ?? "—",
      color: "#06b6d4",
    },
    {
      icon: Star,
      label: "Total Stars",
      value: repos.reduce((acc, r) => acc + r.stargazers_count, 0) || "—",
      color: "#f59e0b",
    },
  ];

  return (
    <section id="github" className="section-padding relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-green-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/10 text-xs text-zinc-400 font-mono mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            04. github
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            GitHub Aktivitesi
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Açık kaynak katkılarım ve son projelerim.
          </p>
        </motion.div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass rounded-2xl p-5 border border-white/5 text-center group hover:border-white/10 transition-all duration-300"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {loading ? (
                  <div className="h-7 w-16 mx-auto bg-zinc-800 rounded animate-pulse" />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-xs text-zinc-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* GitHub contribution image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass rounded-2xl border border-white/5 p-6 mb-8 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Github size={16} className="text-zinc-400" />
              <span className="text-sm text-zinc-400 font-mono">Oremine720</span>
            </div>
            <a
              href="https://github.com/Oremine720"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-zinc-600 hover:text-white transition-colors"
            >
              Profili Gör <ExternalLink size={11} />
            </a>
          </div>
          {/* Contribution graph from GitHub readme stats */}
          <div className="w-full overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://github-readme-stats.vercel.app/api?username=Oremine720&show_icons=true&theme=transparent&hide_border=true&title_color=6366f1&icon_color=8b5cf6&text_color=9ca3af&bg_color=00000000"
              alt="GitHub Stats"
              className="w-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </motion.div>

        {/* Recent repos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="glass rounded-xl p-5 border border-white/5 animate-pulse">
                  <div className="h-4 bg-zinc-800 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-zinc-800 rounded w-full mb-2" />
                  <div className="h-3 bg-zinc-800 rounded w-2/3" />
                </div>
              ))
            : error
            ? (
                <div className="col-span-3 text-center py-10 text-zinc-600">
                  <Github size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">GitHub verileri yüklenemedi.</p>
                  <a
                    href="https://github.com/Oremine720"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-indigo-400 text-sm hover:underline"
                  >
                    Profili ziyaret et <ExternalLink size={12} />
                  </a>
                </div>
              )
            : visibleRepos.map((repo, i) => (
                <motion.a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (i % INITIAL_COUNT) * 0.06 }}
                  whileHover={{ y: -3 }}
                  className="glass glass-hover rounded-xl p-5 border border-white/5 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <BookOpen size={13} className="text-indigo-400 shrink-0 mt-0.5" />
                      <span className="text-sm font-semibold text-white truncate">
                        {repo.name}
                      </span>
                    </div>
                    <ExternalLink size={12} className="text-zinc-700 shrink-0" />
                  </div>

                  {repo.description && (
                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                      {repo.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-3 text-[11px] text-zinc-600">
                      <span className="flex items-center gap-1">
                        <Star size={11} />
                        {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork size={11} />
                        {repo.forks_count}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-700">
                      {repo.language && (
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full"
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
              ))}
        </div>

        {/* Tümünü göster / daha az */}
        {!loading && !error && repos.length > INITIAL_COUNT && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll((s) => !s)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass glass-hover border border-white/10 text-zinc-300 hover:text-white text-sm font-medium transition-all duration-200"
            >
              {showAll ? (
                <>
                  <ChevronUp size={16} />
                  Daha Az Göster
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Tüm Projeleri Göster ({repos.length})
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
