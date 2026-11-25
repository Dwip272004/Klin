import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const SLOTS = 2;

async function createJob(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const s = (k: string, max: number) => String(formData.get(k) ?? "").trim().slice(0, max);
  const applyUrl = s("apply_url", 500);
  if (applyUrl && !/^https?:\/\//i.test(applyUrl)) redirect("/dashboard/jobs/new?error=Apply%20link%20must%20start%20with%20http(s)://");
  const { error } = await supabase.from("job_postings").insert({
    user_id: user.id, title: s("title", 120), company: s("company", 100), location: s("location", 100) || null,
    remote: formData.get("remote") === "on", employment_type: s("employment_type", 30) || "full-time",
    pay_range: s("pay_range", 60) || null, description: s("description", 10000), apply_url: applyUrl || null,
  });
  if (error) redirect(`/dashboard/jobs/new?error=${encodeURIComponent(error.message)}`);
  redirect("/dashboard");
}

export default async function NewJob({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { count } = await supabase.from("job_postings").select("id", { count: "exact", head: true })
    .eq("user_id", user!.id).eq("status", "live").gt("expires_at", new Date().toISOString());
  const free = SLOTS - (count ?? 0);

  return (
    <>
      <div className="ws-head"><div><div className="eyebrow">Job board</div><h1>Post a job</h1><p className="muted sub">Goes live on the public board for 30 days.</p></div></div>
      {free <= 0 ? (
        <div className="panel"><div className="empty-state"><div className="es-title">All {SLOTS} free slots are in use</div><p>Close or wait for a post to expire to free a slot.</p><Link className="btn sm" href="/dashboard">Back to dashboard</Link></div></div>
      ) : (
        <div className="enrich-grid">
          <form action={createJob} className="panel"><div className="pad">
            {error && <div className="msg err" role="alert">{error}</div>}
            <label className="f" htmlFor="title" style={{ marginTop: 0 }}>Job title</label><input className="in" id="title" name="title" required minLength={3} maxLength={120} placeholder="e.g. Senior Design Verification Engineer" />
            <div className="form-grid">
              <div><label className="f" htmlFor="company">Company</label><input className="in" id="company" name="company" required /></div>
              <div><label className="f" htmlFor="location">Location</label><input className="in" id="location" name="location" placeholder="City, state" /></div>
              <div><label className="f" htmlFor="employment_type">Type</label>
                <select className="in" id="employment_type" name="employment_type"><option>full-time</option><option>part-time</option><option>contract</option><option>internship</option></select></div>
              <div><label className="f" htmlFor="pay_range">Pay range <span className="muted">(optional)</span></label><input className="in" id="pay_range" name="pay_range" placeholder="e.g. ₹20–30 LPA" /></div>
            </div>
            <label className="check-row"><input type="checkbox" name="remote" /> This role is remote</label>
            <label className="f" htmlFor="description">Description</label><textarea className="in tall" id="description" name="description" required minLength={20} placeholder="What the role involves, what you are looking for, and how to apply." />
            <label className="f" htmlFor="apply_url">Apply link</label><input className="in" id="apply_url" name="apply_url" type="url" placeholder="https://…" />
            <p style={{ marginTop: 18 }}><button className="btn accent" type="submit">Publish for 30 days</button></p>
          </div></form>
          <aside className="panel summary"><div className="pad">
            <h3>Your slots</h3>
            <div className="slots"><span className={"slot" + (free < 2 ? " on" : "")} /><span className={"slot" + (free < 1 ? " on" : "")} /><em>{free} of {SLOTS} free</em></div>
            <ul className="notes"><li>Posts show on the public job board and in search results.</li><li>Include pay and location; they get more applications.</li><li>Posts asking candidates for money are removed.</li></ul>
          </div></aside>
        </div>
      )}
    </>
  );
}
