"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { BIODATA, ProjectCaseStudy } from "@/data/biodata";
import { sounds } from "@/lib/soundEffects";
import { GithubIcon } from "@/components/ui/Icons";
import {
  FolderGit2,
  Star,
  GitFork,
  ExternalLink,
  Code2,
  Layers,
  ChevronRight,
  X,
  Copy,
  Check,
  Search,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Database,
  Zap,
} from "lucide-react";

interface GithubRepo {
  id: string;
  name: string;
  title: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  githubUrl: string;
  liveUrl: string;
  hasLiveDemo: boolean;
  updatedAt: string;
  tags: string[];
}

export function ProjectsSection() {
  const [activeTab, setActiveTab] = useState<"featured" | "github">("featured");
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<ProjectCaseStudy | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // GitHub Repos State
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("SEMUA");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchGithubRepos = async () => {
    setLoadingRepos(true);
    try {
      const res = await fetch("/api/github");
      const data = await res.json();
      if (data.repos && Array.isArray(data.repos)) {
        setRepos(data.repos);
      }
    } catch {
      const fallbackRepos: GithubRepo[] = BIODATA.projects.map((p) => ({
        id: p.id,
        name: p.title.toLowerCase().replace(/ /g, "-"),
        title: p.title,
        description: p.summary,
        language: p.tags[0] || "TypeScript",
        stars: 1,
        forks: 0,
        githubUrl: p.githubUrl || BIODATA.github,
        liveUrl: p.liveUrl || "#",
        hasLiveDemo: Boolean(p.liveUrl && p.liveUrl !== "#"),
        updatedAt: "2026",
        tags: p.tags,
      }));
      setRepos(fallbackRepos);
    } finally {
      setLoadingRepos(false);
    }
  };

  useEffect(() => {
    fetchGithubRepos();
  }, []);

  const handleCopyCode = (code: string) => {
    sounds.playConfirm();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Filter GitHub Repos
  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      const matchesLang = selectedLanguage === "SEMUA" || repo.language === selectedLanguage;
      const matchesSearch =
        repo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLang && matchesSearch;
    });
  }, [repos, selectedLanguage, searchQuery]);

  const languages = ["SEMUA", ...Array.from(new Set(repos.map((r) => r.language).filter(Boolean)))];

  return (
    <section id="projects" className="py-24 relative z-10 border-t border-white/[0.08] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-2">
              <FolderGit2 className="w-4 h-4" />
              <span>SISTEM PRODUKSI & STUDI KASUS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Proyek Unggulan</span>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                Studi Kasus Arsitektur
              </span>
            </h2>
          </div>

          {/* Tab Switcher */}
          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-[#090b12] p-1.5 rounded-2xl border border-white/[0.08]">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab("featured");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === "featured"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sistem Unggulan ({BIODATA.projects.length})
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveTab("github");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                activeTab === "github"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Repositori GitHub ({repos.length || "..."})
            </button>
          </div>
        </div>

        {/* TAB 1: Featured RFC Case Studies */}
        {activeTab === "featured" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BIODATA.projects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedCaseStudy(project);
                }}
                className="group cursor-pointer glass-panel-interactive rounded-3xl overflow-hidden border border-white/[0.08] flex flex-col justify-between"
              >
                {/* Project Image Preview */}
                <div className="relative w-full h-48 bg-[#090d16] overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090b12] via-transparent to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/[0.1] text-[10px] font-mono text-cyan-300 font-bold uppercase">
                      {project.badge}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="p-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/[0.1] text-slate-300 group-hover:text-cyan-400 transition-colors flex items-center">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Project Body Info */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      {project.category}
                    </span>
                    <h3 className="text-base font-bold font-mono text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                      {project.summary}
                    </p>
                  </div>

                  {/* Metrics Telemetry Bar */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04]">
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">Latensi P99</span>
                      <span className="text-xs font-mono font-bold text-cyan-300">{project.metrics.latency}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04]">
                      <span className="text-[9px] font-mono text-slate-400 block uppercase">Efisiensi</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{project.metrics.efficiency}</span>
                    </div>
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-900 border border-white/[0.06] text-[10px] font-mono text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Live GitHub Repositories Explorer */}
        {activeTab === "github" && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-white/[0.08]">
              {/* Language Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedLanguage(lang);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
                      selectedLanguage === lang
                        ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                        : "bg-slate-900 border-white/[0.08] text-slate-300 hover:text-white"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari repositori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-black/60 border border-white/[0.08] rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Repos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredRepos.map((repo) => (
                <div
                  key={repo.id}
                  className="glass-panel p-5 rounded-2xl border border-white/[0.08] hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/20 font-semibold">
                        {repo.language}
                      </span>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400" /> {repo.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3 h-3 text-slate-400" /> {repo.forks}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold font-mono text-white mt-3 leading-tight">{repo.title}</h4>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{repo.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <a
                      href={repo.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>Source Code</span>
                    </a>

                    {repo.hasLiveDemo && (
                      <a
                        href={repo.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RFC Deep Dive Case Study Modal */}
        {selectedCaseStudy && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="relative w-full max-w-4xl bg-[#090b14] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-[#0d101a] border-b border-white/[0.08] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                    STUDI KASUS RFC // 0{selectedCaseStudy.id}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{selectedCaseStudy.category}</span>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    setSelectedCaseStudy(null);
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 font-sans">
                {/* Title & Summary */}
                <div>
                  <h3 className="text-2xl font-black font-mono text-white leading-tight">
                    {selectedCaseStudy.title}
                  </h3>
                  <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                    {selectedCaseStudy.summary}
                  </p>
                </div>

                {/* Production Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08]">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Latensi P99</span>
                    <span className="text-base font-mono font-bold text-cyan-300">{selectedCaseStudy.metrics.latency}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08]">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Throughput</span>
                    <span className="text-base font-mono font-bold text-emerald-400">{selectedCaseStudy.metrics.throughput}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08]">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">SLA Uptime</span>
                    <span className="text-base font-mono font-bold text-slate-200">{selectedCaseStudy.metrics.uptime}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08]">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Optimasi Query</span>
                    <span className="text-base font-mono font-bold text-amber-300">{selectedCaseStudy.metrics.efficiency}</span>
                  </div>
                </div>

                {/* Architectural Flow */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>Arsitektur Sistem & Pipeline Request</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedCaseStudy.architecture.overview}
                  </p>
                  <div className="space-y-2 pt-1">
                    {selectedCaseStudy.architecture.flow.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-black/40 border border-white/[0.04] text-xs text-slate-200 font-mono"
                      >
                        <span className="text-cyan-400 font-bold">0{idx + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Concurrency & Database Strategy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#0d101a] border border-white/[0.08] space-y-2">
                    <h5 className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Pertimbangan Konkurensi & Integritas</span>
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedCaseStudy.architecture.tradeOffs}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0d101a] border border-white/[0.08] space-y-2">
                    <h5 className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Strategi Indeks Database</span>
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedCaseStudy.architecture.databaseStrategy}
                    </p>
                  </div>
                </div>

                {/* Code Sample */}
                {selectedCaseStudy.codeSample && (
                  <div className="rounded-2xl bg-[#06080e] border border-white/[0.08] overflow-hidden">
                    <div className="px-4 py-2.5 bg-[#0a0d14] border-b border-white/[0.08] flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400">
                        {selectedCaseStudy.codeSample.filename}
                      </span>
                      <button
                        onClick={() => handleCopyCode(selectedCaseStudy.codeSample!.code)}
                        className="p-1 rounded text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-[11px] font-mono"
                      >
                        {copiedCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin Kode</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                      <code>{selectedCaseStudy.codeSample.code}</code>
                    </pre>
                  </div>
                )}

                {/* Key Features List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Fitur & Kapabilitas Teknis Utama
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCaseStudy.keyFeatures.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-300 font-sans leading-snug"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Links */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/[0.08]">
                  {selectedCaseStudy.liveUrl && selectedCaseStudy.liveUrl !== "#" && (
                    <a
                      href={selectedCaseStudy.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-2"
                    >
                      <span>BUKA PLATFORM LANGSUNG</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {selectedCaseStudy.githubUrl && (
                    <a
                      href={selectedCaseStudy.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.1] text-slate-200 font-mono text-xs font-semibold transition-all flex items-center gap-2"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>LIHAT REPOSITORI GITHUB</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
