import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Shared full-screen snap section layout. */
export const SCREEN = "relative snap-start snap-always min-h-svh flex flex-col justify-center pt-20 pb-10 short:pt-16 short:pb-4";
