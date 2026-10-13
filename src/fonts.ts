import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { heroDisplayFont } from "@/fonts/hero";

export { heroDisplayFont };

export const headFont = Bricolage_Grotesque({
  variable: "--font-head",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

export const bodyFont = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
