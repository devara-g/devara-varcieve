"use client";

import React, { useState } from "react";
import { BIODATA } from "@/data/biodata";
import { sounds } from "@/lib/soundEffects";
import { Copy, Check, Play, Terminal } from "lucide-react";

export function CodeTerminalCard() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"spec" | "api">("spec");
  const [apiOutput, setApiOutput] = useState<string | null>(null);

  const jsonSnippet = {
    engineer: BIODATA.name,
    role: BIODATA.title,
    lokasi: BIODATA.location,
    kompetensiUtama: [
      "Microservices Backend Berkonkurensi Tinggi",
      "Optimasi Query Database & B-Tree Indexing",
      "Distributed Caching & In-Memory Queues",
      "Deployment CI/CD Multi-Stage Berbasis Docker",
    ],
    slaProduksi: {
      latensiP99: "< 16ms",
      uptime: "99.98%",
      kapasitasThroughput: "5.000+ RPS",
    },
    status: BIODATA.status,
  };

  const handleCopy = () => {
    sounds.playConfirm();
    navigator.clipboard.writeText(JSON.stringify(jsonSnippet, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runApiTest = () => {
    sounds.playClick();
    setApiOutput("Mengeksekusi GET /api/v1/healthcheck...");
    setTimeout(() => {
      sounds.playConfirm();
      setApiOutput(
        JSON.stringify(
          {
            status: 200,
            statusText: "OK",
            timestamp: new Date().toISOString(),
            cluster: "jkt-edge-node-01",
            waktuRespon: "14.2ms",
            cacheHitRate: "94.8%",
            healthyPods: 16,
            pesan: "Sistem operasional. Semua cluster microservices sehat.",
          },
          null,
          2
        )
      );
    }, 350);
  };

  return (
    <div className="w-full rounded-2xl bg-[#090b12] border border-white/[0.08] shadow-[0_15px_35px_rgba(0,0,0,0.6)] overflow-hidden">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-[#0d101a] border-b border-white/[0.08] select-none gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-500/70" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500/70" />
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 font-medium truncate max-w-[90px] sm:max-w-none">
            spec.json
          </span>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab("spec");
            }}
            className={`px-2 sm:px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] font-mono font-semibold transition-all ${
              activeTab === "spec"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            SPESIFIKASI
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab("api");
            }}
            className={`px-2 sm:px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] font-mono font-semibold transition-all flex items-center gap-1 ${
              activeTab === "api"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Play className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
            <span>PING</span>
          </button>
          <button
            onClick={handleCopy}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
            title="Salin JSON"
          >
            {copied ? (
              <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Terminal Content Body */}
      <div className="p-3 sm:p-4 font-mono text-[10.5px] sm:text-xs overflow-x-auto leading-relaxed bg-[#090b12]">
        {activeTab === "spec" && (
          <div className="space-y-1">
            <div className="text-slate-500">{"// Spesifikasi Arsitektur Sistem"}</div>
            <div>
              <span className="text-slate-400">{"{"}</span>
            </div>
            <div className="pl-3 sm:pl-4">
              <span className="text-cyan-400">&quot;engineer&quot;</span>:{" "}
              <span className="text-emerald-400">&quot;{BIODATA.name}&quot;</span>,
            </div>
            <div className="pl-3 sm:pl-4">
              <span className="text-cyan-400">&quot;peran&quot;</span>:{" "}
              <span className="text-emerald-400">&quot;{BIODATA.title}&quot;</span>,
            </div>
            <div className="pl-3 sm:pl-4">
              <span className="text-cyan-400">&quot;core_stack&quot;</span>: [
              <div className="pl-3 sm:pl-4 text-amber-300">
                &quot;Node.js / TypeScript&quot;, &quot;PHP Laravel&quot;, &quot;PostgreSQL&quot;, &quot;Redis&quot;, &quot;Docker&quot;
              </div>
              ],
            </div>
            <div className="pl-3 sm:pl-4">
              <span className="text-cyan-400">&quot;sla_performa&quot;</span>: {"{"}
              <span className="text-slate-300">
                &quot;latensiP99&quot;: <span className="text-emerald-400">&quot;&lt; 16ms&quot;</span>, &quot;kapasitas&quot;: <span className="text-yellow-400">&quot;5k+ RPS&quot;</span>
              </span>
              {"}"},
            </div>
            <div className="pl-3 sm:pl-4">
              <span className="text-cyan-400">&quot;status&quot;</span>:{" "}
              <span className="text-emerald-400">&quot;SIAP_UNTUK_PRODUKSI&quot;</span>
            </div>
            <div>
              <span className="text-slate-400">{"}"}</span>
            </div>
          </div>
        )}

        {activeTab === "api" && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-300 truncate">
                <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 text-[9px] sm:text-[10px] font-bold border border-emerald-500/30">
                  GET
                </span>
                <span className="text-slate-400 truncate">/api/v1/healthcheck</span>
              </div>
              <button
                onClick={runApiTest}
                className="w-full sm:w-auto px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] flex items-center justify-center gap-1 transition-all"
              >
                EKSEKUSI
              </button>
            </div>

            {apiOutput ? (
              <pre className="p-2.5 rounded-xl bg-black/50 text-emerald-400 text-[10px] sm:text-[11px] border border-white/[0.08] whitespace-pre-wrap overflow-x-auto">
                {apiOutput}
              </pre>
            ) : (
              <div className="text-slate-500 italic text-[10px] sm:text-[11px] py-4 text-center">
                Klik &quot;EKSEKUSI&quot; untuk menguji respon telemetri langsung
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
