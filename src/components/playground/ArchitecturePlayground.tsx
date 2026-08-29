"use client";

import React, { useState, useEffect } from "react";
import {
  Gauge,
  Zap,
  Play,
  Database,
  Cpu,
  RefreshCw,
  Clock,
  ShieldAlert,
  CheckCircle,
  BarChart3,
  Sliders,
  Send,
} from "lucide-react";
import { sounds } from "@/lib/soundEffects";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function ArchitecturePlayground() {
  const [activeTab, setActiveTab] = useState<"rate-limiter" | "query-plan" | "api-contract">("rate-limiter");

  // Rate Limiter Simulator State (Token Bucket)
  const MAX_TOKENS = 5;
  const [tokens, setTokens] = useState(5);
  const [rateLogs, setRateLogs] = useState<Array<{ id: string; status: number; message: string; time: string }>>([
    { id: "init", status: 200, message: "Token Bucket Diinisialisasi (Kapasitas 5/5)", time: "00:00:00" },
  ]);

  // Refill tokens every 1.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTokens((prev) => Math.min(MAX_TOKENS, prev + 1));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const sendRateRequest = () => {
    const now = new Date().toLocaleTimeString("id-ID");
    if (tokens > 0) {
      sounds.playClick();
      setTokens((prev) => prev - 1);
      setRateLogs((prev) => [
        {
          id: Math.random().toString(),
          status: 200,
          message: `200 OK — Request Berhasil (Sisa: ${tokens - 1})`,
          time: now,
        },
        ...prev.slice(0, 7),
      ]);
    } else {
      sounds.playGlitch();
      setRateLogs((prev) => [
        {
          id: Math.random().toString(),
          status: 429,
          message: "429 Too Many Requests — Batas Laju Terlampaui",
          time: now,
        },
        ...prev.slice(0, 7),
      ]);
    }
  };

  const burstRequests = () => {
    sounds.playClick();
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        sendRateRequest();
      }, i * 120);
    }
  };

  // Query Plan Simulator State
  const [isIndexed, setIsIndexed] = useState<boolean>(true);
  const [queryExecuting, setQueryExecuting] = useState(false);

  const runQueryPlan = () => {
    sounds.playClick();
    setQueryExecuting(true);
    setTimeout(() => {
      sounds.playConfirm();
      setQueryExecuting(false);
    }, isIndexed ? 250 : 800);
  };

  // API Contract State
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("/api/v1/health");
  const [apiLatency, setApiLatency] = useState<number>(14);
  const [apiOutput, setApiOutput] = useState<string | null>(null);

  const testApiEndpoint = () => {
    sounds.playClick();
    const simulatedLatency = Math.floor(Math.random() * 6) + 11;
    setApiLatency(simulatedLatency);

    setTimeout(() => {
      sounds.playConfirm();
      if (selectedEndpoint === "/api/v1/health") {
        setApiOutput(
          JSON.stringify(
            {
              status: "SEHAT",
              waktu: new Date().toISOString(),
              layanan: {
                database: "PostgreSQL 16 (Terhubung)",
                cache: "Redis 7.2 (Hit Rate: 94.8%)",
                workerPool: "BullMQ 16 Pod Aktif",
              },
              latensiP99Ms: 14.2,
              slaUptime: "99.98%",
            },
            null,
            2
          )
        );
      } else if (selectedEndpoint === "/api/v1/metrics") {
        setApiOutput(
          JSON.stringify(
            {
              kapasitasThroughputRps: 5240,
              koneksiAktif: 312,
              penggunaanMemoriMb: 148.4,
              jedaGarbageCollectorMs: 1.2,
              rasioCacheHit: 0.948,
            },
            null,
            2
          )
        );
      } else {
        setApiOutput(
          JSON.stringify(
            {
              nama: "Muhammad Devara",
              peran: "Arsitek Backend & Sistem Terdistribusi",
              kontak: "defarahermawan@gmail.com",
              github: "https://github.com/devara-g",
              lokasi: "Indonesia (UTC+7 / Remote)",
            },
            null,
            2
          )
        );
      }
    }, simulatedLatency * 20);
  };

  return (
    <section id="playground" className="py-16 sm:py-24 relative z-10 border-t border-white/[0.08] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal delay={0.1} distance={20}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 border-b border-white/[0.08] pb-5 sm:pb-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-2">
                <Sliders className="w-4 h-4" />
                <span>BENCHMARK TEKNIS INTERAKTIF</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
                <span>Sandbox Arsitektur Sistem</span>
                <span className="text-[11px] sm:text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  Simulator Langsung
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md mt-2.5 md:mt-0">
              Demonstrasi langsung algoritma penanganan trafik, optimasi indeks database, dan jaminan latensi API.
            </p>
          </div>
        </ScrollReveal>

        {/* Tab Navigation */}
        <ScrollReveal delay={0.15} distance={15}>
          <div className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8">
            {[
              { id: "rate-limiter", label: "01 // Rate Limiting", icon: Gauge },
              { id: "query-plan", label: "02 // Query Plan SQL", icon: Database },
              { id: "api-contract", label: "03 // Telemetri API", icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab(tab.id as any);
                  }}
                  className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-mono text-[11px] sm:text-xs font-semibold flex items-center gap-2 transition-all border ${
                    isActive
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                      : "bg-[#0d1017] border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Sandbox Content Panels */}
        <ScrollReveal delay={0.2} distance={24}>
          <div className="glass-panel rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/[0.08]">
          {/* TAB 1: Rate Limiter Simulator */}
          {activeTab === "rate-limiter" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Left Column: Visual Bucket & Controls (6 cols) */}
              <div className="lg:col-span-6 space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-mono text-white flex flex-wrap items-center gap-2">
                    <span>Pembatasan Laju (Token Bucket)</span>
                    <span className="text-[9.5px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      Sliding Window
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Melindungi layanan backend dari serangan DoS dan lonjakan trafik mendadak. Setiap request mengonsumsi 1 token.
                    Token terisi kembali otomatis 1 token tiap 1.5 detik hingga kapasitas penuh.
                  </p>
                </div>

                {/* Token Meter Display */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-black/50 border border-white/[0.08] space-y-2.5 sm:space-y-3">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono">
                    <span className="text-slate-400">Reservoir Token:</span>
                    <span className="font-bold text-cyan-400">
                      {tokens} / {MAX_TOKENS} Token
                    </span>
                  </div>

                  {/* Token Blocks */}
                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2 h-7">
                    {Array.from({ length: MAX_TOKENS }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-lg transition-all duration-300 flex items-center justify-center text-[9px] sm:text-[10px] font-mono font-bold ${
                          i < tokens
                            ? "bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                            : "bg-slate-900 border border-white/[0.08] text-slate-600"
                        }`}
                      >
                        {i < tokens ? "SIAP" : "KOSONG"}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trigger Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                  <button
                    onClick={sendRateRequest}
                    className="justify-center px-4 sm:px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim 1 Request</span>
                  </button>

                  <button
                    onClick={burstRequests}
                    className="justify-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.1] text-slate-200 font-mono text-xs font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tembak 6 Request</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Live Event Stream Terminal (6 cols) */}
              <div className="lg:col-span-6 w-full">
                <div className="rounded-2xl bg-[#090b12] border border-white/[0.08] overflow-hidden shadow-xl">
                  <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#0d101a] border-b border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Log Ingress Gateway</span>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      REAL-TIME
                    </span>
                  </div>

                  <div className="p-3 sm:p-4 font-mono text-xs space-y-2 h-[200px] sm:h-[220px] overflow-y-auto">
                    {rateLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`flex items-start gap-2 p-2 rounded-lg border text-[10.5px] sm:text-[11px] ${
                          log.status === 200
                            ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-300"
                            : "bg-rose-950/20 border-rose-500/20 text-rose-300"
                        }`}
                      >
                        <span className="text-slate-500 text-[9.5px] shrink-0">{log.time}</span>
                        <span className="font-semibold break-words">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SQL Query Plan & Index Tuning */}
          {activeTab === "query-plan" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Controls & Comparison (6 cols) */}
              <div className="lg:col-span-6 space-y-4 sm:space-y-5">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
                    <span>Optimasi Query Plan Database</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    Visualisasi pengaruh Composite B-Tree Index pada 50.000+ baris data absensi. Aktifkan atau nonaktifkan index
                    untuk membandingkan waktu eksekusi dan pembacaan memori buffer.
                  </p>
                </div>

                {/* Index Toggle Switch */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-black/50 border border-white/[0.08] gap-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">
                      {isIndexed ? "Composite B-Tree Index" : "Tanpa Index (Seq Scan)"}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 block mt-0.5">
                      {isIndexed ? "idx_attendance (class_id, created_at)" : "Full Table Scan pada disk"}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      setIsIndexed(!isIndexed);
                    }}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all text-center ${
                      isIndexed
                        ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    }`}
                  >
                    {isIndexed ? "INDEX AKTIF" : "INDEX MATI"}
                  </button>
                </div>

                {/* Execution Stats */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <div className="p-3 sm:p-4 rounded-xl bg-black/40 border border-white/[0.06]">
                    <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase block">Waktu Eksekusi</span>
                    <span
                      className={`text-xl sm:text-2xl font-mono font-black ${
                        isIndexed ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {isIndexed ? "2.4 ms" : "438.2 ms"}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 block mt-0.5">
                      {isIndexed ? "99.4% Lebih Cepat" : "Bottleneck Disk I/O"}
                    </span>
                  </div>

                  <div className="p-3 sm:p-4 rounded-xl bg-black/40 border border-white/[0.06]">
                    <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase block">Shared Buffers</span>
                    <span
                      className={`text-xl sm:text-2xl font-mono font-black ${
                        isIndexed ? "text-cyan-300" : "text-amber-400"
                      }`}
                    >
                      {isIndexed ? "4 Hal (32 KB)" : "8.420 Hal (65MB)"}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono text-slate-500 block mt-0.5">
                      {isIndexed ? "Hemat Memori" : "Beban I/O Tinggi"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={runQueryPlan}
                  disabled={queryExecuting}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2"
                >
                  <Play className={`w-3.5 h-3.5 ${queryExecuting ? "animate-spin" : ""}`} />
                  <span>{queryExecuting ? "Menganalisis Rencana..." : "Jalankan EXPLAIN ANALYZE"}</span>
                </button>
              </div>

              {/* Right SQL Output (6 cols) */}
              <div className="lg:col-span-6 w-full">
                <div className="rounded-2xl bg-[#090b12] border border-white/[0.08] overflow-hidden shadow-xl">
                  <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#0d101a] border-b border-white/[0.08] flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Output PostgreSQL EXPLAIN</span>
                    <span className="text-[9px] sm:text-[10px] text-cyan-400 uppercase font-semibold">PostgreSQL 16</span>
                  </div>

                  <pre className="p-3.5 sm:p-4 font-mono text-[10px] sm:text-[11px] text-slate-200 overflow-x-auto leading-relaxed h-[240px] sm:h-[270px]">
                    {isIndexed ? (
                      <code>
                        {`-> Index Scan using idx_attendance on attendance_records
   (cost=0.42..8.44 rows=42 width=64) (actual time=0.082..2.412 rows=42 loops=1)
   Index Cond: (class_id = 'PPLG-1' AND recorded_at >= '2026-01-01')
   Buffers: shared hit=4 read=0
Planning Time: 0.124 ms
Execution Time: 2.412 ms

[BERHASIL: Eksekusi sub-3ms dengan Index Scan optimal]`}
                      </code>
                    ) : (
                      <code>
                        {`-> Seq Scan on attendance_records
   (cost=0.00..8420.00 rows=42 width=64) (actual time=24.120..438.200 rows=42 loops=1)
   Filter: ((class_id = 'PPLG-1') AND (recorded_at >= '2026-01-01'))
   Rows Removed by Filter: 49958
   Buffers: shared hit=120 read=8300
Planning Time: 0.145 ms
Execution Time: 438.200 ms

[PERINGATAN: Sequential Scan pada 50.000 baris. Beban I/O tinggi]`}
                      </code>
                    )}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: API Contract & Telemetry */}
          {activeTab === "api-contract" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Selector (5 cols) */}
              <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-mono text-white">Inspektur Endpoint API</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Uji endpoint telemetri langsung, periksa header caching HTTP, dan verifikasi garansi latensi sub-20ms.
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    { path: "/api/v1/health", method: "GET", desc: "Kesehatan cluster & database" },
                    { path: "/api/v1/metrics", method: "GET", desc: "Throughput & telemetri memori" },
                    { path: "/api/v1/engineer", method: "GET", desc: "Metadata engineer & spesifikasi bio" },
                  ].map((ep) => (
                    <button
                      key={ep.path}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedEndpoint(ep.path);
                        setApiOutput(null);
                      }}
                      className={`w-full text-left p-2.5 sm:p-3 rounded-xl border font-mono transition-all ${
                        selectedEndpoint === ep.path
                          ? "bg-cyan-500/10 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                          : "bg-black/30 border-white/[0.08] hover:bg-black/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                          {ep.method}
                        </span>
                        <span className="text-xs text-white font-bold">{ep.path}</span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 block mt-1">{ep.desc}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={testApiEndpoint}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Request Langsung</span>
                </button>
              </div>

              {/* Right Output Console (7 cols) */}
              <div className="lg:col-span-7 w-full">
                <div className="rounded-2xl bg-[#090b12] border border-white/[0.08] overflow-hidden shadow-xl">
                  {/* Console Header Bar */}
                  <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#0d101a] border-b border-white/[0.08] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-emerald-400 font-bold">200 OK</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-cyan-300">{apiLatency}ms</span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">X-Cache: HIT</span>
                  </div>

                  {/* Response Body */}
                  <pre className="p-3.5 sm:p-4 font-mono text-[10.5px] sm:text-xs text-slate-200 overflow-x-auto leading-relaxed h-[220px] sm:h-[240px]">
                    {apiOutput ? (
                      <code>{apiOutput}</code>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs italic">
                        Klik &quot;Kirim Request Langsung&quot; untuk mengeksekusi
                      </div>
                    )}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
