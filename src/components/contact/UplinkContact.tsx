"use client";

import React, { useState, useEffect } from "react";
import { BIODATA } from "@/data/biodata";
import { sounds } from "@/lib/soundEffects";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { FeedbackMessage } from "@/lib/supabase";
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
  Database,
  RefreshCw,
  Terminal,
  Filter,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function UplinkContact() {
  // Feedbacks State
  const [feedbacks, setFeedbacks] = useState<FeedbackMessage[]>([]);
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(true);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);
  const [filterTopic, setFilterTopic] = useState("SEMUA");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "Feedback & Ulasan",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState("");

  // Fetch Feedbacks from API
  const loadFeedbacks = async () => {
    setIsLoadingFeedbacks(true);
    try {
      const res = await fetch("/api/feedback");
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data.feedbacks || []);
        setIsLiveSupabase(Boolean(data.isLiveSupabase));
      }
    } catch (err) {
      console.error("Gagal memuat feedback:", err);
    } finally {
      setIsLoadingFeedbacks(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

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
        }) + " WIB"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const topicOptions = [
    "Feedback & Ulasan",
    "Konsultasi Arsitektur Backend",
    "Tawaran Kerja / Rekrutmen",
    "Kolaborasi Proyek",
    "Pertanyaan Teknis Umum",
  ];

  const copyToClipboard = (text: string, field: string) => {
    sounds.playConfirm();
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    sounds.playClick();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Gagal mengirimkan feedback ke database.");
      }

      const data = await res.json();
      sounds.playConfirm();
      setSubmitSuccess(true);

      // Prepend to local feed immediately
      if (data.feedback) {
        setFeedbacks((prev) => [data.feedback, ...prev]);
      }

      setFormData({
        name: "",
        email: "",
        topic: "Feedback & Ulasan",
        message: "",
      });

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (err: any) {
      sounds.playError();
      setErrorMessage(err.message || "Terjadi kesalahan saat mengirim pesan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter((fb) => {
    if (filterTopic === "SEMUA") return true;
    return fb.topic === filterTopic;
  });

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return (
        d.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) +
        " " +
        d.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } catch {
      return iso;
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 relative z-10 border-t border-white/[0.08] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal delay={0.1} distance={20}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 border-b border-white/[0.08] pb-5 sm:pb-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>KOMUNITAS & TRANSMISI FEEDBACK LIVE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
                <span>Feedback & Chat Transmisi</span>
                <span className="text-[11px] sm:text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-emerald-400" />
                  <span>{isLiveSupabase ? "Supabase Live DB" : "Live Stream Aktif"}</span>
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md mt-2.5 md:mt-0">
              Kirimkan ulasan, tawaran kolaborasi, atau feedback arsitektur. Pesan tersimpan langsung di database dan tayang di terminal log macOS berikut.
            </p>
          </div>
        </ScrollReveal>

        {/* Main Grid: Form (Left) & macOS Terminal Feed (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-8">
          {/* Left Column: Feedback Input Form (5 cols) */}
          <ScrollReveal delay={0.15} distance={24} className="lg:col-span-5 space-y-4">
            <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-white/[0.08] space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    Kirim Feedback Baru
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>SIAP TERIMA</span>
                </div>
              </div>

              {submitSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Transmisi Berhasil Dikirim!</strong>
                    <span>Pesan Anda telah berhasil disimpan dan langsung muncul di terminal log macOS di samping.</span>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Gagal Mengirim</strong>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <label className="text-slate-400 uppercase tracking-wider text-[10px] block">
                    Nama Lengkap / Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="misal: Budi Santoso / Alex"
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 uppercase tracking-wider text-[10px] block">
                    Email Kontak (Opsional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="budi@perusahaan.com (opsional)"
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 uppercase tracking-wider text-[10px] block">
                    Kategori / Topik
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#090b14] border border-white/[0.08] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  >
                    {topicOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#0a0d17] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-400 uppercase tracking-wider text-[10px] block">
                    Isi Pesan / Feedback *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tuliskan ulasan, pertanyaan arsitektur, atau tawaran kerja Anda di sini..."
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/[0.08] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-xs"
                >
                  <Send className={`w-3.5 h-3.5 ${isSubmitting ? "animate-spin" : ""}`} />
                  <span>{isSubmitting ? "MENYIMPAN KE DATABASE..." : "KIRIM TRANSMISI FEEDBACK"}</span>
                </button>
              </form>
            </div>
          </ScrollReveal>

          {/* Right Column: macOS Terminal Log Stream Window (7 cols) */}
          <ScrollReveal delay={0.2} distance={24} className="lg:col-span-7 space-y-3">
            <div className="w-full rounded-2xl sm:rounded-3xl bg-[#090b16] border border-white/[0.12] shadow-2xl overflow-hidden flex flex-col">
              {/* macOS Window Title Bar */}
              <div className="px-4 py-3 bg-[#0d1020] border-b border-white/[0.08] flex items-center justify-between shrink-0">
                {/* macOS Traffic Light Buttons */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] inline-block shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] inline-block shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] inline-block shadow-sm" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-300 ml-2 font-semibold flex items-center gap-1.5 truncate">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="truncate">devara@macos-node: ~ feedback-stream.log</span>
                  </span>
                </div>

                {/* Right Status Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>{feedbacks.length} Pesan Masuk</span>
                  </span>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      loadFeedbacks();
                    }}
                    disabled={isLoadingFeedbacks}
                    title="Segarkan Log Pesan"
                    className="p-1 rounded-lg bg-black/40 hover:bg-slate-800 border border-white/[0.08] text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1 text-[10px] font-mono"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingFeedbacks ? "animate-spin text-cyan-400" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Terminal Topic Filter Bar */}
              <div className="px-4 py-2 bg-[#070810] border-b border-white/[0.06] flex items-center justify-between overflow-x-auto gap-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono shrink-0">
                  <Filter className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-400">FILTER:</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {["SEMUA", "Feedback & Ulasan", "Konsultasi Arsitektur Backend", "Tawaran Kerja / Rekrutmen"].map(
                    (top) => (
                      <button
                        key={top}
                        onClick={() => {
                          sounds.playClick();
                          setFilterTopic(top);
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap transition-all ${
                          filterTopic === top
                            ? "bg-cyan-500 text-slate-950 font-bold"
                            : "bg-slate-900 text-slate-400 hover:text-white"
                        }`}
                      >
                        {top === "Konsultasi Arsitektur Backend"
                          ? "Konsultasi"
                          : top === "Tawaran Kerja / Rekrutmen"
                          ? "Rekrutmen"
                          : top}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Terminal Body / Message Stream Area */}
              <div className="p-4 sm:p-5 font-mono text-xs text-slate-200 h-[380px] sm:h-[420px] overflow-y-auto space-y-3.5 bg-[#05060b]">
                {isLoadingFeedbacks && feedbacks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
                    <span>MENGHUBUNGKAN KE DATABASE FEEDBACK...</span>
                  </div>
                ) : filteredFeedbacks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs space-y-2 italic">
                    <Terminal className="w-6 h-6 text-slate-600" />
                    <span>Belum ada pesan untuk kategori ini. Jadilah yang pertama mengirimkan feedback!</span>
                  </div>
                ) : (
                  filteredFeedbacks.map((fb, idx) => (
                    <div
                      key={fb.id || idx}
                      className="p-3.5 rounded-xl bg-[#090c18] border border-white/[0.06] hover:border-cyan-500/30 transition-all space-y-2 group"
                    >
                      {/* CLI Log Header */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10.5px]">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-cyan-400 font-bold">➜</span>
                          <span className="text-white font-bold tracking-wide truncate">{fb.name}</span>
                          {fb.email && (
                            <span className="text-slate-500 text-[9.5px] truncate">&lt;{fb.email}&gt;</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/20 text-[9px] font-semibold uppercase">
                            {fb.topic}
                          </span>
                          <span className="text-[9.5px] text-slate-400">{formatTimestamp(fb.created_at)}</span>
                        </div>
                      </div>

                      {/* Message Content with Glowing Accent */}
                      <p className="text-xs text-slate-300 font-sans leading-relaxed pl-3 border-l-2 border-cyan-500/40 group-hover:border-cyan-400 transition-colors">
                        {fb.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Terminal Footer Status */}
              <div className="px-4 py-2 bg-[#0a0d1a] border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SINKRONISASI REAL-TIME AKTIF</span>
                </div>
                <span>STATUS: 200 OK</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom Hub: Direct Communication Channels & Live WIB Clock */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Operational WIB Clock */}
          <StaggerItem>
            <div className="glass-panel p-4 rounded-2xl border border-white/[0.08] flex items-center justify-between h-full">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <div>
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">Status Operasional</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">SIAP BERKOLABORASI</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono text-slate-400 block uppercase">WIB Jakarta</span>
                <span className="text-xs font-mono font-bold text-white">{currentTimeStr}</span>
              </div>
            </div>
          </StaggerItem>

          {/* Email Direct Card */}
          <StaggerItem>
            <div className="glass-panel p-4 rounded-2xl border border-white/[0.08] flex flex-col justify-between space-y-2 h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>EMAIL UTAMA</span>
                </div>
                <button
                  onClick={() => copyToClipboard(BIODATA.email, "email")}
                  className="px-2 py-0.5 rounded bg-black/40 hover:bg-black/80 border border-white/[0.08] text-[10px] font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  {copiedField === "email" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
              <a
                href={`mailto:${BIODATA.email}`}
                className="text-xs font-mono font-bold text-white hover:text-cyan-300 transition-colors truncate block"
              >
                {BIODATA.email}
              </a>
            </div>
          </StaggerItem>

          {/* GitHub Card */}
          <StaggerItem>
            <div className="glass-panel p-4 rounded-2xl border border-white/[0.08] flex flex-col justify-between space-y-2 h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <GithubIcon className="w-3.5 h-3.5 text-slate-200" />
                  <span>PROFIL GITHUB</span>
                </div>
                <a
                  href={BIODATA.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-0.5"
                >
                  <span>Buka</span>
                  <ChevronRight className="w-3 h-3" />
                </a>
              </div>
              <span className="text-xs font-mono font-bold text-white truncate block">github.com/devara-g</span>
            </div>
          </StaggerItem>

          {/* LinkedIn Card */}
          <StaggerItem>
            <div className="glass-panel p-4 rounded-2xl border border-white/[0.08] flex flex-col justify-between space-y-2 h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <LinkedinIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>JARINGAN LINKEDIN</span>
                </div>
                <a
                  href={BIODATA.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-0.5"
                >
                  <span>Terhubung</span>
                  <ChevronRight className="w-3 h-3" />
                </a>
              </div>
              <span className="text-xs font-mono font-bold text-white truncate block">linkedin.com/in/devara</span>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
