import PricingChart from "@/components/PricingChart";
import { createClient } from "@/lib/supabase/server";
import { shortDate, statusClass } from "@/lib/ui";
import { razorpayConfigured } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export default async function Billing() {
  const supabase = await createClient();
  const { data: balance } = await supabase.rpc("my_credit_balance");
  const { data: payments } = await supabase.from("payments").select("id,plan_id,credits,amount_paise,status,created_at").order("created_at", { ascending: false }).limit(10);
  const ready = razorpayConfigured() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  return (
    <>
      <div className="ws-head"><div><div className="eyebrow">Billing</div><h1>Credits</h1><p className="muted sub">One credit is one profile lookup. Not-found rows are refunded.</p></div></div>
      <div className="stats"><div className="stat"><div className="k">Available</div><div className="v">{balance ?? 0}</div></div></div>
      {!ready && <div className="msg err" style={{ maxWidth: 640 }}>Online payment isn&apos;t connected yet, so packs can&apos;t be bought for now.</div>}
      <div style={{ marginTop: 28 }}><PricingChart cta={() => (ready ? { href: "#", label: "Buy now", buy: true } : { href: "#", label: "Unavailable", disabled: true })} /></div>
      {payments?.length ? <div className="panel" style={{ marginTop: 28 }}><header>Purchases</header><table className="dt"><tbody>{payments.map((p) => (
        <tr key={p.id}><td>{p.plan_id}</td><td className="mono">+{p.credits}</td><td>₹{p.amount_paise / 100}</td><td><span className={"chip " + statusClass(p.status)}>{p.status}</span></td><td className="muted">{shortDate(p.created_at)}</td></tr>))}</tbody></table></div> : null}
    </>
  );
}
