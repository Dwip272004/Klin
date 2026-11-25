import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Run({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createClient();
  const { data: job } = await supabase.from("enrichment_jobs").select("*").eq("id", id).maybeSingle();
  if (!job) notFound();
  const { data: rows } = await supabase.from("enrichment_rows").select("id,input_url,status,result").eq("job_id", id).order("created_at");
  const found = rows?.filter((r) => r.status === "found").length ?? 0;
  return (
    <>
      <div className="ws-head"><div><div className="eyebrow">Table</div><h1>{job.name}</h1></div>
        <Link className="btn" href={`/dashboard/enrich/${id}/csv`}>Download CSV</Link></div>
      <div className="stats">
        <div className="stat"><div className="k">Rows</div><div className="v">{job.rows_total}</div></div>
        <div className="stat"><div className="k">Found</div><div className="v">{found}</div></div>
        <div className="stat"><div className="k">Status</div><div className="v" style={{ fontSize: 32 }}>{job.status}</div></div>
      </div>
      <div className="panel scroll-x"><table className="dt"><thead><tr><th>#</th><th>Name</th><th>Title</th><th>Company</th><th>Location</th><th>Email</th><th>Status</th></tr></thead><tbody>
        {rows?.map((r, i) => { const x = (r.result ?? {}) as Record<string, string>; return (
          <tr key={r.id}><td className="mono">{i + 1}</td><td>{x.name ?? "—"}</td><td>{x.title ?? "—"}</td><td>{x.company ?? "—"}</td><td>{x.location ?? "—"}</td><td className="mono">{x.email ?? "—"}</td>
            <td><span className={"chip " + (r.status === "found" ? "found" : r.status === "pending" ? "work" : "none")}>{r.status.replace("_", " ")}</span></td></tr>); })}
      </tbody></table></div>
    </>
  );
}
