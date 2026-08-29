"use client";

import React from "react";
import { BIODATA } from "@/data/biodata";
import { sounds } from "@/lib/soundEffects";
import { LanyardCard } from "@/components/lanyard/LanyardCard";
import { CodeTerminalCard } from "@/components/hero/CodeTerminalCard";
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
      className="relative min-h-[92vh] pt-28 pb-16 flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Authoritative Engineering Typography & Metrics */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-20 space-y-6">
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0e121d] border border-white/[0.08] shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-semibold text-slate-200 tracking-wide">
                {BIODATA.status}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white leading-[1.05]">
                <span className="text-slate-400">MUHAMMAD</span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300">
                  DEVARA
                </span>
              </h1>

              <div className="text-lg sm:text-2xl font-mono text-cyan-400 font-bold pt-1 flex items-center gap-2">
                <span className="text-slate-500">//</span>
                <span>{BIODATA.title}</span>
              </div>
            </div>

            {/* Subtitle Value Proposition */}
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-sans">
              {BIODATA.subTitle}
            </p>

            {/* Quantified Engineering Telemetry Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-xl pt-1">
              {BIODATA.engineeringHighlights.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#0b0e17]/90 border border-white/[0.08] flex flex-col justify-between"
                >
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                    {stat.label}
                  </span>
                  <span className="text-base sm:text-lg font-mono font-bold text-cyan-300 mt-1">
                    {stat.metric}
                  </span>
                </div>
              ))}
            </div>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#architecture"
                onClick={() => sounds.playConfirm()}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>JELAJAHI ARSITEKTUR</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#projects"
                onClick={() => sounds.playClick()}
                className="px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/[0.1] text-slate-200 font-mono text-xs font-semibold tracking-wider transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>STUDI KASUS</span>
              </a>

              <a
                href="#playground"
                onClick={() => sounds.playClick()}
                className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] text-slate-300 font-mono text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>BENCHMARK</span>
              </a>

              <a
                href="#contact"
                onClick={() => sounds.playClick()}
                className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] text-slate-300 font-mono text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-slate-400" />
                <span>KONTAK</span>
              </a>
            </div>

            {/* Code / JSON Inspector Terminal Card */}
            <div className="w-full max-w-xl pt-2">
              <CodeTerminalCard />
            </div>
          </div>

          {/* Right Column: High-End Physics Lanyard Nametag */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[660px]">
            <LanyardCard />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden md:flex justify-center pt-8 pb-2">
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
        </div>
      </div>
    </section>
  );
}
