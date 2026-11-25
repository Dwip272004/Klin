import Link from "next/link";
import { PLANS, QUICK, inr, perProfile } from "@/lib/pricing";
import BuyButton from "./BuyButton";

export default function PricingChart({ cta }: { cta: (planId: string) => { href: string; label: string; disabled?: boolean; buy?: boolean } }) {
  const q = cta(QUICK.id);
  return (
    <>
    <div className="quick">
      <div><span className="quick-tag">Quick plan</span>
        <p className="quick-line"><strong>{inr(QUICK.priceInr)}</strong> for {QUICK.profiles} profiles <span className="muted">· {inr(QUICK.priceInr / QUICK.profiles)} each, just need a couple?</span></p></div>
      {q.buy ? <BuyButton planId={QUICK.id} label={q.label} /> : q.disabled ? <button className="btn" disabled>{q.label}</button> : <Link href={q.href} className="btn">{q.label}</Link>}
    </div>
    <div className="plans">
      {PLANS.map((p) => {
        const c = cta(p.id);
        return (
          <article key={p.id} className={"plan" + (p.featured ? " featured" : "")}>
            {p.featured && <span className="plan-flag">Most picked</span>}
            <h3>{p.name}</h3>
            <p className="plan-blurb">{p.blurb}</p>
            <div className="plan-price"><span className="amt">{inr(p.priceInr)}</span><span className="per">one-time</span></div>
            <p className="plan-meta">{p.upTo ? "up to " : ""}{p.profiles.toLocaleString("en-IN")} profiles · {perProfile(p)} each</p>
            {c.buy ? <BuyButton planId={p.id} label={c.label} accent={p.featured} block /> : c.disabled ? <button className="btn block" disabled>{c.label}</button>
              : <Link href={c.href} className={"btn block" + (p.featured ? " accent" : "")}>{c.label}</Link>}
            <ul>{p.features.map((f) => (
              <li key={f.text}><span className="tick" aria-hidden>✓</span>{f.text}{f.soon && <em className="soon">soon</em>}</li>
            ))}</ul>
          </article>
        );
      })}
    </div>
    </>
  );
}
