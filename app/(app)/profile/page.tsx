import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function saveProfile(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const s = (k: string, max: number) => String(formData.get(k) ?? "").trim().slice(0, max) || null;
  const li = s("linkedin_url", 300);
  if (li && !/^https?:\/\//i.test(li)) redirect("/profile?error=" + encodeURIComponent("LinkedIn URL must start with http(s)://"));
  const { error } = await supabase.from("profiles").update({ full_name: s("full_name", 100), company: s("company", 100), job_title: s("job_title", 100), linkedin_url: li, bio: s("bio", 1000) }).eq("id", user.id);
  revalidatePath("/profile");
  redirect(error ? "/profile?error=" + encodeURIComponent("Could not save. Try again.") : "/profile?saved=1");
}

export default async function Profile({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const sp = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: p } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
  const fields = [p?.full_name, p?.company, p?.job_title, p?.linkedin_url, p?.bio];
  const pct = Math.round((fields.filter(Boolean).length / fields.length) * 100);
  const initials = (p?.full_name || p?.email || "?").split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((x: string) => x[0].toUpperCase()).join("");
  return (
    <>
      <div className="ws-head"><div><div className="eyebrow">Account</div><h1>Profile</h1></div></div>
      {sp.saved && <div className="msg ok" role="status">Profile saved.</div>}
      {sp.error && <div className="msg err" role="alert">{sp.error}</div>}
      <div className="profile-grid">
        <aside className="panel"><div className="pad profile-card">
          <span className="avatar xl" aria-hidden>{initials}</span>
          <h3>{p?.full_name || "Your name"}</h3>
          <p className="muted">{p?.job_title || "Job title"}{p?.company ? ` · ${p.company}` : ""}</p>
          <p className="mono muted" style={{ wordBreak: "break-all" }}>{p?.email}</p>
          <div className="complete"><div className="row-between"><span>Profile completeness</span><b className="mono">{pct}%</b></div><div className="meter"><span style={{ width: `${pct}%` }} /></div></div>
        </div></aside>
        <form action={saveProfile} className="panel"><div className="pad">
          <div className="form-grid">
            <div><label className="f" htmlFor="full_name" style={{ marginTop: 0 }}>Full name</label><input className="in" id="full_name" name="full_name" defaultValue={p?.full_name ?? ""} /></div>
            <div><label className="f" style={{ marginTop: 0 }}>Email</label><input className="in" value={p?.email ?? ""} disabled /></div>
            <div><label className="f" htmlFor="company">Company</label><input className="in" id="company" name="company" defaultValue={p?.company ?? ""} /></div>
            <div><label className="f" htmlFor="job_title">Job title</label><input className="in" id="job_title" name="job_title" defaultValue={p?.job_title ?? ""} /></div>
          </div>
          <label className="f" htmlFor="linkedin_url">LinkedIn URL</label><input className="in" id="linkedin_url" name="linkedin_url" type="url" defaultValue={p?.linkedin_url ?? ""} placeholder="https://www.linkedin.com/in/…" />
          <label className="f" htmlFor="bio">Bio</label><textarea className="in" id="bio" name="bio" defaultValue={p?.bio ?? ""} maxLength={1000} />
          <p style={{ marginTop: 18 }}><button className="btn" type="submit">Save changes</button></p>
        </div></form>
      </div>
    </>
  );
}
