export type Plan = {
  id: string; name: string; profiles: number; priceInr: number; blurb: string; featured?: boolean; upTo?: boolean;
  features: { text: string; soon?: boolean }[];
};
export const PLANS: Plan[] = [
  { id: "starter", name: "Starter", profiles: 100, priceInr: 150, blurb: "Try it on a real list.",
    features: [{ text: "100 enriched profiles" }, { text: "Name, title, company, location" }, { text: "Work email where found" },
      { text: "Pay only for rows that return data" }, { text: "CSV export" }, { text: "2 free job posts" }] },
  { id: "growth", name: "Growth", profiles: 500, priceInr: 600, featured: true, blurb: "The sweet spot for a recruiting sprint.",
    features: [{ text: "500 enriched profiles" }, { text: "Everything in Starter" }, { text: "Saved run history" },
      { text: "Auto-refund for not-found rows" }, { text: "Priority processing", soon: true }, { text: "2 free job posts" }] },
  { id: "scale", name: "Scale", profiles: 1000, priceInr: 1500, upTo: true, blurb: "For agencies working several searches.",
    features: [{ text: "Up to 1,000 enriched profiles" }, { text: "Everything in Growth" }, { text: "Team seats", soon: true },
      { text: "API access", soon: true }, { text: "2 free job posts" }] },
];
export const QUICK = { id: "quick", name: "Quick", profiles: 2, priceInr: 5 };
export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
export const perProfile = (p: Plan) => "₹" + (p.priceInr / p.profiles).toFixed(2);
export const FREE_CREDITS = 25;
