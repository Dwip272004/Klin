import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CopyButton from "@/components/CopyButton";
import { label, shortDate, statusClass } from "@/lib/ui";

export const dynamic = "force-dynamic";

export default async function Run({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ show?: string }> }) {
  const { id } = await params;
  const { show } = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createClient();
  const { data: job } = await supabase.from("enrichment_jobs").select("*").eq("id", id).maybeSingle();
  if (!job) notFound();
  const { data: all } = await supabase.from("enrichment_rows").select("id,input_url,status,result").eq("job_id", id).order("created_at");
  const rows = all ?? [];
  const found = rows.filter((r) => r.status === "found").length;
  const missed = rows.length - found;
  const rate = rows.length ? Math.round((found / rows.length) * 100) : 0;
  const shown = show === "found" ? rows.filter((r) => r.status === "found") : show === "missed" ? rows.filter((r) => r.status !== "found") : rows;
  const tab = (k: string | undefined, text: string, n: number) => (
    <Link className={"fchip" + ((show ?? "") === (k ?? "") ? " on" : "")} href={k ? `?show=${k}` : "?"}>{text} <span className="mono">{n}</span></Link>);

  return (
    <>
      <div className="crumbs"><Link href="/dashboard">Tables</Link><span>/</span><span>{job.name}</span></div>
      <div className="ws-head">
        <div><h1>{job.name}</h1><p className="muted sub">{shortDate(job.created_at)} · <span className={"chip " + statusClass(job.status)}>{label(job.status)}</span></p></div>
        <Link className="btn" href={`/dashboard/enrich/${id}/csv`}>Download CSV ↓</Link>
      </div>
      <div className="stats">
        <div className="stat"><div className="k">Rows</div><div className="v">{rows.length}</div></div>
        <div className="stat"><div className="k">Found</div><div className="v">{found}</div></div>
        <div className="stat"><div className="k">Hit rate</div><div className="v">{rate}<span className="of">%</span></div><div className="meter slim"><span style={{ width: `${rate}%` }} /></div></div>
        <div className="stat"><div className="k">Refunded</div><div className="v">{missed}</div></div>
      </div>
      <div className="jfilters" style={{ margin: "0 0 14px" }}>{tab(undefined, "All", rows.length)}{tab("found", "Found", found)}{tab("missed", "Not found", missed)}</div>
      <div className="panel scroll-x">
        {shown.length ? <table className="dt"><thead><tr><th>#</th><th>Name</th><th>Title</th><th>Company</th><th>Location</th><th>Email</th><th>Status</th></tr></thead><tbody>
          {shown.map((r, i) => { const x = (r.result ?? {}) as Record<string, string>; return (
            <tr key={r.id}><td className="mono muted">{i + 1}</td>
              <td><b>{x.name ?? "—"}</b><small className="sub-url"><a href={r.input_url} target="_blank" rel="noopener noreferrer">profile ↗</a></small></td>
              <td>{x.title ?? "—"}</td><td>{x.company ?? "—"}</td><td>{x.location ?? "—"}</td>
              <td className="mono">{x.email ? <span className="email">{x.email}<CopyButton text={x.email} /></span> : "—"}</td>
              <td><span className={"chip " + statusClass(r.status)}>{label(r.status)}</span></td></tr>); })}
        </tbody></table> : <div className="empty-state"><div className="es-title">Nothing here</div><p>No rows match this filter.</p></div>}
      </div>
    </>
  );
}
