"use client";

import React, { useState, useEffect } from "react";
import { sounds } from "@/lib/soundEffects";
import { Cpu } from "lucide-react";

interface PreloaderScreenProps {
  onComplete: () => void;
}

export function PreloaderScreen({ onComplete }: PreloaderScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const bootLogs = [
    "MEMULAI RUNTIME TERDISTRIBUSI...",
    "MEMUAT MODUL CLUSTER [NODE.JS // LARAVEL]...",
    "MENGHUBUNGKAN ENGINE DATABASE [POSTGRESQL // REDIS]...",
    "MENYIAPKAN TELEMETRI & JARINGAN HIGH-SPEED...",
    "PLATFORM ARSITEKTUR DEVARA SIAP [200 OK]",
  ];

  useEffect(() => {
    sounds.playHover();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.floor(Math.random() * 10) + 6;
        const nextVal = Math.min(100, prev + increment);

        if (nextVal > 80) setCurrentStep(4);
        else if (nextVal > 60) setCurrentStep(3);
        else if (nextVal > 35) setCurrentStep(2);
        else if (nextVal > 15) setCurrentStep(1);

        return nextVal;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      sounds.playConfirm();
      const exitTimer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 400);
      }, 250);

      return () => clearTimeout(exitTimer);
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#07080b] flex flex-col items-center justify-center select-none transition-all duration-400 ${
        isFadingOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 space-y-6">
        {/* Logo */}
        <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <Cpu className="w-6 h-6" />
        </div>

        {/* Center Typography */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black font-mono tracking-widest text-white">
            MUHAMMAD DEVARA
          </h1>
          <p className="text-xs font-mono text-cyan-400 font-semibold tracking-wider">
            ARSITEK BACKEND & SISTEM TERDISTRIBUSI
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="w-full space-y-2 pt-2">
          <div className="relative w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/[0.08]">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-75 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 truncate max-w-[260px]">
              {bootLogs[currentStep]}
            </span>
            <span className="text-cyan-400 font-bold ml-2">
              {progress.toString().padStart(3, "0")}%
            </span>
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={() => {
            sounds.playClick();
            setIsFadingOut(true);
            setTimeout(onComplete, 200);
          }}
          className="text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors pt-2 tracking-widest uppercase"
        >
          [ LEWATI INISIALISASI ]
        </button>
      </div>

      <div className="absolute bottom-6 left-0 right-0 px-8 flex justify-between items-center text-[10px] font-mono text-slate-600">
        <span>STATUS: 200 OK</span>
        <span>LATENSI: 12ms // STABIL</span>
      </div>
    </div>
  );
}
