export type Job = {
  id: string; title: string; company: string; location: string | null; remote: boolean; employment_type: string;
  pay_range: string | null; description: string; apply_url: string | null; created_at: string;
};

export function timeAgo(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  const t: [number, string][] = [[31536000, "year"], [2592000, "month"], [604800, "week"], [86400, "day"], [3600, "hour"], [60, "minute"]];
  for (const [sec, name] of t) if (s >= sec) { const n = Math.floor(s / sec); return `${n} ${name}${n > 1 ? "s" : ""} ago`; }
  return "Just now";
}

const TONES = ["#17150f", "#ff5a1f", "#2f5d4b", "#7a5c1e", "#4a463c", "#b3261e"];
export const tone = (name: string) => TONES[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % TONES.length];
export const typeLabel = (t: string) => t.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
