"use client";

import React, { useState, useRef, useEffect } from "react";
import { BIODATA } from "@/data/biodata";
import { sounds } from "@/lib/soundEffects";
import { Terminal as TerminalIcon, CornerDownLeft, Sparkles, Loader2, Copy, Check } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface CommandLog {
  id: string;
  command: string;
  isAiMode?: boolean;
  isLoading?: boolean;
  output: React.ReactNode;
}

export function InteractiveCLI() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<ChatMessage[]>([]);

  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: "init-1",
      command: "devara --version",
      output: (
        <div className="text-slate-200">
          <span className="text-emerald-400 font-bold">DEVARA_ENGINE_CLI</span> v2.4.0 [Arsitektur: Terdistribusi x86_64]
          <br />
          Ketik <span className="text-cyan-400 font-bold">&quot;help&quot;</span> untuk melihat daftar perintah atau <span className="text-violet-400 font-bold">&quot;ai &lt;pertanyaan&gt;&quot;</span> untuk berdiskusi dengan asisten AI teknis.
        </div>
      ),
    },
  ]);

  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [logs]);

  // Call Live Groq API
  const sendGroqAiMessage = async (userPrompt: string) => {
    setIsAiLoading(true);
    sounds.playClick();

    const newHistory: ChatMessage[] = [
      ...aiChatHistory,
      { role: "user", content: userPrompt },
    ];
    setAiChatHistory(newHistory);

    const tempLogId = Math.random().toString();
    setLogs((prev) => [
      ...prev,
      {
        id: tempLogId,
        command: `ai ${userPrompt}`,
        isAiMode: true,
        isLoading: true,
        output: (
          <div className="flex items-center gap-2 text-violet-300 text-xs font-mono py-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
            <span>[DEVARA_AI // Memproses pertanyaan teknis via Groq Cloud...]</span>
          </div>
        ),
      },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory, userMessage: userPrompt }),
      });

      const data = await res.json();
      const aiReply = data.reply || data.error || "Tidak ada respon yang diterima.";

      setAiChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: aiReply },
      ]);

      sounds.playConfirm();

      setLogs((prev) =>
        prev.map((log) => {
          if (log.id === tempLogId) {
            return {
              ...log,
              isLoading: false,
              output: (
                <div className="text-slate-200 text-xs font-mono leading-relaxed py-1 space-y-1">
                  <div className="flex items-center gap-1.5 text-violet-400 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>DEVARA_AI:</span>
                  </div>
                  <p className="whitespace-pre-wrap pl-4 border-l-2 border-violet-500/40 text-slate-300">
                    {aiReply}
                  </p>
                </div>
              ),
            };
          }
          return log;
        })
      );
    } catch {
      setLogs((prev) =>
        prev.map((log) => {
          if (log.id === tempLogId) {
            return {
              ...log,
              isLoading: false,
              output: (
                <div className="text-rose-400 text-xs font-mono py-1">
                  [NETWORK_ERROR] Gagal terhubung ke layanan AI.
                </div>
              ),
            };
          }
          return log;
        })
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    sounds.playClick();
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");

    if (cmd === "clear" || cmd === "cls") {
      setLogs([]);
      setInput("");
      return;
    }

    if (cmd === "ai") {
      if (!args) {
        setLogs((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            command: trimmed,
            output: (
              <div className="text-amber-300 text-xs font-mono">
                Penggunaan: <span className="text-white font-bold">ai &lt;pertanyaan&gt;</span> (contoh: &quot;ai Bagaimana pengalaman Devara dalam optimasi PostgreSQL?&quot;)
              </div>
            ),
          },
        ]);
        setInput("");
        return;
      }
      sendGroqAiMessage(args);
      setInput("");
      return;
    }

    let outputNode: React.ReactNode = null;

    switch (cmd) {
      case "help":
        outputNode = (
          <div className="text-xs font-mono space-y-1 text-slate-300">
            <div className="text-cyan-400 font-bold">DAFTAR PERINTAH DEVTOOLS:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
              <div><span className="text-emerald-400 font-bold">arch</span> — Lihat topologi arsitektur sistem</div>
              <div><span className="text-emerald-400 font-bold">bench</span> — Lihat benchmark latensi & throughput</div>
              <div><span className="text-emerald-400 font-bold">projects</span> — Daftar studi kasus sistem produksi</div>
              <div><span className="text-emerald-400 font-bold">skills</span> — Inspeksi keahlian teknologi</div>
              <div><span className="text-emerald-400 font-bold">stats</span> — Telemetri & kesehatan server</div>
              <div><span className="text-emerald-400 font-bold">contact</span> — Saluran kontak langsung</div>
              <div><span className="text-violet-400 font-bold">ai &lt;tanya&gt;</span> — Tanya asisten AI teknis Devara</div>
              <div><span className="text-slate-400 font-bold">clear</span> — Bersihkan layar terminal</div>
            </div>
          </div>
        );
        break;

      case "arch":
        outputNode = (
          <div className="text-xs font-mono text-slate-300 space-y-1.5 leading-relaxed">
            <div className="text-cyan-400 font-bold">TOPOLOGI SISTEM TERDISTRIBUSI:</div>
            <div className="p-3 rounded-xl bg-black/50 border border-white/[0.08] text-slate-300 font-mono text-[11px] whitespace-pre">
{`[Client / Trafik Pengguna] 
       │ (Protokol HTTPS / TLS 1.3)
       ▼
[Edge CDN / Cloudflare] ──► [Envoy / NGINX Ingress Gateway]
                                  │ (JWT Auth & Rate Limiter < 5ms)
                                  ▼
                     [Node.js / Laravel Microservices]
                        │                    │
          (Cache-Aside) ▼                    ▼ (Write Master / ACID)
               [Redis Cluster]      [PostgreSQL Primary]
                    │                        │
         (PubSub / Async Queue)              ▼ (Replikasi Streaming)
               [BullMQ]             [Replika Baca Cluster]`}
            </div>
          </div>
        );
        break;

      case "bench":
        outputNode = (
          <div className="text-xs font-mono text-slate-300 space-y-1.5">
            <div className="text-cyan-400 font-bold">TELEMETRI BENCHMARK PRODUKSI:</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-black/40 border border-white/[0.06]">
                <span className="text-slate-500 block">Latensi P99:</span>
                <span className="text-emerald-400 font-bold">&lt; 16ms</span>
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/[0.06]">
                <span className="text-slate-500 block">Throughput:</span>
                <span className="text-cyan-300 font-bold">5.000+ RPS</span>
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/[0.06]">
                <span className="text-slate-500 block">Rasio Cache Hit:</span>
                <span className="text-yellow-400 font-bold">94.8%</span>
              </div>
              <div className="p-2 rounded bg-black/40 border border-white/[0.06]">
                <span className="text-slate-500 block">SLA Uptime:</span>
                <span className="text-emerald-400 font-bold">99.98%</span>
              </div>
            </div>
          </div>
        );
        break;

      case "projects":
        outputNode = (
          <div className="text-xs font-mono text-slate-300 space-y-2">
            <div className="text-cyan-400 font-bold">SISTEM PRODUKSI UNGGULAN:</div>
            {BIODATA.projects.map((p, idx) => (
              <div key={p.id} className="pl-3 border-l-2 border-cyan-500/40">
                <div className="font-bold text-white">0{idx + 1}. {p.title}</div>
                <div className="text-[11px] text-slate-400">{p.summary}</div>
                <div className="text-[10px] text-cyan-300 mt-0.5">Metrik: {p.metrics.latency} // {p.metrics.efficiency}</div>
              </div>
            ))}
          </div>
        );
        break;

      case "skills":
        outputNode = (
          <div className="text-xs font-mono text-slate-300 space-y-1.5">
            <div className="text-cyan-400 font-bold">ARSENAL KEAHLIAN TEKNOLOGI:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
              {BIODATA.skills.map((s) => (
                <div key={s.name} className="flex justify-between pr-4">
                  <span className="text-slate-300">{s.name}</span>
                  <span className="text-cyan-400 font-bold">{s.proficiency}%</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case "stats":
        outputNode = (
          <div className="text-xs font-mono text-slate-300 space-y-1">
            <div className="text-cyan-400 font-bold">STATUS OPERASIONAL CLUSTER:</div>
            <div>Kesehatan: <span className="text-emerald-400 font-bold">{BIODATA.telemetry.systemHealth}</span></div>
            <div>Latensi API: <span className="text-cyan-300 font-bold">{BIODATA.telemetry.apiLatency}</span></div>
            <div>Pod Aktif: <span className="text-slate-200">{BIODATA.telemetry.dockerContainers}</span></div>
            <div>Total Kode: <span className="text-amber-300">{BIODATA.telemetry.linesOfCode}</span></div>
          </div>
        );
        break;

      case "contact":
        outputNode = (
          <div className="text-xs font-mono text-slate-300 space-y-1">
            <div className="text-cyan-400 font-bold">SALURAN KOMUNIKASI LANGSUNG:</div>
            <div>Email: <a href={`mailto:${BIODATA.email}`} className="text-cyan-300 hover:underline">{BIODATA.email}</a></div>
            <div>GitHub: <a href={BIODATA.github} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">{BIODATA.github}</a></div>
            <div>LinkedIn: <a href={BIODATA.linkedin} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline">{BIODATA.linkedin}</a></div>
          </div>
        );
        break;

      default:
        outputNode = (
          <div className="text-rose-400 text-xs font-mono">
            zsh: perintah tidak ditemukan: {cmd}. Ketik <span className="text-cyan-400 font-bold">&quot;help&quot;</span> untuk melihat daftar perintah yang tersedia.
          </div>
        );
    }

    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        command: trimmed,
        output: outputNode,
      },
    ]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx + 1 < history.length ? historyIdx + 1 : historyIdx;
        setHistoryIdx(nextIdx);
        setInput(history[history.length - 1 - nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInput(history[history.length - 1 - nextIdx] || "");
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const available = ["help", "arch", "bench", "projects", "skills", "stats", "contact", "ai", "clear"];
      const match = available.find((c) => c.startsWith(input.toLowerCase()));
      if (match) {
        setInput(match);
      }
    }
  };

  return (
    <section id="terminal" className="py-16 sm:py-24 relative z-10 border-t border-white/[0.08] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal delay={0.1} distance={20}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 border-b border-white/[0.08] pb-5 sm:pb-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-2">
                <TerminalIcon className="w-4 h-4" />
                <span>SHELL DEVTOOLS INTERAKTIF</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight flex flex-wrap items-center gap-2 sm:gap-3">
                <span>Terminal Engineering</span>
                <span className="text-[11px] sm:text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-500/30">
                  Konsol AI & CLI
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-mono text-slate-400 max-w-md mt-2.5 md:mt-0">
              Terminal interaktif dengan fitur autokomplit, diagnostik sistem, dan asisten AI Groq terintegrasi.
            </p>
          </div>
        </ScrollReveal>

        {/* Terminal Window Box */}
        <ScrollReveal delay={0.2} distance={24}>
          <div
            onClick={() => inputRef.current?.focus()}
            className="w-full rounded-2xl sm:rounded-3xl bg-[#090b14] border border-white/[0.1] shadow-2xl overflow-hidden cursor-text"
          >
            {/* Header Bar */}
            <div className="px-3.5 sm:px-5 py-2.5 sm:py-3.5 bg-[#0d101c] border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] sm:text-xs font-mono text-slate-400 ml-1.5 sm:ml-3 font-semibold truncate">
                  devara@jkt-edge-node: ~
                </span>
              </div>

              {/* Quick Action Hints */}
              <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-slate-500">
                <span>[Tab] Autocomplete</span>
                <span>[↑/↓] History</span>
                <span>Ketik &quot;help&quot;</span>
              </div>
            </div>

            {/* Terminal Output Area */}
            <div
              ref={terminalOutputRef}
              className="p-3.5 sm:p-6 font-mono text-[10.5px] sm:text-xs text-slate-200 h-[280px] sm:h-[380px] overflow-y-auto space-y-3 sm:space-y-4 bg-[#070910]"
            >
              {logs.map((log) => (
                <div key={log.id} className="space-y-1 sm:space-y-1.5">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400">
                    <span className="text-cyan-400 font-bold">➜</span>
                    <span className="text-emerald-400 font-semibold">devara@arch:~$</span>
                    <span className="text-white font-medium">{log.command}</span>
                  </div>
                  <div className="pl-3 sm:pl-4">{log.output}</div>
                </div>
              ))}
            </div>

            {/* Terminal Input Line */}
            <div className="px-3.5 sm:px-6 py-2.5 sm:py-4 bg-[#0a0d17] border-t border-white/[0.08] flex items-center gap-2 sm:gap-3">
              <span className="text-cyan-400 font-bold">➜</span>
              <span className="text-emerald-400 font-semibold text-[11px] sm:text-xs font-mono shrink-0">devara:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik 'help' atau 'ai tanya sesuatu...'"
                className="flex-1 bg-transparent text-white font-mono text-[11px] sm:text-xs focus:outline-none placeholder-slate-600 min-w-0"
              />
              <button
                onClick={() => handleCommand(input)}
                className="px-2.5 sm:px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] sm:text-xs font-mono font-bold transition-all flex items-center gap-1 shrink-0"
              >
                <span>JALANKAN</span>
                <CornerDownLeft className="w-3 h-3" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
