import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import JobDetail, { Logo } from "@/components/JobDetail";
import { Job, timeAgo, typeLabel } from "@/lib/jobs";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Jobs — Kiln" };

type SP = { q?: string; loc?: string; type?: string; remote?: string; id?: string };
const clean = (s?: string) => (s ?? "").replace(/[%,()*\\]/g, " ").trim().slice(0, 60);
const TYPES = ["full-time", "part-time", "contract", "internship"];

export default async function Jobs({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = clean(sp.q), loc = clean(sp.loc), type = TYPES.includes(sp.type ?? "") ? sp.type! : "", remote = sp.remote === "1";
  const supabase = await createClient();
  let query = supabase.from("job_postings")
    .select("id,title,company,location,remote,employment_type,pay_range,description,apply_url,created_at")
    .eq("status", "live").gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).limit(50);
  if (q) query = query.or(`title.ilike.%${q}%,company.ilike.%${q}%,description.ilike.%${q}%`);
  if (loc) query = query.ilike("location", `%${loc}%`);
  if (type) query = query.eq("employment_type", type);
  if (remote) query = query.eq("remote", true);
  const { data } = await query;
  const jobs = (data ?? []) as Job[];

  const selected = jobs.find((j) => j.id === sp.id) ?? jobs[0];
  const keep = (extra: Record<string, string>) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q); if (loc) p.set("loc", loc); if (type) p.set("type", type); if (remote) p.set("remote", "1");
    Object.entries(extra).forEach(([k, v]) => p.set(k, v));
    return `/jobs?${p.toString()}`;
  };
  const toggle = (k: string, v: string, on: boolean) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q); if (loc) p.set("loc", loc);
    const t = k === "type" ? (on ? "" : v) : type; const r = k === "remote" ? !on : remote;
    if (t) p.set("type", t); if (r) p.set("remote", "1");
    return `/jobs?${p.toString()}`;
  };

  return (
    <div className="jobs-page">
      <form className="jsearch" action="/jobs" method="get">
        <div className="container jsearch-row">
          <input className="in" name="q" defaultValue={q} placeholder="Search by title, company or keyword" aria-label="Keyword" />
          <input className="in" name="loc" defaultValue={loc} placeholder="City or region" aria-label="Location" />
          {type && <input type="hidden" name="type" value={type} />}{remote && <input type="hidden" name="remote" value="1" />}
          <button className="btn accent" type="submit">Search</button>
        </div>
        <div className="container jfilters">
          <Link className={"fchip" + (remote ? " on" : "")} href={toggle("remote", "1", remote)}>Remote</Link>
          {TYPES.map((t) => <Link key={t} className={"fchip" + (type === t ? " on" : "")} href={toggle("type", t, type === t)}>{typeLabel(t)}</Link>)}
          {(q || loc || type || remote) && <Link className="fclear" href="/jobs">Clear all</Link>}
        </div>
      </form>

      <div className="container">
        {jobs.length === 0 ? (
          <div className="jempty"><h2>No jobs match your search</h2><p className="muted">Try different keywords, or clear the filters.</p><Link className="btn" href="/jobs">Clear filters</Link></div>
        ) : (
          <div className="jobs-layout" data-open={sp.id ? "1" : "0"}>
            <aside className="jl-list" aria-label="Job results">
              <div className="jl-count">{jobs.length} {jobs.length === 1 ? "job" : "jobs"}</div>
              {jobs.map((j) => (
                <Link key={j.id} href={keep({ id: j.id })} scroll={false} className={"jcard" + (selected?.id === j.id ? " active" : "")}>
                  <Logo name={j.company} />
                  <div className="jcard-body">
                    <h3>{j.title}</h3>
                    <div className="jcard-co">{j.company}</div>
                    <div className="jcard-meta">{j.remote ? "Remote" : j.location || "—"} · {typeLabel(j.employment_type)}</div>
                    <div className="jcard-time">{timeAgo(j.created_at)}{j.pay_range ? ` · ${j.pay_range}` : ""}</div>
                  </div>
                </Link>
              ))}
            </aside>
            <section className="jl-detail">
              <Link className="jback" href={keep({})}>← All jobs</Link>
              {selected && <JobDetail job={selected} />}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
