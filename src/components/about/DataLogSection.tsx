"use client";

import React, { useState, useEffect } from "react";
import { BIODATA } from "@/data/biodata";
import { sounds } from "@/lib/soundEffects";
import {
  Activity,
  Cpu,
  Database,
  Server,
  Layers,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Globe,
  Clock,
  Briefcase,
} from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

export function DataLogSection() {
  const [copiedBio, setCopiedBio] = useState(false);
  const [livePing, setLivePing] = useState(14);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePing(Math.floor(Math.random() * 4) + 12);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyBio = () => {
    sounds.playConfirm();
    navigator.clipboard.writeText(BIODATA.bio);
    setCopiedBio(true);
    setTimeout(() => setCopiedBio(false), 2000);
  };

  const pillars = [
    {
      id: "api",
      title: "Arsitektur API & Microservices",
      subtitle: "Gateway Ingress RESTful & GraphQL",
      icon: Layers,
      tag: "THROUGHPUT TINGGI",
      desc: "Merancang endpoint asinkronus berlatensi sub-20ms P99 dengan autentikasi JWT, rate limiting token-bucket, dan dokumentasi OpenAPI 3.0 otomatis.",
      metrics: "Latensi Sub-16ms // 5.000+ RPS",
    },
    {
      id: "data",
      title: "Mesin Database & Storage Terdistribusi",
      subtitle: "Penyimpanan Relasional ACID & In-Memory Cache",
      icon: Database,
      tag: "INTEGRITAS DATA",
      desc: "Mengoptimalkan skema relasional, indeks komposit B-Tree, level isolasi transaksi, partisi tabel PostgreSQL, dan state sesi in-memory Redis.",
      metrics: "94.8% Rasio Cache Hit // Bebas Deadlock",
    },
    {
      id: "devops",
      title: "DevOps & Infrastruktur Container",
      subtitle: "Docker & CI/CD Tanpa Downtime",
      icon: Server,
      tag: "KETERSEDIAAN TINGGI",
      desc: "Build image container minimalis bertingkat, pipeline uji otomatis GitHub Actions, probe health check, dan mekanisme rollback otomatis.",
      metrics: "Deploy Zero-Downtime // SLA Uptime 99.98%",
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 relative z-10 border-t border-white/[0.08] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal delay={0.1} distance={20}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 border-b border-white/[0.08] pb-5 sm:pb-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-2">
                <Activity className="w-4 h-4" />
                <span>PROFIL & PONDASI ARSITEKTUR</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
                <span>Pondasi Rekayasa Perangkat Lunak</span>
                <span className="text-[11px] sm:text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  Kompetensi Senior
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md mt-2.5 md:mt-0">
              Pilar arsitektur sistem, telemetri operasional, dan rekam jejak capaian karir.
            </p>
          </div>
        </ScrollReveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Executive Summary & Pillars (7 cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Executive Bio Card */}
            <ScrollReveal delay={0.15} distance={20}>
              <div className="glass-panel p-4 sm:p-6 lg:p-8 rounded-3xl border border-white/[0.08] space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-mono font-bold text-white tracking-wide">
                        RINGKASAN EKSEKUTIF ARSITEK
                      </h3>
                      <span className="text-xs font-mono text-slate-400">
                        ID: DVR-BACKEND-CORE
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyBio}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                    title="Salin teks bio"
                  >
                    {copiedBio ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Bio</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Bio Paragraphs */}
                <div className="text-sm text-slate-200 leading-relaxed space-y-3 font-sans">
                  <p>
                    {BIODATA.bio}
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Memiliki dedikasi tinggi dalam memecahkan masalah algoritma kompleks, merancang indeks database yang efisien, dan membangun &quot;mesin tak terlihat&quot; yang menjadi penggerak platform digital modern berkecepatan tinggi tanpa resiko korupsi data.
                  </p>
                </div>

                {/* Quick Credentials Badge */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-white/[0.06] text-xs font-mono text-slate-300">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{BIODATA.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/40 border border-white/[0.06] text-xs font-mono text-slate-300">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ping Server Edge: {livePing}ms</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Three Core Engineering Pillars */}
            <div className="space-y-4">
              <ScrollReveal delay={0.2} distance={15}>
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Tiga Pilar Utama Arsitektur
                </h4>
              </ScrollReveal>
              <StaggerContainer className="grid grid-cols-1 gap-4">
                {pillars.map((pillar) => {
                  const Icon = pillar.icon;
                  return (
                    <StaggerItem key={pillar.id}>
                      <div
                        className="glass-panel p-5 rounded-2xl border border-white/[0.08] hover:border-cyan-500/40 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-black/40 border border-white/[0.08] text-cyan-400">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="text-sm font-bold font-mono text-white leading-tight">{pillar.title}</h5>
                              <span className="text-[10px] font-mono text-slate-400">{pillar.subtitle}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                            {pillar.tag}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed pt-1">
                          {pillar.desc}
                        </p>

                        <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{pillar.metrics}</span>
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            </div>
          </div>

          {/* Right Column: Career Milestones & Impact Timeline (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal delay={0.25} distance={24}>
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  <Briefcase className="w-4 h-4" />
                  <span>REKAM JEJAK & DAMPAK KARIR</span>
                </div>

                <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/[0.08]">
                  {BIODATA.careerMilestones.map((item, idx) => (
                    <div key={idx} className="relative space-y-2">
                      {/* Node Dot */}
                      <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-cyan-500 border-2 border-[#090b14] shadow-[0_0_10px_rgba(6,182,212,0.6)]" />

                      <div>
                        <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wide block">
                          {item.period}
                        </span>
                        <h4 className="text-sm font-bold font-mono text-white leading-snug mt-0.5">
                          {item.role}
                        </h4>
                        <span className="text-xs text-slate-400 font-sans">
                          {item.organization}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {item.description}
                      </p>

                      {/* Highlights */}
                      <ul className="space-y-1 pt-1">
                        {item.highlights.map((h, hIdx) => (
                          <li
                            key={hIdx}
                            className="flex items-start gap-2 text-[11px] text-slate-400 font-sans leading-tight"
                          >
                            <span className="text-cyan-400 font-bold">›</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
