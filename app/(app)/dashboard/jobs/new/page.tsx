import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function createJob(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const s = (k: string, max: number) => String(formData.get(k) ?? "").trim().slice(0, max);
  const applyUrl = s("apply_url", 500);
  if (applyUrl && !/^https?:\/\//i.test(applyUrl)) redirect("/dashboard/jobs/new?error=Apply%20link%20must%20start%20with%20http(s)");
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
  return (
    <>
      <div className="ws-head"><h1>Post a job</h1></div>
      <form action={createJob} className="panel narrow"><div className="pad">
        {error && <div className="msg err">{error}</div>}
        <label className="f" htmlFor="title">Title</label><input className="in" id="title" name="title" required minLength={3} />
        <label className="f" htmlFor="company">Company</label><input className="in" id="company" name="company" required />
        <label className="f" htmlFor="location">Location</label><input className="in" id="location" name="location" />
        <label className="f"><input type="checkbox" name="remote" style={{ width: "auto" }} /> Remote</label>
        <label className="f" htmlFor="employment_type">Type</label>
        <select className="in" id="employment_type" name="employment_type"><option>full-time</option><option>part-time</option><option>contract</option><option>internship</option></select>
        <label className="f" htmlFor="pay_range">Pay range (optional)</label><input className="in" id="pay_range" name="pay_range" />
        <label className="f" htmlFor="description">Description</label><textarea className="in" id="description" name="description" required minLength={20} />
        <label className="f" htmlFor="apply_url">Apply link</label><input className="in" id="apply_url" name="apply_url" type="url" />
        <p><button className="btn" type="submit">Publish (30 days)</button></p>
      </div></form>
    </>
  );
}
