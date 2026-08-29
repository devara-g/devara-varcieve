"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BIODATA, TechSkill } from "@/data/biodata";
import { sounds } from "@/lib/soundEffects";
import { Cpu, Search, Layers, ShieldCheck, Zap } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

function TechBrandIcon({ name, icon }: { name: string; icon?: string }) {
  const n = name.toLowerCase();

  let iconFile = "node.svg";
  if (n.includes("laravel") || n.includes("php")) iconFile = "laravel.svg";
  else if (n.includes("postgres")) iconFile = "postgresql.svg";
  else if (n.includes("mysql") || n.includes("database")) iconFile = "mysql.svg";
  else if (n.includes("docker")) iconFile = "docker.svg";
  else if (n.includes("typescript")) iconFile = "typescript.svg";
  else if (n.includes("javascript")) iconFile = "javascript.svg";
  else if (n.includes("next")) iconFile = "nextjs.svg";
  else if (n.includes("react")) iconFile = "react.svg";
  else if (n.includes("redis")) iconFile = "redis.svg";
  else if (n.includes("tailwind")) iconFile = "tailwind.svg";
  else if (n.includes("git")) iconFile = "git.svg";
  else if (n.includes("graphql") || n.includes("api")) iconFile = "graphql.svg";
  else if (icon) iconFile = `${icon}.svg`;

  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      <Image
        src={`/assets/icons/${iconFile}`}
        alt={name}
        width={32}
        height={32}
        className="w-8 h-8 object-contain filter drop-shadow"
      />
    </div>
  );
}

export function TechArsenal() {
  const [selectedCategory, setSelectedCategory] = useState<string>("SEMUA");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    "SEMUA",
    "Backend & Terdistribusi",
    "Database & Storage",
    "DevOps & Cloud",
    "Frontend & Web Modern",
  ];

  const filteredSkills = BIODATA.skills.filter((skill) => {
    const matchesCat = selectedCategory === "SEMUA" || skill.category === selectedCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.productionUse.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="stack" className="py-16 sm:py-24 relative z-10 border-t border-white/[0.08] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal delay={0.1} distance={20}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 border-b border-white/[0.08] pb-5 sm:pb-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-2">
                <Cpu className="w-4 h-4" />
                <span>KEAHLIAN TEKNIS & ARSENAL PERANGKAT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
                <span>Stack & Tooling</span>
                <span className="text-[11px] sm:text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  Teruji di Lingkungan Produksi
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md mt-2.5 md:mt-0">
              Teknologi runtime terverifikasi, engine database relasional, layer caching, dan infrastruktur container.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter and Search Bar */}
        <ScrollReveal delay={0.15} distance={15}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4 mb-6 sm:mb-8 glass-panel p-3.5 sm:p-4 rounded-2xl border border-white/[0.08]">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedCategory(cat);
                  }}
                  className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-mono font-semibold transition-all border ${
                    selectedCategory === cat
                      ? "bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                      : "bg-slate-900 border-white/[0.08] text-slate-300 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari keahlian atau modul..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-black/60 border border-white/[0.08] rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Skills Bento Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <StaggerItem key={skill.name}>
              <div className="h-full glass-panel-interactive p-6 rounded-3xl border border-white/[0.08] flex flex-col justify-between space-y-4">
                <div>
                  {/* Header with Icon & Proficiency Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-black/50 border border-white/[0.08] flex items-center justify-center shadow-inner">
                        <TechBrandIcon name={skill.name} icon={skill.icon} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold font-mono text-white leading-tight">{skill.name}</h3>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                          {skill.category}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-semibold">
                      {skill.level}
                    </span>
                  </div>

                  {/* Production Use Case Description */}
                  <p className="text-xs text-slate-300 mt-4 leading-relaxed font-sans">
                    {skill.productionUse}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Indeks Kemahiran</span>
                    <span className="text-cyan-300 font-bold">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/[0.04]">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
