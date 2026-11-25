export const statusClass = (s: string) =>
  s === "done" || s === "found" || s === "live" || s === "paid" ? "found"
  : s === "running" || s === "queued" || s === "pending" || s === "created" ? "work"
  : s === "failed" || s === "error" ? "bad" : "none";
export const label = (s: string) => s.replace(/_/g, " ");
export const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
export const REASON: Record<string, string> = { grant: "Credits added", hold: "Held for a run", refund: "Refunded", purchase: "Purchase", charge: "Charged", expiry: "Expired", adjustment: "Adjustment" };
