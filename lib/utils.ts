import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const containerStyles = `bg-card border border-zinc-800`;
export const toggleStyles = `bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 data-[state=on]:text-black data-[state=on]:bg-primary data-[state=on]:border-primary transition-colors ease-in duration-75 cursor-pointer py-2 px-6 text-nowrap flex items-center`;

export const backgroundCSS = {
  backgroundImage: `url("./background-grid.png")`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};
