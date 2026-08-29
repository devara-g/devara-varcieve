"use client";

import React, { useState } from "react";
import {
  Globe,
  ShieldCheck,
  Server,
  Layers,
  Database,
  Cpu,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  RefreshCw,
  Clock,
  Sparkles,
  Info,
  Terminal,
} from "lucide-react";
import { sounds } from "@/lib/soundEffects";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";

interface ArchitectureNode {
  id: string;
  name: string;
  category: "Ingress & Edge CDN" | "Core Microservices" | "Cache & Messaging" | "Database & Storage";
  role: string;
  latencySla: string;
  throughput: string;
  concurrencyModel: string;
  failureStrategy: string;
  tech: string[];
  keyTradeoff: string;
  codeSnippet: {
    title: string;
    lang: string;
    code: string;
  };
}

const NODES: ArchitectureNode[] = [
  {
    id: "edge-gateway",
    name: "Edge CDN & Ingress Gateway",
    category: "Ingress & Edge CDN",
    role: "Routing Anycast global, terminasi SSL, pembatasan laju token bucket, dan verifikasi autentikasi JWT.",
    latencySla: "< 5ms P99",
    throughput: "10.000+ RPS",
    concurrencyModel: "Non-blocking Event-Driven (Reverse Proxy / Envoy)",
    failureStrategy: "Mitigasi DDoS otomatis, failover origin ke multi-region edge node.",
    tech: ["Cloudflare Edge", "NGINX", "OpenAPI 3.0", "JWT RS256"],
    keyTradeoff:
      "Verifikasi stateless di edge meminimalkan beban server utama dengan konsekuensi jendela revokasi token pendek (dimitigasi dengan TTL pendek + refresh token).",
    codeSnippet: {
      title: "rateLimiter.ts (Token Bucket)",
      lang: "typescript",
      code: `export async function rateLimitMiddleware(req: Request, redis: Redis) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const key = \`rate_limit:\${ip}\`;
  
  // Sliding window token refill (100 req / menit)
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, 60);
  }
  
  if (current > 100) {
    return new Response(JSON.stringify({ error: "Batas Laju Terlampaui", retryAfter: 60 }), {
      status: 429,
      headers: { "Retry-After": "60", "X-RateLimit-Limit": "100" }
    });
  }
}`,
    },
  },
  {
    id: "core-services",
    name: "Layer Microservices Stateless",
    category: "Core Microservices",
    role: "Eksekusi logika bisnis domain, orkestrasi stream asynchronous I/O, dan penanganan request idempoten.",
    latencySla: "< 14ms P99",
    throughput: "5.000+ RPS",
    concurrencyModel: "Node.js Asynchronous EventLoop + Worker Antrean Laravel",
    failureStrategy: "Pola Circuit Breaker memutus request setelah 5 kegagalan upstream berturut-turut untuk mencegah cascading failure.",
    tech: ["Node.js 22", "TypeScript", "PHP 8.3 / Laravel", "Docker"],
    keyTradeoff:
      "Desain stateless murni memungkinkan auto-scaling horizontal instan tanpa beban sinkronisasi session antar-server.",
    codeSnippet: {
      title: "circuitBreaker.ts (Circuit Breaker)",
      lang: "typescript",
      code: `class CircuitBreaker {
  private failures = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private nextAttempt = Date.now();

  async execute<T>(fn: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) return fallback();
      this.state = 'HALF_OPEN';
    }
    try {
      const res = await fn();
      this.failures = 0;
      this.state = 'CLOSED';
      return res;
    } catch (err) {
      this.failures++;
      if (this.failures >= 5) {
        this.state = 'OPEN';
        this.nextAttempt = Date.now() + 10000; // 10s jeda pendinginan
      }
      return fallback();
    }
  }
}`,
    },
  },
  {
    id: "redis-cache",
    name: "Redis In-Memory & Message Broker",
    category: "Cache & Messaging",
    role: "Offloading query database dengan cache-aside, distributed redlock synchronization, session store, dan antrean event async.",
    latencySla: "< 1.5ms P99",
    throughput: "50.000+ Ops/dtk",
    concurrencyModel: "Single-threaded in-memory event-loop dengan pipeline atomik",
    failureStrategy: "Fallback otomatis saat cache miss ke PostgreSQL master dengan retry exponential backoff.",
    tech: ["Redis 7.x", "BullMQ", "Pub/Sub", "Protokol Redlock"],
    keyTradeoff:
      "Pola cache-aside memberikan akselerasi baca masif; TTL ketat & invalidasi berbasis event mencegah data usang (stale reads).",
    codeSnippet: {
      title: "cacheAside.ts (Cache Atomik)",
      lang: "typescript",
      code: `export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached); // Sub-2ms Cache HIT
  }

  // Cache MISS -> Ambil dari PostgreSQL Master & Cache
  const data = await fetchFn();
  await redis.setex(key, ttlSeconds, JSON.stringify(data));
  return data;
}`,
    },
  },
  {
    id: "relational-db",
    name: "PostgreSQL Master & Read Replicas",
    category: "Database & Storage",
    role: "Sumber kebenaran data relasional ACID, composite B-Tree indexing, partisi tabel, dan isolasi transaksi.",
    latencySla: "< 8ms Indexed Read",
    throughput: "3.500+ QPS",
    concurrencyModel: "Multi-Version Concurrency Control (MVCC) dengan isolasi Read Committed",
    failureStrategy: "Replikasi streaming otomatis dengan promosi replika sekunder saat master down dan recovery point-in-time (PITR).",
    tech: ["PostgreSQL 16", "MySQL 8.0", "PgBouncer Pooling", "Composite Indexes"],
    keyTradeoff:
      "Memisahkan master tulis dan replika baca mengalihkan 80% trafik query, menjaga kestabilan transaksi penting.",
    codeSnippet: {
      title: "schema_optimization.sql",
      lang: "sql",
      code: `-- Indeks komposit B-Tree performa tinggi untuk query sub-5ms
CREATE INDEX CONCURRENTLY idx_attendance_composite 
ON attendance_records (class_id, academic_year, recorded_at DESC)
INCLUDE (student_id, status);

-- Partisi tabel untuk log audit bervolume tinggi
CREATE TABLE audit_logs_2026_q1 PARTITION OF audit_logs
FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');`,
    },
  },
];

