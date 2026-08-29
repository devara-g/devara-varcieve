"use client";

import React, { useState, useEffect, useRef } from "react";
import { BIODATA } from "@/data/biodata";
import { sounds } from "@/lib/soundEffects";
import {
  Search,
  Layers,
  Sliders,
  FolderGit2,
  Cpu,
  Terminal,
  Mail,
  ExternalLink,
  Volume2,
  VolumeX,
  X,
  Sparkles,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        sounds.playClick();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const actions = [
    {
      id: "architecture",
      title: "Jelajahi Arsitektur Sistem",
      category: "Navigasi",
      icon: Layers,
      action: () => {
        window.location.hash = "#architecture";
        onClose();
      },
    },
    {
      id: "benchmarks",
      title: "Jalankan Benchmark & Simulator",
      category: "Navigasi",
      icon: Sliders,
      action: () => {
        window.location.hash = "#playground";
        onClose();
      },
    },
    {
      id: "projects",
      title: "Lihat Studi Kasus Sistem",
      category: "Navigasi",
      icon: FolderGit2,
      action: () => {
        window.location.hash = "#projects";
        onClose();
      },
    },
    {
      id: "stack",
      title: "Inspeksi Keahlian Stack & Tooling",
      category: "Navigasi",
      icon: Cpu,
      action: () => {
        window.location.hash = "#stack";
        onClose();
      },
    },
    {
      id: "cli",
      title: "Buka Terminal DevTools",
      category: "Navigasi",
      icon: Terminal,
      action: () => {
        window.location.hash = "#terminal";
        onClose();
      },
    },
    {
      id: "contact",
      title: "Kirim Pesan Kontak Langsung",
      category: "Aksi",
      icon: Mail,
      action: () => {
        window.location.hash = "#contact";
        onClose();
      },
    },
    {
      id: "email",
      title: `Salin Alamat Email (${BIODATA.email})`,
      category: "Aksi",
      icon: Mail,
      action: () => {
        navigator.clipboard.writeText(BIODATA.email);
        sounds.playConfirm();
        onClose();
      },
    },
    {
      id: "github",
      title: "Kunjungi Profil GitHub",
      category: "Eksternal",
      icon: ExternalLink,
      action: () => {
        window.open(BIODATA.github, "_blank");
        onClose();
      },
    },
    {
      id: "sound",
      title: "Nyalakan / Matikan Efek Suara",
      category: "Pengaturan",
      icon: Volume2,
      action: () => {
        sounds.toggleSound();
        onClose();
      },
    },
  ];

  const filtered = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-xl bg-[#0a0d16] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] gap-3">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik perintah atau cari bagian portofolio..."
            className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder-slate-500"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sounds.playClick();
                    item.action();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/[0.06] text-slate-400 group-hover:text-cyan-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-semibold text-slate-200 group-hover:text-white block">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">{item.category}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300">
                    ↵ Pilih
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs font-mono text-slate-500">
              Tidak ada perintah yang cocok.
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2.5 bg-[#06080e] border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>[Esc] Tutup</span>
          <span>[↑/↓] Navigasi</span>
          <span>[Enter] Pilih</span>
        </div>
      </div>
    </div>
  );
}
