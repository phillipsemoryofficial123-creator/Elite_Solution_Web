import localFont from "next/font/local";
import { heroDisplayFont } from "@/fonts/hero";

export { heroDisplayFont };

export const headFont = localFont({
  src: "./fonts/bricolage-grotesque-latin.woff2",
  weight: "500 800",
  style: "normal",
  variable: "--font-head",
  display: "swap",
  fallback: ["Segoe UI", "Arial", "sans-serif"],
});

export const bodyFont = localFont({
  src: "./fonts/figtree-latin.woff2",
  weight: "400 600",
  style: "normal",
  variable: "--font-body",
  display: "swap",
  fallback: ["Segoe UI", "Arial", "sans-serif"],
});
