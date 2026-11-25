import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function saveProfile(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const s = (k: string, max: number) => String(formData.get(k) ?? "").trim().slice(0, max) || null;
  await supabase.from("profiles").update({ full_name: s("full_name", 100), company: s("company", 100), job_title: s("job_title", 100), linkedin_url: s("linkedin_url", 300), bio: s("bio", 1000) }).eq("id", user.id);
  revalidatePath("/profile");
}

export default async function Profile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: p } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
  return (
    <>
      <div className="ws-head"><h1>Profile</h1></div>
      <form action={saveProfile} className="panel narrow"><div className="pad">
        <label className="f" style={{ marginTop: 0 }}>Email</label><input className="in" value={p?.email ?? ""} disabled />
        <label className="f" htmlFor="full_name">Full name</label><input className="in" id="full_name" name="full_name" defaultValue={p?.full_name ?? ""} />
        <label className="f" htmlFor="company">Company</label><input className="in" id="company" name="company" defaultValue={p?.company ?? ""} />
        <label className="f" htmlFor="job_title">Job title</label><input className="in" id="job_title" name="job_title" defaultValue={p?.job_title ?? ""} />
        <label className="f" htmlFor="linkedin_url">LinkedIn URL</label><input className="in" id="linkedin_url" name="linkedin_url" type="url" defaultValue={p?.linkedin_url ?? ""} />
        <label className="f" htmlFor="bio">Bio</label><textarea className="in" id="bio" name="bio" defaultValue={p?.bio ?? ""} />
        <p style={{ marginTop: 18 }}><button className="btn" type="submit">Save profile</button></p>
      </div></form>
    </>
  );
}
