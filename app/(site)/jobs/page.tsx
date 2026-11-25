import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Jobs() {
  const supabase = await createClient();
  const { data: jobs } = await supabase.from("job_postings").select("id,title,company,location,remote,employment_type,pay_range")
    .eq("status", "live").gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false });
  return (
    <div className="container" style={{ paddingBottom: 80 }}>
      <div className="page-head"><div className="eyebrow">Job board</div><h1 style={{ fontSize: "clamp(40px,5vw,68px)" }}>Open roles.</h1>
        <p>Posted by Kiln users. Every account can run two live posts for free.</p></div>
      {jobs?.length ? <div className="joblist">{jobs.map((j) => (
        <Link className="job" key={j.id} href={`/jobs/${j.id}`}><div><h3>{j.title}</h3>
          <div className="meta">{j.company} · {j.remote ? "Remote" : j.location} · {j.employment_type}{j.pay_range ? ` · ${j.pay_range}` : ""}</div></div><span aria-hidden>→</span></Link>))}</div>
        : <p className="muted">No live jobs yet.</p>}
    </div>
  );
}
