"use client";

import React, { useState, useEffect } from "react";
import { BIODATA } from "@/data/biodata";
import { sounds } from "@/lib/soundEffects";
import {
  Cpu,
  Volume2,
  VolumeX,
  Search,
  ChevronRight,
  Menu,
  X,
  Layers,
  Sliders,
  FolderGit2,
  Terminal,
  Send,
} from "lucide-react";

interface NavbarProps {
  onOpenCommandPalette: () => void;
}

export function Navbar({ onOpenCommandPalette }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setSoundEnabled(sounds.isEnabled());

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const newState = sounds.toggleSound();
    setSoundEnabled(newState);
  };

  const navLinks = [
    { label: "ARSITEKTUR", href: "#architecture" },
    { label: "BENCHMARK", href: "#playground" },
    { label: "STUDI KASUS", href: "#projects" },
    { label: "KEAHLIAN", href: "#stack" },
    { label: "TENTANG", href: "#about" },
    { label: "TERMINAL", href: "#terminal" },
    { label: "KONTAK", href: "#contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#07080b]/90 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-2xl"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            onClick={() => sounds.playClick()}
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                DEVARA<span className="text-cyan-400">.DEV</span>
              </span>
              <span className="text-[9px] font-mono text-slate-400 tracking-wider leading-none">
                ARSITEK BACKEND
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 font-mono text-xs">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => sounds.playClick()}
                className="text-slate-400 hover:text-white transition-colors tracking-wider py-1 hover:text-cyan-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2.5">
            {/* Command Palette Trigger */}
            <button
              onClick={() => {
                sounds.playClick();
                onOpenCommandPalette();
              }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] text-slate-300 hover:text-white transition-all text-xs font-mono"
              title="Buka Command Palette (Cmd + K / Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cari</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-white/[0.1] text-[9px] text-slate-400 font-bold">
                ⌘K
              </kbd>
            </button>

            {/* Sound Toggle Button */}
            <button
              onClick={handleSoundToggle}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/[0.08] text-slate-400 hover:text-white transition-colors"
              title={soundEnabled ? "Matikan efek suara" : "Nyalakan efek suara"}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Contact CTA */}
            <a
              href="#contact"
              onClick={() => sounds.playConfirm()}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95"
            >
              <span>REKRUT SAYA</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => {
                sounds.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-white/[0.08] text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/95 backdrop-blur-2xl flex flex-col justify-center px-8 space-y-5 lg:hidden">
          <div className="space-y-4 font-mono text-base">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => {
                  sounds.playClick();
                  setMobileMenuOpen(false);
                }}
                className="block text-slate-300 hover:text-cyan-400 transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-white/[0.1] flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCommandPalette();
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-white/[0.08] text-xs font-mono text-slate-300 flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Command Palette (⌘K)</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-slate-900 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
