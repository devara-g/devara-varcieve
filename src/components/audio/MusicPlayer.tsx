"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { PLAYLIST, Song } from "@/data/songs";
import { sounds } from "@/lib/soundEffects";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Disc3,
  Minimize2,
  Maximize2,
} from "lucide-react";

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSong: Song = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    const audio = new Audio();
    audio.src = currentSong.src;
    audio.preload = "metadata";
    audio.loop = false;
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };

    const handleEnded = () => {
      handleNextTrack();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [currentTrackIndex]);

  const togglePlay = () => {
    sounds.playClick();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  const handleNextTrack = useCallback(() => {
    sounds.playClick();
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setProgress(0);
    setCurrentTime(0);
  }, []);

  const handlePrevTrack = () => {
    sounds.playClick();
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setProgress(0);
    setCurrentTime(0);
  };

  const toggleMute = () => {
    sounds.playClick();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || !duration) return;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(parseFloat(e.target.value));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "m" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 select-none">
      {isMinimized ? (
        /* Sleek Compact Minimized Pill Button */
        <button
          onClick={() => {
            sounds.playClick();
            setIsMinimized(false);
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#0a0d16]/95 border border-white/[0.1] text-white shadow-[0_10px_30px_rgba(0,0,0,0.9)] hover:border-cyan-500/50 hover:scale-105 active:scale-95 transition-all backdrop-blur-xl group"
        >
          {/* Animated Vinyl Icon */}
          <div
            className={`w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center relative overflow-hidden ${
              isPlaying ? "animate-spin" : ""
            }`}
            style={{ animationDuration: "3.5s" }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <Disc3 className="absolute inset-0 w-full h-full text-slate-400 opacity-60" />
          </div>

          <div className="flex flex-col text-left pr-1">
            <span className="text-[11px] font-mono font-bold text-white truncate max-w-[130px] group-hover:text-cyan-300 transition-colors">
              {currentSong.title}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[9px] font-mono text-slate-400">
                {isPlaying ? "PLAYING" : "PAUSED [M]"}
              </span>
            </div>
          </div>

          <Maximize2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors ml-1" />
        </button>
      ) : (
        /* Expanded Obsidian Vinyl Audio Deck */
        <div className="w-[310px] rounded-3xl bg-[#090b14]/95 border border-white/[0.1] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.95)] flex flex-col gap-3.5 backdrop-blur-2xl">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-200">
                AUDIO // VINYL DECK
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                title={isMuted ? "Unmute" : "Mute"}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-slate-300" />
                )}
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setIsMinimized(true);
                }}
                title="Minimize player"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Main Track Display */}
          <div className="flex items-center gap-3.5">
            {/* Spinning Vinyl Record Disc */}
            <div
              className={`w-14 h-14 rounded-full bg-black border-2 border-slate-700 flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden cursor-pointer ${
                isPlaying ? "animate-spin" : ""
              }`}
              style={{ animationDuration: "4s" }}
              onClick={togglePlay}
            >
              <div className="absolute inset-1 rounded-full border border-slate-800" />
              <div className="absolute inset-2.5 rounded-full border border-slate-800" />
              <div className="w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center shadow-inner">
                <div className="w-1 h-1 rounded-full bg-black" />
              </div>
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-mono text-cyan-400 font-semibold uppercase tracking-wider block mb-0.5">
                {currentSong.genre}
              </span>
              <h4 className="text-xs font-mono font-bold text-white truncate">
                {currentSong.title}
              </h4>
              <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Audio Wave Visualizer Bars */}
          <div className="flex items-center justify-center gap-1 h-4 px-2">
            {[40, 75, 55, 90, 60, 100, 45, 80, 65, 95, 50, 70, 85].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-cyan-400/80 rounded-full transition-all duration-200"
                style={{
                  height: isPlaying ? `${Math.max(20, (h * ((i % 3) + 1)) % 100)}%` : "20%",
                  opacity: isPlaying ? 0.9 : 0.3,
                }}
              />
            ))}
          </div>

          {/* Progress Slider */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="100"
              value={progress || 0}
              onChange={handleSeek}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[9px] font-mono text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Player Action Buttons */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[9px] font-mono text-slate-500">
              [M] SHORTCUT
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevTrack}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Previous Track"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={togglePlay}
                className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNextTrack}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Next Track"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
