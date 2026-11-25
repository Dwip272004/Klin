import type { Metadata } from "next";
import PricingChart from "@/components/PricingChart";
import { PLANS, FREE_CREDITS, inr, perProfile } from "@/lib/pricing";

export const metadata: Metadata = { title: "Pricing — Kiln" };

const ROWS: [string, (i: number) => string][] = [
  ["Enriched profiles", (i) => (PLANS[i].upTo ? "Up to " : "") + PLANS[i].profiles.toLocaleString("en-IN")],
  ["Price", (i) => inr(PLANS[i].priceInr)],
  ["Per profile", (i) => perProfile(PLANS[i])],
  ["Name, title, company, location", () => "Included"],
  ["Work email where found", () => "Included"],
  ["Refund on not-found rows", () => "Automatic"],
  ["CSV export", () => "Included"],
  ["Run history", () => "Included"],
  ["Free job posts", () => "2 live at once"],
  ["Priority processing", (i) => (i === 0 ? "—" : "Soon")],
  ["Team seats", (i) => (i === 2 ? "Soon" : "—")],
  ["API access", (i) => (i === 2 ? "Soon" : "—")],
];

export default function Pricing() {
  return (
    <div className="container">
      <div className="page-head"><div className="eyebrow">Pricing</div><h1 style={{ fontSize: "clamp(40px,5vw,68px)" }}>Simple packs, in rupees.</h1>
        <p>One-time purchases from ₹5. No subscription, no seat fees. New accounts get {FREE_CREDITS} free profiles to try it.</p></div>
      <PricingChart cta={() => ({ href: "/login?mode=signup", label: "Get started" })} />
      <div className="sec-head" style={{ marginTop: 72 }}><h2>Compare packs</h2></div>
      <div className="cmp-wrap"><table className="compare">
        <thead><tr><th></th>{PLANS.map((p) => <th key={p.id} className={p.featured ? "us" : ""}>{p.name}</th>)}</tr></thead>
        <tbody>{ROWS.map(([label, f]) => (
          <tr key={label}><th>{label}</th>{PLANS.map((p, i) => <td key={p.id} className={p.featured ? "us" : ""}>{f(i)}</td>)}</tr>
        ))}</tbody>
      </table></div>
      <p className="footnote" style={{ marginBottom: 80 }}>Prices in Indian rupees; taxes may apply at checkout. Features marked “Soon” are not available yet.</p>
    </div>
  );
}
