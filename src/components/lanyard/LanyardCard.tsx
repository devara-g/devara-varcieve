"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BIODATA } from "@/data/biodata";
import { sounds } from "@/lib/soundEffects";
import { GithubIcon } from "@/components/ui/Icons";
import {
  ShieldCheck,
  RotateCw,
  Wifi,
  QrCode,
  Fingerprint,
  Lock,
  ExternalLink,
  Check,
  Sparkles,
  Zap,
} from "lucide-react";

export function LanyardCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Card & Container Geometry Constants
  const cardWidth = 340;
  const cardHeight = 490;
  const containerWidth = 460;
  const containerHeight = isMobile ? 610 : 690;
  const svgCenterX = containerWidth / 2; // 230px center

  // Dynamic Viewport Scale & Device Mode
  useEffect(() => {
    const handleResize = () => {
      const screenW = window.innerWidth;
      const mobile = screenW < 1024;
      setIsMobile(mobile);

      if (screenW < 360) {
        setScale(0.64); // Ultra-narrow screens (320px)
      } else if (screenW < 420) {
        setScale(0.74); // Standard mobile screens (375px - 390px)
      } else if (screenW < 520) {
        setScale(0.84); // Large mobile screens (414px - 480px)
      } else if (screenW < 640) {
        setScale(0.90); // Small tablets
      } else {
        setScale(1.0); // Desktop
      }

      // Adjust physics anchor & rest length dynamically
      const p = physicsRef.current;
      if (mobile) {
        p.anchorY = 10;
        p.restLength = 85;
        p.targetY = 90;
      } else {
        p.anchorY = -150;
        p.restLength = 125;
        p.targetY = 125;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Balanced 1.5x Spring & Pendulum Physics Simulation
  const physicsRef = useRef({
    x: 0,
    y: -220,
    vx: 0,
    vy: 1600,
    angle: 0.04,
    angularVelocity: 0,
    targetX: 0,
    targetY: 125,
    anchorY: -150,
    restLength: 125,
    dragOffset: { x: 0, y: 0 },
    lastPointer: { x: 0, y: 0, time: 0 },
    pointerVelocity: { vx: 0, vy: 0 },
    isPointerDown: false,
    tiltX: -8,
    tiltY: 4,
    hasSnappedOnce: false,
  });

  const [physicsState, setPhysicsState] = useState({
    x: 0,
    y: -220,
    angle: 2.5,
    tiltX: -8,
    tiltY: 4,
  });

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const updatePhysics = (currentTime: number) => {
      const frameDelta = Math.min((currentTime - lastTime) / 1000, 0.033);
      lastTime = currentTime;

      const p = physicsRef.current;
      const subSteps = 6;
      const dt = frameDelta / subSteps;

      for (let step = 0; step < subSteps; step++) {
        if (p.isPointerDown) {
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;

          p.vx = dx * 28;
          p.vy = dy * 28;

          p.x += p.vx * dt;
          p.y += p.vy * dt;

          const targetAngle = Math.max(-0.25, Math.min(0.25, p.x / 240));
          p.angle += (targetAngle - p.angle) * 18 * dt;
          p.angularVelocity = 0;
        } else {
          const dx = p.x;
          const dy = p.y - p.anchorY;
          const currentDist = Math.hypot(dx, dy);

          // 1.5x Realistic Gravity (3000 px/s²)
          const gravity = 3000;
          p.vy += gravity * dt;

          // Ribbon Elastic Tension & Rebound
          if (dy > p.restLength) {
            const delta = currentDist - p.restLength;
            const tension = delta * 460;
            const nx = dx / currentDist;
            const ny = dy / currentDist;
            p.vx -= nx * tension * dt;
            p.vy -= ny * tension * dt;

            if (!p.hasSnappedOnce && p.vy > 400) {
              p.hasSnappedOnce = true;
              p.angularVelocity = (Math.random() > 0.5 ? 4 : -4);
              p.tiltX = 8;
              sounds.playLanyardRelease();
            }
          }

          // Controlled Pendulum Angular Dynamics
          const naturalAngle = Math.max(-0.22, Math.min(0.22, dx / 280));
          const angleDiff = naturalAngle - p.angle;
          p.angularVelocity += angleDiff * 95 * dt;
          p.angularVelocity *= Math.pow(0.91, dt * 60);
          p.angle += p.angularVelocity * dt;

          // Velocity Damping
          p.vx *= Math.pow(0.93, dt * 60);
          p.vy *= Math.pow(0.93, dt * 60);

          p.x += p.vx * dt;
          p.y += p.vy * dt;

          // 3D Perspective Tilt Damping
          p.tiltX += (0 - p.tiltX) * 14 * dt;
          p.tiltY += (0 - p.tiltY) * 14 * dt;
        }
      }

      setPhysicsState({
        x: p.x,
        y: p.y,
        angle: p.angle * (180 / Math.PI),
        tiltX: p.tiltX,
        tiltY: p.tiltY,
      });

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const rect = container.getBoundingClientRect();
    const clientX = (e.clientX - (rect.left + svgCenterX * scale)) / scale;
    const clientY = (e.clientY - rect.top) / scale;

    const p = physicsRef.current;
    p.isPointerDown = true;
    p.hasSnappedOnce = true;
    setIsDragging(true);
    sounds.playLanyardGrab();

    p.dragOffset = {
      x: p.x - clientX,
      y: p.y - clientY,
    };
    p.lastPointer = { x: clientX, y: clientY, time: performance.now() };
    p.pointerVelocity = { vx: 0, vy: 0 };
    p.targetX = clientX + p.dragOffset.x;
    p.targetY = Math.max(isMobile ? 30 : 50, clientY + p.dragOffset.y);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clientX = (e.clientX - (rect.left + svgCenterX * scale)) / scale;
    const clientY = (e.clientY - rect.top) / scale;

    const p = physicsRef.current;

    if (p.isPointerDown) {
      p.targetX = clientX + p.dragOffset.x;
      p.targetY = Math.max(isMobile ? 20 : 40, clientY + p.dragOffset.y);

      const now = performance.now();
      const dt = (now - p.lastPointer.time) / 1000;
      if (dt > 0.004) {
        const velX = (clientX - p.lastPointer.x) / dt;
        const velY = (clientY - p.lastPointer.y) / dt;
        p.pointerVelocity = { vx: velX, vy: velY };

        p.tiltY = Math.max(-14, Math.min(14, (clientX - p.lastPointer.x) * 0.35));
        p.tiltX = Math.max(-14, Math.min(14, -(clientY - p.lastPointer.y) * 0.35));
        p.lastPointer = { x: clientX, y: clientY, time: now };
      }
    } else {
      const dist = Math.hypot(clientX - p.x, clientY - p.y);
      if (dist < 300) {
        p.tiltY = ((clientX - p.x) / 100) * 5;
        p.tiltX = -((clientY - p.y) / 100) * 5;
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const p = physicsRef.current;
    if (p.isPointerDown) {
      p.isPointerDown = false;
      setIsDragging(false);
      sounds.playLanyardRelease();

      if (Math.hypot(p.pointerVelocity.vx, p.pointerVelocity.vy) > 150) {
        p.vx = p.pointerVelocity.vx * 0.5;
        p.vy = p.pointerVelocity.vy * 0.5;
        p.angularVelocity = (p.pointerVelocity.vx / 300) * 4;
      }

      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch { }
    }
  };

  const toggleFlip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sounds.playCardFlip();
    setIsFlipped((prev) => !prev);
  };

  const handleCopyProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playConfirm();
    navigator.clipboard.writeText("https://github.com/devara-g");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Dynamic Anchor Coordinates
  const topAnchorY = isMobile ? 10 : -220;
  const leftAnchorX = isMobile ? svgCenterX - 85 : svgCenterX - 120;
  const rightAnchorX = isMobile ? svgCenterX + 85 : svgCenterX + 120;

  // The Card center and top edge
  const cardCenterX = svgCenterX + physicsState.x;
  const cardTopY = physicsState.y;

  // Buckle sits exactly 44px above the card
  const buckleTopY = cardTopY - 44;

  // Midpoint curvature control points
  const midLeftX = (leftAnchorX + cardCenterX) / 2 + Math.max(-10, Math.min(10, -physicsState.x * 0.06));
  const midLeftY = (topAnchorY + buckleTopY) / 2 + (isMobile ? 4 : 12);

  const midRightX = (rightAnchorX + cardCenterX) / 2 + Math.max(-10, Math.min(10, -physicsState.x * 0.06));
  const midRightY = (topAnchorY + buckleTopY) / 2 + (isMobile ? 4 : 12);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        width: `${containerWidth * scale}px`,
        height: `${containerHeight * scale}px`,
      }}
      className="relative select-none touch-none overflow-visible mx-auto flex items-start justify-center"
    >
      {/* Scaled Inner Wrapper */}
      <div
        style={{
          width: `${containerWidth}px`,
          height: `${containerHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
        className="relative shrink-0 overflow-visible [perspective:1400px]"
      >
        {/* SVG Layer: 100% Inset Aligned */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
          <defs>
            {/* Solid Dark Navy Strap Base Gradient */}
            <linearGradient id="strapDarkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#060913" />
              <stop offset="30%" stopColor="#111827" />
              <stop offset="70%" stopColor="#111827" />
              <stop offset="100%" stopColor="#060913" />
            </linearGradient>

            {/* Vibrant Cyan-Orange-Blue Pattern Gradient for Lower Strap Accent */}
            <linearGradient id="patternStrapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#060913" />
              <stop offset="35%" stopColor="#0284c7" />
              <stop offset="55%" stopColor="#06b6d4" />
              <stop offset="75%" stopColor="#f59e0b" />
              <stop offset="90%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#060913" />
            </linearGradient>

            {/* Quick-Release Buckle Plastic Gradient */}
            <linearGradient id="bucklePlasticGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="25%" stopColor="#1e293b" />
              <stop offset="75%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Chrome Swivel Clasp Metallic Gradient */}
            <linearGradient id="claspMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="30%" stopColor="#f8fafc" />
              <stop offset="60%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>

          {/* On Mobile: Sleek Titanium Top Mount Bar where straps originate */}
          {isMobile && (
            <g transform={`translate(${svgCenterX}, 10)`}>
              <rect
                x="-95"
                y="-6"
                width="190"
                height="10"
                rx="4"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="1"
              />
              <circle cx="-85" cy="-1" r="2.5" fill="#06b6d4" />
              <circle cx="85" cy="-1" r="2.5" fill="#06b6d4" />
              <rect x="-30" y="-4" width="60" height="6" rx="2" fill="#090d16" />
              <text
                x="0"
                y="1"
                fill="#38bdf8"
                fontSize="5.5"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="monospace"
                letterSpacing="0.5"
              >
                SECURITY ACCESS PASS
              </text>
            </g>
          )}

          {/* --- LEFT STRAP (Top-Left down to Buckle Top) --- */}
          <path
            d={`M ${leftAnchorX} ${topAnchorY} Q ${midLeftX} ${midLeftY} ${cardCenterX} ${buckleTopY}`}
            fill="none"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="24"
            strokeLinecap="square"
          />
          <path
            d={`M ${leftAnchorX} ${topAnchorY} Q ${midLeftX} ${midLeftY} ${cardCenterX} ${buckleTopY}`}
            fill="none"
            stroke="url(#strapDarkGrad)"
            strokeWidth="22"
            strokeLinecap="square"
          />
          <path
            d={`M ${leftAnchorX} ${topAnchorY} Q ${midLeftX} ${midLeftY} ${cardCenterX} ${buckleTopY}`}
            fill="none"
            stroke="url(#patternStrapGrad)"
            strokeWidth="22"
            strokeLinecap="square"
            opacity="0.94"
          />
          <path
            d={`M ${leftAnchorX} ${topAnchorY} Q ${midLeftX} ${midLeftY} ${cardCenterX} ${buckleTopY}`}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.8"
            strokeDasharray="4 3"
            opacity="0.9"
          />

          {/* --- RIGHT STRAP (Top-Right down to Buckle Top) --- */}
          <path
            d={`M ${rightAnchorX} ${topAnchorY} Q ${midRightX} ${midRightY} ${cardCenterX} ${buckleTopY}`}
            fill="none"
            stroke="rgba(0,0,0,0.6)"
            strokeWidth="24"
            strokeLinecap="square"
          />
          <path
            d={`M ${rightAnchorX} ${topAnchorY} Q ${midRightX} ${midRightY} ${cardCenterX} ${buckleTopY}`}
            fill="none"
            stroke="url(#strapDarkGrad)"
            strokeWidth="22"
            strokeLinecap="square"
          />
          <path
            d={`M ${rightAnchorX} ${topAnchorY} Q ${midRightX} ${midRightY} ${cardCenterX} ${buckleTopY}`}
            fill="none"
            stroke="url(#patternStrapGrad)"
            strokeWidth="22"
            strokeLinecap="square"
            opacity="0.94"
          />
          <path
            d={`M ${rightAnchorX} ${topAnchorY} Q ${midRightX} ${midRightY} ${cardCenterX} ${buckleTopY}`}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1.8"
            strokeDasharray="4 3"
            opacity="0.9"
          />

          {/* --- QUICK-RELEASE PLASTIC BUCKLE --- */}
          <g transform={`translate(${cardCenterX}, ${buckleTopY})`}>
            {/* Top Strap Ferrule Clamp */}
            <rect
              x="-14"
              y="-3"
              width="28"
              height="7"
              rx="2"
              fill="url(#bucklePlasticGrad)"
              stroke="#020617"
              strokeWidth="0.8"
            />

            {/* Quick-Release Buckle Outer Body */}
            <path
              d="M -13 4 L -13 18 Q -13 22 -10 22 L -4 22 L -4 17 L 4 17 L 4 22 L 10 22 Q 13 22 13 18 L 13 4 Z"
              fill="url(#bucklePlasticGrad)"
              stroke="#0f172a"
              strokeWidth="0.8"
            />

            {/* Buckle Side-Release Indent Slots */}
            <rect x="-15" y="8" width="3.5" height="8" rx="1.5" fill="#090d16" />
            <rect x="11.5" y="8" width="3.5" height="8" rx="1.5" fill="#090d16" />

            {/* Center Release Catch */}
            <rect x="-4" y="9" width="8" height="5" rx="1" fill="#475569" stroke="#0f172a" strokeWidth="0.5" />

            {/* Bottom Loop of Buckle */}
            <rect
              x="-10"
              y="21"
              width="20"
              height="5"
              rx="1.5"
              fill="url(#bucklePlasticGrad)"
              stroke="#0f172a"
              strokeWidth="0.5"
            />
          </g>

          {/* --- LOWER STRAP SEGMENT & SEAMLESS CLASP HOOK INTO CARD HOLE --- */}
          {/* Short Lower Ribbon Band */}
          <g transform={`translate(${cardCenterX}, ${cardTopY - 22})`}>
            <rect
              x="-10"
              y="0"
              width="20"
              height="14"
              rx="1.5"
              fill="#090d16"
              stroke="#06b6d4"
              strokeWidth="0.8"
            />
            <text
              x="0"
              y="10"
              fill="#06b6d4"
              fontSize="7"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
            >
              DVR
            </text>
          </g>

          {/* Metal Swivel Ring & Lobster Clasp Hook entering Card Slot at cardTopY + 12 */}
          <g transform={`translate(${cardCenterX}, ${cardTopY - 8})`}>
            {/* Swivel Ring */}
            <ellipse
              cx="0"
              cy="0"
              rx="7.5"
              ry="4"
              fill="none"
              stroke="url(#claspMetalGrad)"
              strokeWidth="2.5"
            />

            {/* Clasp Body */}
            <path
              d="M -4 0 L -4 10 Q -4 15 0 15 Q 4 15 4 10 L 4 0 Z"
              fill="url(#claspMetalGrad)"
              stroke="#0f172a"
              strokeWidth="0.5"
            />

            {/* Hook Tip Penetrating Directly Through the Card Hole (at cardTopY + 12) */}
            <path
              d="M -4 9 L -1 20 L 1 20 L 4 9 Z"
              fill="url(#claspMetalGrad)"
            />
          </g>
        </svg>

        {/* 3D Flippable Profile Nametag Card Parent (NO OVERFLOW-HIDDEN HERE TO PRESERVE 3D!) */}
        <div
          onPointerDown={handlePointerDown}
          onDoubleClick={toggleFlip}
          style={{
            width: `${cardWidth}px`,
            height: `${cardHeight}px`,
            left: `${svgCenterX - cardWidth / 2}px`,
            top: 0,
            transform: `translate3d(${physicsState.x}px, ${physicsState.y}px, 0) rotateZ(${physicsState.angle}deg) rotateY(${physicsState.tiltY + (isFlipped ? 180 : 0)}deg) rotateX(${physicsState.tiltX}deg)`,
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            cursor: isDragging ? "grabbing" : "grab",
            transition: isDragging
              ? "transform 0.02s linear"
              : "transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
          className="absolute z-20 select-none group"
        >
          {/* ======================= FRONT FACE ======================= */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#0e1322] via-[#090d16] to-[#060810] border border-white/[0.16] shadow-[0_25px_60px_rgba(0,0,0,0.94),0_0_40px_rgba(6,182,212,0.22)] ring-1 ring-cyan-500/20 flex flex-col justify-between"
          >
            {/* Front Holographic Iridescent Glare */}
            <div
              className="absolute inset-0 pointer-events-none z-30 opacity-60 group-hover:opacity-90 transition-opacity"
              style={{
                background: `linear-gradient(${110 + physicsState.tiltY * 3.5
                  }deg, rgba(255,255,255,0) 0%, rgba(6,182,212,0.12) ${35 + physicsState.tiltX * 2
                  }%, rgba(245,158,11,0.15) ${50 + physicsState.tiltX * 2
                  }%, rgba(168,85,247,0.12) ${65 + physicsState.tiltX * 2
                  }%, rgba(255,255,255,0) 100%)`,
                mixBlendMode: "overlay",
              }}
            />

            {/* Top Header Bar */}
            <div className="relative w-full h-11 bg-[#0d1222] border-b border-white/[0.08] flex items-center justify-between px-4 shrink-0 z-20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[11px] font-mono font-black text-white tracking-wider">
                  DEVARA<span className="text-cyan-400">.ID</span>
                </span>
                <Wifi className="w-3 h-3 text-cyan-400/80 rotate-90 ml-0.5" />
              </div>

              {/* Slot Hole where Metal Hook penetrates seamlessly */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-11 h-3 bg-black rounded-full border border-slate-700 shadow-inner flex items-center justify-center">
                <div className="w-8 h-1 bg-slate-900 rounded-full opacity-60" />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-cyan-300 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                  PASS LEVEL 5
                </span>
              </div>
            </div>

            {/* Photo Area with Cyber HUD Elements */}
            <div className="relative flex-1 w-full bg-slate-950 overflow-hidden group/photo">
              <Image
                src="/assets/siganteng.jpg"
                alt="Muhammad Devara"
                fill
                style={{
                  objectPosition: "center 33%",
                }}
                className="object-cover object-center scale-[1.02] group-hover/photo:scale-105 transition-transform duration-500"
                priority
                sizes="340px"
              />

              {/* Cybernetic HUD Corner Brackets */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400/80 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400/80 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400/80 pointer-events-none" />

              {/* Gold EMV Security Chip Hologram */}
              <div className="absolute top-4 left-4 w-9 h-7 rounded-md bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-500 border border-amber-200/60 shadow-[0_2px_8px_rgba(245,158,11,0.4)] p-0.5 flex flex-col justify-between overflow-hidden opacity-90">
                <div className="w-full h-1.5 border-b border-amber-700/60 flex justify-between">
                  <span className="w-2 border-r border-amber-700/60" />
                  <span className="w-2 border-l border-amber-700/60" />
                </div>
                <div className="w-full h-2 border-b border-amber-700/60 flex justify-center items-center">
                  <div className="w-3 h-1.5 rounded-sm bg-amber-600/60" />
                </div>
                <div className="w-full h-1.5 flex justify-between">
                  <span className="w-2 border-r border-amber-700/60" />
                  <span className="w-2 border-l border-amber-700/60" />
                </div>
              </div>

              {/* Floating Telemetry HUD Badge on Photo */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-xl bg-[#090d16]/90 border border-white/[0.12] backdrop-blur-md shadow-lg pointer-events-none">
                <div className="flex items-center gap-2 text-[9.5px] font-mono text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>LATENSI P99: <strong>14.2ms</strong></span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">
                  SLA 99.98%
                </span>
              </div>
            </div>

            {/* Bottom ID Details Bar (Indonesian) */}
            <div className="w-full bg-[#080b14] border-t border-white/[0.08] p-3.5 sm:p-4 flex flex-col gap-2 shrink-0 z-20">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-black font-mono text-white leading-tight tracking-tight">
                    {BIODATA.name}
                  </h3>
                  <p className="text-xs font-mono text-cyan-400 font-bold mt-0.5 flex items-center gap-1.5">
                    <span>Arsitek Backend & Terdistribusi</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={BIODATA.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.1] text-slate-300 hover:text-white transition-colors"
                    title="Profil GitHub"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>

                  {/* Flip Button */}
                  <button
                    onClick={toggleFlip}
                    className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-all hover:scale-105 active:scale-95"
                    title="Balik Kartu (Lihat Kredensial Keamanan)"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Core Stack Tags */}
              <div className="flex flex-wrap items-center gap-1">
                {["GO", "NODE.JS", "POSTGRESQL", "REDIS", "DOCKER"].map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/[0.08] text-[8.5px] font-mono font-bold text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Barcode & Security Clearance */}
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-2 border-t border-white/[0.08]">
                <div className="flex items-center gap-2">
                  {/* SVG Code-128 Mini Barcode */}
                  <div className="flex items-center gap-0.5 h-3">
                    {[2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1].map((w, i) => (
                      <span
                        key={i}
                        className="bg-slate-400 h-full rounded-none inline-block"
                        style={{ width: `${w}px` }}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-300">DVR-8842-ENG</span>
                </div>

                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  TERVERIFIKASI
                </span>
              </div>
            </div>
          </div>

          {/* ======================= BACK FACE (Cyber Security Clearance) ======================= */}
          <div
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#0b0f1d] via-[#080b15] to-[#04060b] border border-white/[0.16] shadow-[0_25px_60px_rgba(0,0,0,0.94),0_0_40px_rgba(6,182,212,0.22)] ring-1 ring-cyan-500/20 p-4 text-white flex flex-col justify-between"
          >
            {/* Back Holographic Iridescent Glare */}
            <div
              className="absolute inset-0 pointer-events-none z-30 opacity-60 group-hover:opacity-90 transition-opacity"
              style={{
                background: `linear-gradient(${110 + physicsState.tiltY * 3.5
                  }deg, rgba(255,255,255,0) 0%, rgba(6,182,212,0.12) ${35 + physicsState.tiltX * 2
                  }%, rgba(245,158,11,0.15) ${50 + physicsState.tiltX * 2
                  }%, rgba(168,85,247,0.12) ${65 + physicsState.tiltX * 2
                  }%, rgba(255,255,255,0) 100%)`,
                mixBlendMode: "overlay",
              }}
            />

            {/* Top Bar with Slot Hole and Magnetic Stripe */}
            <div>
              {/* Slot Hole for Back Side */}
              <div className="relative w-full h-8 flex items-center justify-center mb-2">
                <div className="w-11 h-3 bg-black rounded-full border border-slate-700 shadow-inner flex items-center justify-center">
                  <div className="w-8 h-1 bg-slate-900 rounded-full opacity-60" />
                </div>
              </div>

              {/* Obsidian Magnetic Stripe */}
              <div className="relative w-full h-10 bg-[#05070e] border-y border-white/[0.08] -mx-4 px-4 flex items-center justify-between shadow-inner">
                <div className="w-full h-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-y border-slate-800/80 flex items-center px-4">
                  <span className="text-[7.5px] font-mono text-slate-600 tracking-widest">
                    ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Security Matrix */}
            <div className="space-y-3 py-1">
              {/* Header Title */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-1.5">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-mono font-bold tracking-wider text-white uppercase">
                    KREDENSIAL INFRASTRUKTUR
                  </span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                  ROOT ACCESS
                </span>
              </div>

              {/* QR Code & Biometric Scan Hub */}
              <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#090d18] border border-white/[0.08]">
                {/* Clickable QR Code with Animated Scanning Sweep */}
                <div
                  onClick={handleCopyProfile}
                  className="relative w-18 h-18 rounded-xl bg-black border border-cyan-500/40 p-1.5 flex items-center justify-center shrink-0 shadow-lg cursor-pointer hover:border-cyan-400 transition-colors group/qr"
                  title="Klik untuk salin URL GitHub"
                >
                  <QrCode className="w-full h-full text-cyan-300" />
                  {/* Laser Scanline */}
                  <div className="absolute inset-x-0 h-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)] animate-bounce" />
                  <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover/qr:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <span className="text-[7.5px] font-mono font-bold text-white bg-black/80 px-1 py-0.5 rounded">
                      {copiedLink ? "TERSALIN!" : "SALIN"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 min-w-0 flex-1 font-mono text-[9px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>KLASIFIKASI:</span>
                    <span className="text-white font-bold">LEVEL 5 ROOT</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>PROTOKOL:</span>
                    <span className="text-cyan-300 font-bold">mTLS / ZERO-TRUST</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>NODE EDGE:</span>
                    <span className="text-emerald-400 font-bold">JKT-CLUSTER-01</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>HASH TIKET:</span>
                    <span className="text-slate-300 truncate max-w-[90px]">SHA256:7e9a4</span>
                  </div>
                </div>
              </div>

              {/* Digital Authorized Signature Block */}
              <div className="p-2.5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-1">
                <div className="flex items-center justify-between text-[8.5px] font-mono text-slate-400">
                  <span>TANDA TANGAN OTORISASI:</span>
                  <span className="text-slate-500">DVR-SECURITY-SEAL</span>
                </div>

                <div className="h-9 bg-slate-950/80 rounded-xl border border-white/[0.06] flex items-center justify-between px-3 relative overflow-hidden">
                  {/* Signature Cursive Font */}
                  <span className="text-sm font-serif italic text-cyan-200 tracking-wider">
                    Muhammad Devara
                  </span>
                  <div className="flex items-center gap-1 text-[8px] font-mono text-emerald-400 font-bold">
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>VALID</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Flip Action Button */}
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-[9px] font-mono text-slate-500">
                DEK ENKRIPSI INFRA
              </span>

              <button
                onClick={toggleFlip}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-[10.5px] font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>LIHAT MUKA DEPAN</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Double-Click / Tap Flip Hint Badge */}
        <button
          onClick={toggleFlip}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-center z-30 text-[10px] font-mono text-cyan-300 bg-[#090d16]/95 hover:bg-[#111827] px-4 py-1 rounded-full border border-cyan-500/40 shadow-[0_4px_15px_rgba(0,0,0,0.8)] whitespace-nowrap flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
        >
          <RotateCw className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: "6s" }} />
          <span>{isFlipped ? "Klik untuk Muka Depan" : "Klik untuk Balik Kartu"}</span>
        </button>
      </div>
    </div>
  );
}
