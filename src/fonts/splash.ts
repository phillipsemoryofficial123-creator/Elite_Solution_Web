import localFont from "next/font/local";

export const splashSerif = localFont({
  src: "./cormorant-garamond-latin-600.woff2",
  weight: "600",
  style: "normal",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});
