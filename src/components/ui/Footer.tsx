"use client";

import React from "react";
import { BIODATA } from "@/data/biodata";
import { Cpu, ArrowUp, Mail, ShieldCheck } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { sounds } from "@/lib/soundEffects";

export function Footer() {
  const scrollToTop = () => {
    sounds.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-white/[0.08] bg-[#06070a] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Status */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 text-center sm:text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="font-mono font-bold text-white text-sm tracking-wider">
                DEVARA<span className="text-cyan-400">.DEV</span>
              </span>
            </div>
            <span className="hidden sm:inline text-slate-700">|</span>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SISTEM OPERASIONAL (SLA 99.98%)</span>
            </div>
          </div>

          {/* Social Links & Back to Top */}
          <div className="flex items-center gap-3">
            <a
              href={BIODATA.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playClick()}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-slate-300 hover:text-white transition-colors flex items-center justify-center"
              title="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href={BIODATA.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sounds.playClick()}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-slate-300 hover:text-white transition-colors flex items-center justify-center"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${BIODATA.email}`}
              onClick={() => sounds.playClick()}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-slate-300 hover:text-white transition-colors flex items-center justify-center"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-slate-300 hover:text-cyan-400 transition-colors"
              title="Kembali ke Atas"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Copyright & Stack Spec */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-3 text-center">
          <div>
            © {new Date().getFullYear()} MUHAMMAD DEVARA. DIRANCANG UNTUK SKALA BERKONKURENSI TINGGI.
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Next.js 15 App Router // Tailwind CSS // TypeScript</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
