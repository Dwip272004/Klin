import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
const SLOTS = 2;

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [{ data: profile }, { data: balance }, { data: runs }, { data: jobs }, { data: ledger }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user!.id).single(),
    supabase.rpc("my_credit_balance"),
    supabase.from("enrichment_jobs").select("id,name,status,rows_total,created_at").order("created_at", { ascending: false }).limit(10),
    supabase.from("job_postings").select("id,title,status,expires_at").order("created_at", { ascending: false }),
    supabase.from("credit_ledger").select("id,delta,reason,note,created_at").order("created_at", { ascending: false }).limit(6),
  ]);
  const live = (jobs ?? []).filter((j) => j.status === "live" && new Date(j.expires_at) > new Date()).length;
  const first = profile?.full_name?.split(" ")[0];

  return (
    <>
      <div className="ws-head"><h1>{first ? `Hello, ${first}` : "Your tables"}</h1>
        <Link className="btn accent" href="/dashboard/enrich">New enrichment</Link></div>
      <div className="stats">
        <div className="stat"><div className="k">Credits</div><div className="v">{balance ?? 0}</div></div>
        <div className="stat"><div className="k">Runs</div><div className="v">{runs?.length ?? 0}</div></div>
        <div className="stat"><div className="k">Job slots free</div><div className="v">{SLOTS - live}/{SLOTS}</div></div>
      </div>

      <div className="panel"><header>Enrichment runs</header>
        {runs?.length ? <div className="scroll-x"><table className="dt"><thead><tr><th>Table</th><th>Rows</th><th>Status</th><th>Created</th></tr></thead><tbody>
          {runs.map((r) => (<tr key={r.id}><td><Link href={`/dashboard/enrich/${r.id}`}>{r.name}</Link></td><td>{r.rows_total}</td><td><span className="chip">{r.status}</span></td><td>{new Date(r.created_at).toLocaleDateString("en-IN")}</td></tr>))}
        </tbody></table></div> : <div className="empty">No runs yet. <Link href="/dashboard/enrich">Enrich your first list.</Link></div>}
      </div>

      <div className="panel"><header><span>Your job posts</span>{live < SLOTS && <Link className="btn sm" href="/dashboard/jobs/new">Post a job</Link>}</header>
        {jobs?.length ? <table className="dt"><tbody>{jobs.map((j) => (
          <tr key={j.id}><td><Link href={`/jobs/${j.id}`}>{j.title}</Link></td><td><span className="chip">{j.status}</span></td><td className="muted">expires {new Date(j.expires_at).toLocaleDateString("en-IN")}</td></tr>))}</tbody></table>
          : <div className="empty">No posts yet.</div>}
      </div>

      <div className="panel"><header>Recent credit activity</header>
        <table className="dt"><tbody>{ledger?.map((l) => (
          <tr key={l.id}><td>{l.reason}</td><td className="mono">{l.delta > 0 ? "+" : ""}{l.delta}</td><td className="muted">{l.note}</td><td className="muted">{new Date(l.created_at).toLocaleDateString("en-IN")}</td></tr>))}</tbody></table>
      </div>
    </>
  );
}
