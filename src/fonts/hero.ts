import localFont from "next/font/local";

export const heroDisplayFont = localFont({
  src: "./black-ops-one-latin-400.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-hero",
  display: "swap",
  fallback: ["Impact", "Arial Black", "sans-serif"],
});
