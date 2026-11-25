import PricingChart from "@/components/PricingChart";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Billing() {
  const supabase = await createClient();
  const { data: balance } = await supabase.rpc("my_credit_balance");
  return (
    <>
      <div className="ws-head"><h1>Credits</h1></div>
      <div className="stats"><div className="stat"><div className="k">Available</div><div className="v">{balance ?? 0}</div></div></div>
      <div className="msg ok" style={{ maxWidth: 640 }}>Online payment isn&apos;t connected yet, so packs can&apos;t be bought here for now.</div>
      <div style={{ marginTop: 28 }}><PricingChart cta={() => ({ href: "#", label: "Buy pack (coming soon)", disabled: true })} /></div>
    </>
  );
}
