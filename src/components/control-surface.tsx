"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";

type SharedControlProps = {
  children: ReactNode;
  className?: string;
};

type ControlButtonProps = SharedControlProps &
  Omit<HTMLMotionProps<"button">, "children" | "className">;

type ControlLinkProps = SharedControlProps &
  Omit<HTMLMotionProps<"a">, "children" | "className">;

const controlTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 30,
};

export function ControlButton({ children, className = "", ...props }: ControlButtonProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      {...props}
      className={`control-surface ${className}`}
      whileHover={reducedMotion ? undefined : { y: -2 }}
      whileTap={reducedMotion ? undefined : { y: 1, scale: 0.985 }}
      transition={controlTransition}
    >
      {children}
    </motion.button>
  );
}

export function ControlLink({ children, className = "", ...props }: ControlLinkProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.a
      {...props}
      className={`control-surface ${className}`}
      whileHover={reducedMotion ? undefined : { y: -2 }}
      whileTap={reducedMotion ? undefined : { y: 1, scale: 0.985 }}
      transition={controlTransition}
    >
      {children}
    </motion.a>
  );
}
