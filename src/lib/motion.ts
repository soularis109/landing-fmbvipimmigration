import type { Transition } from "motion/react";

export const EASE = [0.16, 1, 0.3, 1] as const;

export const REVEAL: Transition = { duration: 0.9, ease: EASE };

export const SPRING: Transition = { type: "spring", stiffness: 300, damping: 30 };
