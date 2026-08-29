"use client";

import React from "react";
import { BIODATA } from "@/data/biodata";
import { sounds } from "@/lib/soundEffects";
import { LanyardCard } from "@/components/lanyard/LanyardCard";
import { CodeTerminalCard } from "@/components/hero/CodeTerminalCard";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import {
  ChevronRight,
  Send,
  Layers,
  Sliders,
  ArrowDown,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] pt-20 sm:pt-28 pb-12 sm:pb-16 flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Authoritative Engineering Typography & Metrics */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-20 space-y-5 sm:space-y-6">
            {/* Status Pill Badge */}
            <ScrollReveal delay={0.1} distance={20}>
              <div className="inline-flex items-center gap-2.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#0e121d] border border-white/[0.08] shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] sm:text-xs font-mono font-semibold text-slate-200 tracking-wide">
                  {BIODATA.status}
                </span>
              </div>
            </ScrollReveal>

            {/* Main Headline */}
            <ScrollReveal delay={0.2} distance={24} className="space-y-1.5 sm:space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-mono tracking-tight text-white leading-[1.08]">
                <span className="text-slate-400">MUHAMMAD</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300">
                  DEVARA
                </span>
              </h1>

              <div className="text-base sm:text-2xl font-mono text-cyan-400 font-bold pt-0.5 sm:pt-1 flex items-center gap-2">
                <span className="text-slate-500">//</span>
                <span>{BIODATA.title}</span>
              </div>
            </ScrollReveal>

            {/* Subtitle Value Proposition */}
            <ScrollReveal delay={0.3} distance={20}>
              <p className="text-xs sm:text-base text-slate-300 max-w-xl leading-relaxed font-sans">
                {BIODATA.subTitle}
              </p>
            </ScrollReveal>

            {/* Mobile Lanyard Showcase (Visible on Mobile / Tablet, Hidden on Large Desktop) */}
            <div className="w-full flex lg:hidden justify-center py-2">
              <ScrollReveal delay={0.35} distance={20}>
                <LanyardCard />
              </ScrollReveal>
            </div>

            {/* Quantified Engineering Telemetry Grid */}
            <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-xl pt-1">
              {BIODATA.engineeringHighlights.map((stat, idx) => (
                <StaggerItem key={idx}>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-[#0b0e17]/90 border border-white/[0.08] flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
                    <span className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-wider block">
                      {stat.label}
                    </span>
                    <span className="text-sm sm:text-lg font-mono font-bold text-cyan-300 mt-0.5 sm:mt-1">
                      {stat.metric}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Action CTA Buttons */}
            <ScrollReveal delay={0.45} distance={20}>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 w-full sm:w-auto">
                <a
                  href="#architecture"
                  onClick={() => sounds.playConfirm()}
                  className="w-full sm:w-auto justify-center px-4 sm:px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>JELAJAHI ARSITEKTUR</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="#projects"
                  onClick={() => sounds.playClick()}
                  className="px-4 sm:px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/[0.1] text-slate-200 font-mono text-xs font-semibold tracking-wider transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <span>STUDI KASUS</span>
                </a>

                <a
                  href="#playground"
                  onClick={() => sounds.playClick()}
                  className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] text-slate-300 font-mono text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  <span>BENCHMARK</span>
                </a>

                <a
                  href="#contact"
                  onClick={() => sounds.playClick()}
                  className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] text-slate-300 font-mono text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-slate-400" />
                  <span>KONTAK</span>
                </a>
              </div>
            </ScrollReveal>

            {/* Code / JSON Inspector Terminal Card */}
            <ScrollReveal delay={0.5} distance={24} className="w-full max-w-xl pt-2">
              <CodeTerminalCard />
            </ScrollReveal>
          </div>

          {/* Right Column: Desktop Lanyard Nametag */}
          <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center relative min-h-[680px]">
            <ScrollReveal delay={0.2} distance={30}>
              <LanyardCard />
            </ScrollReveal>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden md:flex justify-center pt-8 pb-2">
          <ScrollReveal delay={0.6} distance={15}>
            <a
              href="#architecture"
              onClick={() => sounds.playClick()}
              className="flex flex-col items-center gap-1 text-slate-500 hover:text-cyan-400 transition-colors"
            >
              <span className="text-[10px] font-mono tracking-widest uppercase">
                GULIR UNTUK MENJELAJAHI
              </span>
              <ArrowDown className="w-4 h-4 animate-bounce text-cyan-400" />
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
