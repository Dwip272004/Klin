import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { REASON, label, shortDate, statusClass } from "@/lib/ui";

export const dynamic = "force-dynamic";
const SLOTS = 2;

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const uid = user!.id;
  const [{ data: profile }, { data: balance }, { data: runs }, { data: jobs }, { data: ledger }] = await Promise.all([
    supabase.from("profiles").select("full_name,company,job_title").eq("id", uid).single(),
    supabase.rpc("my_credit_balance"),
    supabase.from("enrichment_jobs").select("id,name,status,rows_total,created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("job_postings").select("id,title,status,expires_at").eq("user_id", uid).order("created_at", { ascending: false }),
    supabase.from("credit_ledger").select("id,delta,reason,note,created_at").order("created_at", { ascending: false }).limit(6),
  ]);
  const live = (jobs ?? []).filter((j) => j.status === "live" && new Date(j.expires_at) > new Date()).length;
  const first = profile?.full_name?.split(" ")[0];
  const steps = [
    { done: Boolean(profile?.company && profile?.job_title), text: "Complete your profile", href: "/profile", cta: "Edit profile" },
    { done: (runs?.length ?? 0) > 0, text: "Run your first enrichment", href: "/dashboard/enrich", cta: "Start a run" },
    { done: (jobs?.length ?? 0) > 0, text: "Post your first job", href: "/dashboard/jobs/new", cta: "Post a job" },
  ];
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <>
      <div className="ws-head">
        <div><div className="eyebrow">Workspace</div><h1>{first ? `Hello, ${first}` : "Your tables"}</h1></div>
        <Link className="btn accent" href="/dashboard/enrich">+ New enrichment</Link>
      </div>

      <div className="stats">
        <div className="stat"><div className="k">Credits</div><div className="v">{balance ?? 0}</div><Link className="stat-link" href="/dashboard/billing">Buy more →</Link></div>
        <div className="stat"><div className="k">Enrichment runs</div><div className="v">{runs?.length ?? 0}</div><Link className="stat-link" href="/dashboard/enrich">New run →</Link></div>
        <div className="stat"><div className="k">Job slots free</div><div className="v">{SLOTS - live}<span className="of">/{SLOTS}</span></div>
          {live < SLOTS ? <Link className="stat-link" href="/dashboard/jobs/new">Post a job →</Link> : <span className="stat-link muted">All slots in use</span>}</div>
      </div>

      {doneCount < steps.length && (
        <div className="panel checklist">
          <header><span>Get started</span><span className="mono muted">{doneCount} of {steps.length} done</span></header>
          <div className="meter"><span style={{ width: `${(doneCount / steps.length) * 100}%` }} /></div>
          <ul>{steps.map((s) => (
            <li key={s.text} className={s.done ? "done" : ""}>
              <span className="check" aria-hidden>{s.done ? "✓" : ""}</span><span className="t">{s.text}</span>
              {!s.done && <Link className="btn sm ghost" href={s.href}>{s.cta}</Link>}
            </li>))}</ul>
        </div>
      )}

      <div className="panel"><header><span>Enrichment runs</span><Link className="btn sm ghost" href="/dashboard/enrich">New run</Link></header>
        {runs?.length ? <div className="scroll-x"><table className="dt"><thead><tr><th>Table</th><th>Rows</th><th>Status</th><th>Created</th><th></th></tr></thead><tbody>
          {runs.map((r) => (<tr key={r.id}><td><Link href={`/dashboard/enrich/${r.id}`}>{r.name}</Link></td><td className="mono">{r.rows_total}</td>
            <td><span className={"chip " + statusClass(r.status)}>{label(r.status)}</span></td><td className="muted">{shortDate(r.created_at)}</td>
            <td style={{ textAlign: "right" }}><Link href={`/dashboard/enrich/${r.id}`}>Open →</Link></td></tr>))}
        </tbody></table></div>
          : <div className="empty-state"><div className="es-title">No tables yet</div><p>Paste LinkedIn profile URLs and Kiln builds your first table.</p><Link className="btn accent sm" href="/dashboard/enrich">Enrich a list</Link></div>}
      </div>

      <div className="two-col">
        <div className="panel"><header><span>Your job posts</span>{live < SLOTS && <Link className="btn sm ghost" href="/dashboard/jobs/new">Post a job</Link>}</header>
          {jobs?.length ? <table className="dt"><tbody>{jobs.map((j) => (
            <tr key={j.id}><td><Link href={`/jobs?id=${j.id}`}>{j.title}</Link></td><td><span className={"chip " + statusClass(j.status)}>{j.status}</span></td>
              <td className="muted" style={{ textAlign: "right" }}>until {shortDate(j.expires_at)}</td></tr>))}</tbody></table>
            : <div className="empty-state"><div className="es-title">No job posts yet</div><p>You have {SLOTS} free live posts.</p><Link className="btn sm" href="/dashboard/jobs/new">Post a job</Link></div>}
        </div>
        <div className="panel"><header><span>Recent credit activity</span><Link className="btn sm ghost" href="/dashboard/billing">All</Link></header>
          <table className="dt"><tbody>{ledger?.map((l) => (
            <tr key={l.id}><td>{REASON[l.reason] ?? l.reason}</td><td className={"mono " + (l.delta > 0 ? "pos" : "neg")}>{l.delta > 0 ? "+" : "−"}{Math.abs(l.delta)}</td>
              <td className="muted" style={{ textAlign: "right" }}>{shortDate(l.created_at)}</td></tr>))}</tbody></table>
        </div>
      </div>
    </>
  );
}
