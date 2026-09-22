"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

function FloatingPaths({ position, count = 36 }: { position: number; count?: number }) {
    const reduceMotion = useReducedMotion();
    const paths = Array.from({ length: count }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.7 + i * 0.05,
    }));

    return (
        <div className="pointer-events-none absolute inset-0">
            <svg
                className="h-full w-full text-violet"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Плавающие линии фона</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.09 + path.id * 0.013}
                        initial={{ pathLength: 0.3, opacity: 0.7 }}
                        animate={
                            reduceMotion
                                ? { pathLength: 1, opacity: 0.5 }
                                : {
                                      pathLength: 1,
                                      opacity: [0.35, 0.7, 0.35],
                                      pathOffset: [0, 1, 0],
                                  }
                        }
                        transition={
                            reduceMotion
                                ? { duration: 0 }
                                : {
                                      duration: 20 + Math.random() * 10,
                                      repeat: Number.POSITIVE_INFINITY,
                                      ease: "linear",
                                  }
                        }
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths({
    title = "Здоровая улыбка",
    className,
    children,
}: {
    title?: string;
    className?: string;
    children?: ReactNode;
}) {
    const words = title.split(" ");

    return (
        <div
            className={cn(
                "relative flex w-full items-center justify-center overflow-hidden bg-lavender",
                className,
            )}
        >
            <div className="absolute inset-0">
                {/* Every path sweeps from the top left to the bottom right and
                    only fills the lower half, so the sets are mirrored and
                    turned to weave the field around the headline. */}
                <FloatingPaths position={1} />
                <div className="absolute inset-0 -scale-x-100">
                    <FloatingPaths position={-1} />
                </div>
                <div className="absolute inset-0 rotate-180 opacity-40">
                    <FloatingPaths position={1} count={16} />
                </div>
                <div className="absolute inset-0 rotate-180 -scale-x-100 opacity-40">
                    <FloatingPaths position={-1} count={16} />
                </div>
                {/* Warm the lower edge so the drawn lines melt into the page. */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-lavender" />
            </div>

            {/* Soft halo so the copy stays readable where lines cross it. */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(60% 45% at 50% 48%, rgba(240,238,250,0.92) 0%, rgba(240,238,250,0.65) 45%, transparent 75%)",
                }}
            />

            <div className="relative z-10 mx-auto w-full max-w-6xl px-6 text-center md:px-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2 }}
                    className="mx-auto max-w-4xl"
                >
                    <h1 className="mb-7 font-display text-[clamp(2.6rem,8vw,6.5rem)] leading-[1.02] font-black tracking-tight">
                        {words.map((word, wordIndex) => (
                            <span
                                key={wordIndex}
                                className="mr-[0.25em] inline-block last:mr-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 90, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay:
                                                wordIndex * 0.1 +
                                                letterIndex * 0.03,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 25,
                                        }}
                                        className="inline-block bg-gradient-to-b from-ink to-ink/70 bg-clip-text text-transparent"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    {children}
                </motion.div>
            </div>
        </div>
    );
}
