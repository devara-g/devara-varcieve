"use client";

import React, { useState, useEffect } from "react";
import { MatrixBackground } from "@/components/ui/MatrixBackground";
import { Navbar } from "@/components/ui/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { SystemArchitecture } from "@/components/architecture/SystemArchitecture";
import { ArchitecturePlayground } from "@/components/playground/ArchitecturePlayground";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { TechArsenal } from "@/components/tech/TechArsenal";
import { DataLogSection } from "@/components/about/DataLogSection";
import { InteractiveCLI } from "@/components/terminal/InteractiveCLI";
import { UplinkContact } from "@/components/contact/UplinkContact";
import { MusicPlayer } from "@/components/audio/MusicPlayer";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { Footer } from "@/components/ui/Footer";
import { PreloaderScreen } from "@/components/ui/PreloaderScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <main className="relative min-h-screen bg-[#07080b] text-slate-100 overflow-x-hidden selection:bg-cyan-500/20 selection:text-white">
      {/* System Boot Preloader */}
      {isLoading && (
        <PreloaderScreen onComplete={() => setIsLoading(false)} />
      )}

      {/* Ambient Lighting & Mesh Background */}
      <MatrixBackground />

      {/* Sticky Navigation Bar */}
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      {/* Main High-Impact Engineering Content Sections */}
      <div className="relative z-10">
        <HeroSection />
        <SystemArchitecture />
        <ArchitecturePlayground />
        <ProjectsSection />
        <TechArsenal />
        <DataLogSection />
        <InteractiveCLI />
        <UplinkContact />
        <Footer />
      </div>

      {/* Floating Vinyl Audio Deck */}
      {!isLoading && <MusicPlayer />}

      {/* Global Command Palette (Cmd+K / Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </main>
  );
}
