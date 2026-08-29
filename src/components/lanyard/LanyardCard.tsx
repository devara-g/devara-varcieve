"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BIODATA } from "@/data/biodata";
import { sounds } from "@/lib/soundEffects";
import { GithubIcon } from "@/components/ui/Icons";
import { ShieldCheck } from "lucide-react";

export function LanyardCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Card & Container Geometry Constants
  const cardWidth = 340;
  const cardHeight = 485;
  const containerWidth = 460;
  const containerHeight = 680;
  const svgCenterX = containerWidth / 2; // 230px center

  // Balanced 1.5x Spring & Pendulum Physics Simulation
  const physicsRef = useRef({
    x: 0,
    y: -220,
    vx: 0,
    vy: 1600, // 1.5x natural drop velocity
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

            // Subtle initial snap sound & gentle bounce
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
          p.angularVelocity *= Math.pow(0.91, dt * 60); // Fast settling without wild swinging
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
    const clientX = e.clientX - (rect.left + svgCenterX);
    const clientY = e.clientY - rect.top;

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
    p.targetY = Math.max(50, clientY + p.dragOffset.y);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clientX = e.clientX - (rect.left + svgCenterX);
    const clientY = e.clientY - rect.top;

    const p = physicsRef.current;

    if (p.isPointerDown) {
      p.targetX = clientX + p.dragOffset.x;
      p.targetY = Math.max(40, clientY + p.dragOffset.y);

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

      // Gentle fling inertia
      if (Math.hypot(p.pointerVelocity.vx, p.pointerVelocity.vy) > 150) {
        p.vx = p.pointerVelocity.vx * 0.5;
        p.vy = p.pointerVelocity.vy * 0.5;
        p.angularVelocity = (p.pointerVelocity.vx / 300) * 4;
      }

      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Exact Coordinates Synchronization
  const topAnchorY = -220;
  const leftAnchorX = svgCenterX - 120;
  const rightAnchorX = svgCenterX + 120;

  // The Card center and top edge
  const cardCenterX = svgCenterX + physicsState.x;
  const cardTopY = physicsState.y;

  // Buckle sits exactly 44px above the card
  const buckleTopY = cardTopY - 44;

  // Midpoint curvature control points
  const midLeftX = (leftAnchorX + cardCenterX) / 2 + Math.max(-10, Math.min(10, -physicsState.x * 0.06));
  const midLeftY = (topAnchorY + buckleTopY) / 2 + 12;

  const midRightX = (rightAnchorX + cardCenterX) / 2 + Math.max(-10, Math.min(10, -physicsState.x * 0.06));
  const midRightY = (topAnchorY + buckleTopY) / 2 + 12;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}
      className="relative select-none touch-none overflow-visible mx-auto pt-0"
    >
      {/* SVG Layer: 100% Inset Aligned (Zero Offset / Perfect Pixel Lock) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
        <defs>
          {/* Solid Dark Navy Strap Base Gradient */}
          <linearGradient id="strapDarkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#080d18" />
            <stop offset="30%" stopColor="#131b2e" />
            <stop offset="70%" stopColor="#131b2e" />
            <stop offset="100%" stopColor="#080d18" />
          </linearGradient>

          {/* Vibrant Cyan-Orange-Blue Pattern Gradient for Lower Strap Accent */}
          <linearGradient id="patternStrapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#080d18" />
            <stop offset="40%" stopColor="#0284c7" />
            <stop offset="58%" stopColor="#06b6d4" />
            <stop offset="78%" stopColor="#f59e0b" />
            <stop offset="92%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#080d18" />
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

      {/* Crystal Clear Enlarged Portrait Photo Nametag Card (340px x 485px) */}
      <div
        onPointerDown={handlePointerDown}
        style={{
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          left: `${svgCenterX - cardWidth / 2}px`,
          top: 0,
          transform: `translate3d(${physicsState.x}px, ${physicsState.y}px, 0) rotateZ(${physicsState.angle}deg) rotateY(${physicsState.tiltY}deg) rotateX(${physicsState.tiltX}deg)`,
          transformOrigin: "top center",
          cursor: isDragging ? "grabbing" : "grab",
          transition: isDragging ? "none" : "transform 0.05s ease-out",
        }}
        className="absolute z-20 rounded-3xl bg-[#090d16] border border-white/[0.14] shadow-[0_25px_60px_rgba(0,0,0,0.92),0_0_35px_rgba(6,182,212,0.18)] overflow-hidden flex flex-col justify-between select-none hover:border-cyan-400/80 transition-colors"
      >
        {/* Top Header Bar */}
        <div className="relative w-full h-10 bg-[#0f172a] border-b border-white/[0.08] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-xs font-mono font-bold text-white tracking-wider">
              DEVARA // DEV
            </span>
          </div>

          {/* Slot Hole where Metal Hook penetrates seamlessly */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-3 bg-black rounded-full border border-slate-700 shadow-inner" />

          <span className="text-[9.5px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            KARTU AKSES
          </span>
        </div>

        {/* 100% Crystal Clear Full Portrait Photo (Large & Centered) */}
        <div className="relative flex-1 w-full bg-slate-950 overflow-hidden">
          <Image
            src="/assets/siganteng.jpg"
            alt="Muhammad Devara"
            fill
            className="object-cover object-center"
            priority
            sizes="340px"
          />
        </div>

        {/* Bottom ID Details Bar (Indonesian) */}
        <div className="w-full bg-[#090d16] border-t border-white/[0.08] p-4 flex flex-col gap-1.5 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-mono text-white leading-tight">
                {BIODATA.name}
              </h3>
              <p className="text-xs font-mono text-cyan-400 font-semibold mt-0.5">
                Arsitek Backend & Terdistribusi
              </p>
            </div>

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
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-1.5 border-t border-white/[0.08]">
            <span>ID: DVR-8842-ENG</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              STAFF TERVERIFIKASI
            </span>
          </div>
        </div>
      </div>

      {/* Helper drag indicator */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10 text-[10px] font-mono text-slate-400 bg-slate-950/90 px-3.5 py-1 rounded-full border border-white/[0.08] shadow-md whitespace-nowrap">
        Tarik & Goyang Nametag dengan Kursor
      </div>
    </div>
  );
}
