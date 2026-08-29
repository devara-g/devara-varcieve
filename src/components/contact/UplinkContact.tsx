"use client";

import React, { useState, useEffect } from "react";
import { BIODATA } from "@/data/biodata";
import { sounds } from "@/lib/soundEffects";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import {
  Send,
  Mail,
  Copy,
  Check,
  Radio,
  Clock,
  Lock,
  ChevronRight,
  Sparkles,
  Globe,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

export function UplinkContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Tawaran Kerja / Rekrutmen",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState("");

  // Live WIB clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString("id-ID", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WIB (Jakarta)"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const subjectOptions = [
    "Tawaran Kerja / Rekrutmen",
    "Konsultasi Arsitektur Backend",
    "Kolaborasi Proyek Full-Stack",
    "Pertanyaan Teknis Umum",
  ];

  const copyToClipboard = (text: string, field: string) => {
    sounds.playConfirm();
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    setIsSubmitting(true);

    setTimeout(() => {
      sounds.playConfirm();
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "Tawaran Kerja / Rekrutmen", message: "" });
    }, 1000);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 relative z-10 border-t border-white/[0.08] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal delay={0.1} distance={20}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 border-b border-white/[0.08] pb-5 sm:pb-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>SALURAN KOMUNIKASI LANGSUNG</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
                <span>Hubungi Saya</span>
                <span className="text-[11px] sm:text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  Aktif & Terbuka
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md mt-2.5 md:mt-0">
              Terbuka untuk lowongan posisi engineering full-time, konsultasi sistem backend, dan kolaborasi proyek berskala besar.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Direct Communication Hub (5 cols) */}
          <StaggerContainer className="lg:col-span-5 space-y-3.5 sm:space-y-4">
            {/* Operational Clock & Status */}
            <StaggerItem>
              <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 block uppercase">Status Kerja</span>
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-emerald-400">SIAP UNTUK BERKOLABORASI</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 block uppercase">Waktu Lokal</span>
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-white">{currentTimeStr}</span>
                </div>
              </div>
            </StaggerItem>

            {/* Email Card */}
            <StaggerItem>
              <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-mono text-slate-400">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>EMAIL UTAMA</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(BIODATA.email, "email")}
                    className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/80 border border-white/[0.08] text-[11px] font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1"
                  >
                    {copiedField === "email" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
                <a
                  href={`mailto:${BIODATA.email}`}
                  className="text-base font-mono font-bold text-white hover:text-cyan-300 transition-colors block truncate"
                >
                  {BIODATA.email}
                </a>
              </div>
            </StaggerItem>

            {/* GitHub Card */}
            <StaggerItem>
              <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-mono text-slate-400">
                    <GithubIcon className="w-4 h-4 text-slate-200" />
                    <span>PROFIL GITHUB</span>
                  </div>
                  <a
                    href={BIODATA.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/80 border border-white/[0.08] text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                  >
                    <span>Buka Profil</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
                <span className="text-sm font-mono font-bold text-white block">github.com/devara-g</span>
              </div>
            </StaggerItem>

            {/* LinkedIn Card */}
            <StaggerItem>
              <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-mono text-slate-400">
                    <LinkedinIcon className="w-4 h-4 text-cyan-400" />
                    <span>JARINGAN LINKEDIN</span>
                  </div>
                  <a
                    href={BIODATA.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-black/80 border border-white/[0.08] text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                  >
                    <span>Terhubung</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
                <span className="text-sm font-mono font-bold text-white block">linkedin.com/in/devara</span>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Right Column: Transmission Form (7 cols) */}
          <ScrollReveal delay={0.2} distance={24} className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08] space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    Kirim Pesan Langsung
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">ENKRIPSI SSL</span>
              </div>

              {isSuccess ? (
                <div className="p-8 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-mono font-bold text-white">Pesan Berhasil Terkirim</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Terima kasih telah menghubungi saya. Pesan Anda telah diteruskan langsung ke kotak masuk utama Devara.
                    Saya akan merespons dalam waktu 1x24 jam.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.1] text-xs font-mono text-slate-200 mt-2 transition-all"
                  >
                    Kirim Pesan Lainnya
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase tracking-wider text-[10px] block">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="misal: Budi Santoso"
                        className="w-full px-3.5 py-2.5 bg-black/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-400 uppercase tracking-wider text-[10px] block">
                        Alamat Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="budi@perusahaan.com"
                        className="w-full px-3.5 py-2.5 bg-black/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider text-[10px] block">
                      Topik / Subjek
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-black/60 border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    >
                      {subjectOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#090b14] text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400 uppercase tracking-wider text-[10px] block">
                      Detail Pesan
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Jelaskan kebutuhan proyek, cakupan arsitektur, atau tawaran pekerjaan Anda..."
                      className="w-full px-3.5 py-2.5 bg-black/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs"
                  >
                    <Send className={`w-3.5 h-3.5 ${isSubmitting ? "animate-spin" : ""}`} />
                    <span>{isSubmitting ? "MENGIRIMKAN PESAN..." : "KIRIM PESAN SEKARANG"}</span>
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
