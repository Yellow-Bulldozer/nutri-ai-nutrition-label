"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface BeamProps {
  initialX: number;
  delay: number;
  duration: number;
}

const Beam = ({ initialX, delay, duration }: BeamProps) => {
  return (
    <motion.div
      className="absolute h-px w-1/3 bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-0"
      style={{
        left: `${initialX}%`,
        top: "50%",
      }}
      animate={{
        opacity: [0, 1, 0],
        x: [0, 100],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export function BeamsBackground() {
  const beamDurations = [4, 5, 6, 7, 5.5, 6.5, 4.5, 5.5, 7, 4, 5.5, 6];
  const beamDelays = [0, 0.5, 1, 1.5, 0.8, 1.3, 0.3, 1, 1.2, 0, 0.7, 1.1];
  const beams = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    initialX: (i * 100) / 12,
    delay: beamDelays[i],
    duration: beamDurations[i],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top beams */}
      <div className="absolute top-0 left-0 right-0 h-32">
        {beams.map((beam) => (
          <Beam
            key={`top-${beam.id}`}
            initialX={beam.initialX}
            delay={beam.delay}
            duration={beam.duration}
          />
        ))}
      </div>

      {/* Middle beams (horizontal) */}
      <div className="absolute top-1/3 left-0 right-0 h-1/3">
        {beams.map((beam) => (
          <motion.div
            key={`middle-${beam.id}`}
            className="absolute h-px w-1/4 bg-linear-to-r from-cyan-500 via-emerald-500 to-transparent opacity-0"
            style={{
              left: `${beam.initialX}%`,
              top: `${(beam.id * 100) / 12}%`,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              x: [0, 120],
            }}
            transition={{
              duration: beam.duration,
              delay: beam.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Bottom beams */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        {beams.map((beam) => (
          <motion.div
            key={`bottom-${beam.id}`}
            className="absolute h-px w-1/3 bg-linear-to-r from-transparent via-emerald-500 to-transparent opacity-0"
            style={{
              left: `${beam.initialX}%`,
              bottom: `${(beam.id * 20) % 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              x: [-100, 0],
            }}
            transition={{
              duration: beam.duration + 2,
              delay: beam.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Glowing center points */}
      {beams.map((beam) => (
        <motion.div
          key={`glow-${beam.id}`}
          className="absolute w-2 h-2 rounded-full bg-blue-400 blur-sm"
          style={{
            left: `${beam.initialX}%`,
            top: `${50 + (beam.id - 6) * 6}%`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: beam.duration,
            delay: beam.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Extra diagonal beams for more complexity */}
      <div className="absolute inset-0">
        {beams.slice(0, 6).map((beam) => (
          <motion.div
            key={`diagonal-${beam.id}`}
            className="absolute h-px w-1/5 bg-linear-to-r from-purple-500 via-pink-500 to-transparent opacity-0"
            style={{
              left: `${beam.initialX + 10}%`,
              top: "40%",
              transform: "rotate(-35deg)",
              transformOrigin: "left center",
            }}
            animate={{
              opacity: [0, 0.7, 0],
              x: [0, 150],
            }}
            transition={{
              duration: beam.duration * 1.2,
              delay: beam.delay + 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Vertical accent beams */}
      <div className="absolute inset-0">
        {beams.slice(0, 8).map((beam) => (
          <motion.div
            key={`vertical-${beam.id}`}
            className="absolute w-px h-1/3 bg-linear-to-b from-emerald-500 via-cyan-500 to-transparent opacity-0"
            style={{
              left: `${beam.initialX}%`,
              top: "0%",
            }}
            animate={{
              opacity: [0, 0.5, 0],
              y: [0, 200],
            }}
            transition={{
              duration: beam.duration * 1.5,
              delay: beam.delay + 0.2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}