export function SystemArchitecture() {
  const [activeNodeId, setActiveNodeId] = useState<string>("edge-gateway");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState<number>(0);

  const activeNode = NODES.find((n) => n.id === activeNodeId) || NODES[0];

  const handleSimulateRequest = () => {
    sounds.playClick();
    setIsSimulating(true);
    setSimStep(1);

    const steps = [
      { step: 1, id: "edge-gateway", time: 400 },
      { step: 2, id: "core-services", time: 900 },
      { step: 3, id: "redis-cache", time: 1400 },
      { step: 4, id: "relational-db", time: 1900 },
    ];

    steps.forEach(({ step, id, time }) => {
      setTimeout(() => {
        setSimStep(step);
        setActiveNodeId(id);
      }, time);
    });

    setTimeout(() => {
      sounds.playConfirm();
      setIsSimulating(false);
      setSimStep(0);
    }, 2500);
  };

  return (
    <section id="architecture" className="py-16 sm:py-24 relative z-10 border-t border-white/[0.08] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal delay={0.1} distance={20}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 border-b border-white/[0.08] pb-5 sm:pb-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-2">
                <Layers className="w-4 h-4" />
                <span>ARSITEKTUR & BLUEPRINT SISTEM</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
                <span>Topologi Terdistribusi</span>
                <span className="text-[11px] sm:text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  Standar Big Tech
                </span>
              </h2>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <button
                onClick={handleSimulateRequest}
                disabled={isSimulating}
                className={`w-full sm:w-auto justify-center px-4 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-all ${
                  isSimulating
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-wait"
                    : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95"
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
                <span>{isSimulating ? `Melacak Request (Langkah ${simStep}/4)...` : "Simulasi Alur Request"}</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Top Interactive Node Graph Ribbon */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {NODES.map((node, idx) => {
            const isSelected = activeNode.id === node.id;
            const isSimActive = isSimulating && simStep === idx + 1;

            return (
              <StaggerItem key={node.id}>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveNodeId(node.id);
                  }}
                  className={`w-full relative text-left p-3.5 sm:p-4 rounded-2xl transition-all border ${
                    isSelected || isSimActive
                      ? "bg-[#111624] border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/30"
                      : "bg-[#0c0e17]/80 hover:bg-[#111420] border-white/[0.08] hover:border-white/20"
                  }`}
                >
                  {/* Node Step Counter */}
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      0{idx + 1} // {node.category}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected || isSimActive
                          ? "bg-cyan-400 animate-ping"
                          : "bg-slate-600"
                      }`}
                    />
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-white font-mono leading-snug">
                    {node.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-2.5 sm:mt-3 text-[10px] sm:text-[11px] font-mono text-cyan-400">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{node.latencySla}</span>
                  </div>
                </button>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Deep Dive Node Specification Card */}
        <ScrollReveal delay={0.25} distance={28}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start glass-panel rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/[0.08]">
            {/* Left Spec Details (6 cols) */}
            <div className="lg:col-span-6 space-y-4 sm:space-y-6">
              <div>
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-cyan-400 font-semibold mb-1 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>SPESIFIKASI LAYER // {activeNode.category}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-mono">
                  {activeNode.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {activeNode.role}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                <div className="p-3 sm:p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
                  <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase block">Target Latensi SLA</span>
                  <span className="text-sm sm:text-base font-mono font-bold text-cyan-300">{activeNode.latencySla}</span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
                  <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase block">Kapasitas Throughput</span>
                  <span className="text-sm sm:text-base font-mono font-bold text-emerald-400">{activeNode.throughput}</span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-xl bg-black/40 border border-white/[0.06] col-span-2">
                  <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase block">Model Konkurensi</span>
                  <span className="text-[11px] sm:text-xs font-mono font-medium text-slate-200">{activeNode.concurrencyModel}</span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-xl bg-black/40 border border-white/[0.06] col-span-2">
                  <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 uppercase block">Strategi Toleransi Kegagalan</span>
                  <span className="text-[11px] sm:text-xs font-mono font-medium text-slate-200">{activeNode.failureStrategy}</span>
                </div>
              </div>

              {/* Architectural Trade-off Note */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs font-sans text-cyan-100/90 leading-relaxed flex items-start gap-2.5">
                <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-mono text-cyan-300 block mb-0.5 uppercase tracking-wide text-[10px]">
                    Trade-Off Arsitektur
                  </strong>
                  {activeNode.keyTradeoff}
                </div>
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
                {activeNode.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-slate-900 border border-white/[0.08] text-[10px] sm:text-xs font-mono text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Code Architecture Blueprint (6 cols) */}
            <div className="lg:col-span-6 w-full">
              <div className="rounded-2xl bg-[#090b12] border border-white/[0.08] overflow-hidden shadow-2xl">
                {/* Window Bar */}
                <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#0d101a] border-b border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <div className="flex gap-1.5 shrink-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-mono text-slate-400 ml-1 sm:ml-2 font-medium truncate">
                      {activeNode.codeSnippet.title}
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400 uppercase font-semibold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 shrink-0">
                    {activeNode.codeSnippet.lang}
                  </span>
                </div>

                {/* Code Editor Body */}
                <pre className="p-3.5 sm:p-5 font-mono text-[10px] sm:text-xs text-slate-200 overflow-x-auto leading-relaxed selection:bg-cyan-500/30">
                  <code>{activeNode.codeSnippet.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
