import Link from "next/link";
import PricingChart from "@/components/PricingChart";
import { FREE_CREDITS } from "@/lib/pricing";

const SAMPLE = [
  { n: 1, name: "Aarav S.", title: "Staff Design Engineer", co: "Northwind Silicon", email: "found" },
  { n: 2, name: "Meera K.", title: "Talent Partner", co: "Orchard Labs", email: "found" },
  { n: 3, name: "Rohan P.", title: "VP Engineering", co: "Tessel Systems", email: "work" },
  { n: 4, name: "Ishita D.", title: "Recruiter", co: "Brightwave", email: "none" },
];
const chip = (s: string) => s === "found" ? <span className="chip found">verified</span> : s === "work" ? <span className="chip work">looking…</span> : <span className="chip none">not found</span>;

const FAQ = [
  ["What do I need to start?", "Just an account. Paste LinkedIn profile URLs (up to 50 per run) and Kiln builds the table for you."],
  ["What does a profile cost?", "Credits come in packs: ₹5 for 2 (quick plan), ₹150 for 100, ₹600 for 500, ₹1,500 for up to 1,000. One credit is one profile run."],
  ["Do I pay for rows that find nothing?", "No. Credits are held when a run starts and refunded automatically for any row that returns no data."],
  ["Is there a subscription?", "No. Packs are one-time purchases in rupees."],
  ["Where does the data come from?", "Kiln looks people up through a third-party data provider. Accuracy varies by profile, which is why not-found rows are free."],
];

export default function Home() {
  return (
    <>
      <div className="container hero">
        <div>
          <div className="eyebrow">Contact enrichment, priced in rupees</div>
          <h1>Turn a list of profile links into a <em>table you can work.</em></h1>
          <p className="lead">Paste LinkedIn URLs. Kiln fills in names, titles, companies and work emails, row by row, and you only pay for the rows that come back with data.</p>
          <div className="cta">
            <Link className="btn accent" href="/login?mode=signup">Start with {FREE_CREDITS} free profiles</Link>
            <Link className="btn ghost" href="/pricing">See pricing</Link>
          </div>
          <p className="fine">No card needed. Quick plan: ₹5 for 2 profiles. Packs from ₹150.</p>
        </div>
        <div className="sheet" aria-label="Sample enrichment table">
          <div className="sheet-top"><span>Recruiter outreach</span><span className="tag">Sample data</span></div>
          <div className="scroll"><table>
            <thead><tr><th></th><th>Name</th><th>Title</th><th>Company</th><th>Work email</th></tr></thead>
            <tbody>{SAMPLE.map((r) => (
              <tr key={r.n}><td className="num">{r.n}</td><td>{r.name}</td><td>{r.title}</td><td>{r.co}</td><td>{chip(r.email)}</td></tr>
            ))}</tbody>
          </table></div>
        </div>
      </div>

      <section className="block" id="how">
        <div className="container">
          <div className="sec-head"><div className="eyebrow">How it works</div><h2>Three steps, one table.</h2></div>
          <div className="steps">
            <div className="step"><span className="n">01</span><h3>Paste your list</h3><p>Drop in up to 50 LinkedIn profile URLs. You see the credit cost before anything runs.</p></div>
            <div className="step"><span className="n">02</span><h3>We enrich each row</h3><p>Every profile is looked up on its own. Rows that return nothing are refunded on the spot.</p></div>
            <div className="step"><span className="n">03</span><h3>Export and reach out</h3><p>Review the table, download a CSV, and post your own open roles on the built-in job board.</p></div>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="container split">
          <div className="sec-head" style={{ marginBottom: 0 }}><div className="eyebrow">Built for recruiters</div><h2>Small tool, fewer surprises.</h2></div>
          <div className="featlist">
            <div className="feat"><h4>Pay for results</h4><p>Credits are held at the start of a run and charged only for rows that return data.</p></div>
            <div className="feat"><h4>Priced in INR</h4><p>One-time packs in rupees. No dollar conversion, no monthly seat fees.</p></div>
            <div className="feat"><h4>A job board included</h4><p>Every account gets 2 free live job posts, with public pages Google can list.</p></div>
            <div className="feat"><h4>Run history</h4><p>Every run is saved as a table you can reopen and export again.</p></div>
          </div>
        </div>
      </section>

      <section className="block" id="compare">
        <div className="container">
          <div className="sec-head"><div className="eyebrow">How Kiln compares</div><h2>Different shape of tool.</h2>
            <p>Clay, Apollo and Lusha are broad platforms billed as monthly subscriptions in dollars. Kiln does one job and sells it by the pack.</p></div>
          <div className="cmp-wrap"><table className="compare">
            <thead><tr><th></th><th className="us">Kiln</th><th>Clay</th><th>Apollo</th><th>Lusha</th></tr></thead>
            <tbody>
              <tr><th>Starting price</th><td className="us">₹5 for 2 profiles, or ₹150 for 100</td><td>From about $185/mo (Launch)</td><td>From about $49/seat/mo (Basic, annual)</td><td>From about $49.90/mo (Starter, monthly)</td></tr>
              <tr><th>How you pay</th><td className="us">One-time packs</td><td>Monthly plan with credits and actions</td><td>Per-seat subscription with credits</td><td>Monthly plan with credits</td></tr>
              <tr><th>Currency</th><td className="us">Indian rupees</td><td>US dollars</td><td>US dollars</td><td>US dollars</td></tr>
              <tr><th>Built for</th><td className="us">Quick list enrichment plus job posting</td><td>Building multi-step data workflows</td><td>Sales prospecting and outreach sequences</td><td>Finding contact details while browsing</td></tr>
              <tr><th>Free job posts</th><td className="us">2 per account</td><td>No</td><td>No</td><td>No</td></tr>
            </tbody>
          </table></div>
          <p className="footnote">Competitor prices are public list prices in USD gathered in November 2026 from third-party roundups and vary by billing cycle. Check each vendor&apos;s site before deciding. Kiln is not affiliated with Clay, Apollo or Lusha.</p>
        </div>
      </section>

      <section className="block" id="pricing">
        <div className="container">
          <div className="sec-head"><div className="eyebrow">Pricing</div><h2>Buy a pack. Use it when you need it.</h2></div>
          <PricingChart cta={() => ({ href: "/login?mode=signup", label: "Get started" })} />
          <p className="free-note">Every new account starts with {FREE_CREDITS} free profiles. <Link href="/pricing">Full pricing details</Link></p>
        </div>
      </section>

      <section className="block">
        <div className="container split">
          <div className="sec-head" style={{ marginBottom: 0 }}><div className="eyebrow">Questions</div><h2>Straight answers.</h2></div>
          <div>{FAQ.map(([q, a]) => (<details key={q}><summary>{q}</summary><p>{a}</p></details>))}</div>
        </div>
      </section>

      <div className="band"><div className="container">
        <h2>Your next list, <em>already a table.</em></h2>
        <Link className="btn accent" href="/login?mode=signup">Start free</Link>
      </div></div>
    </>
  );
}
