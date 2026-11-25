import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { enrichOne, providerConfigured } from "@/lib/enrichment/provider";
import EnrichForm from "./EnrichForm";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LINKEDIN = /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/in\/[^\s/?#]+/i;

async function runEnrichment(formData: FormData) {
  "use server";
  if (!providerConfigured()) redirect("/dashboard/enrich?error=" + encodeURIComponent("Data source not connected yet."));
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const urls = [...new Set(String(formData.get("urls") ?? "").split(/[\s,]+/).filter((u) => LINKEDIN.test(u)).map((u) => u.match(LINKEDIN)![0].replace(/^http:/i, "https:")))];
  const { data: jobId, error } = await supabase.rpc("start_enrichment", { p_name: String(formData.get("name") ?? ""), p_urls: urls });
  if (error || !jobId) redirect("/dashboard/enrich?error=" + encodeURIComponent(error?.message ?? "Could not start run"));

  const admin = createAdminClient();
  const { data: rows } = await admin.from("enrichment_rows").select("id,input_url").eq("job_id", jobId);
  const results: { id: string; status: string; result?: unknown }[] = [];
  try {
    const queue = [...(rows ?? [])];
    await Promise.all(Array.from({ length: 5 }, async () => {
      for (let r = queue.shift(); r; r = queue.shift()) {
        const o = await enrichOne(r.input_url);
        results.push({ id: r.id, status: o.status, result: o.result });
      }
    }));
  } finally {
    const done = new Set(results.map((r) => r.id));
    for (const r of rows ?? []) if (!done.has(r.id)) results.push({ id: r.id, status: "error" });
    await admin.rpc("settle_enrichment", { p_job: jobId, p_results: results });
  }
  redirect(`/dashboard/enrich/${jobId}`);
}

export default async function Enrich({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: balance } = await supabase.rpc("my_credit_balance");
  const ready = providerConfigured();
  return (
    <>
      <div className="ws-head"><h1>New enrichment</h1></div>
      {!ready && <div className="msg err" style={{ maxWidth: 720 }}>The data source isn&apos;t connected yet, so runs are paused. An admin needs to set <span className="mono">ENRICHMENT_API_KEY</span> and <span className="mono">SUPABASE_SERVICE_ROLE_KEY</span>.</div>}
      {error && <div className="msg err" style={{ maxWidth: 720 }}>{error}</div>}
      <div style={{ maxWidth: 720 }}><EnrichForm action={runEnrichment} balance={balance ?? 0} disabled={!ready} /></div>
    </>
  );
}
