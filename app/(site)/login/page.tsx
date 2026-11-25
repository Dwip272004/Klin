"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FREE_CREDITS } from "@/lib/pricing";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/dashboard";
  const [mode, setMode] = useState<"signin" | "signup" | "magic">(params.get("mode") === "signup" ? "signup" : "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(params.get("error") ? "That sign-in link is invalid or expired." : null);
  const [ok, setOk] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null); setOk(null);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(next); router.refresh();
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo, data: { full_name: fullName } } });
        if (error) throw error;
        if (data.session) { router.push(next); router.refresh(); } else setOk("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
        if (error) throw error;
        setOk("Magic link sent. Check your email.");
      }
    } catch (e) { setErr(e instanceof Error ? e.message : "Something went wrong"); } finally { setBusy(false); }
  }
  async function google() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` } });
  }
  const pick = (m: typeof mode) => { setMode(m); setErr(null); setOk(null); };

  return (
    <div className="auth">
      <aside className="auth-side">
        <h2>Your next list, <em>already a table.</em></h2>
        <ul><li>✓ {FREE_CREDITS} free profiles on signup</li><li>✓ Pay only for rows that return data</li><li>✓ 2 free job posts</li></ul>
      </aside>
      <div className="auth-main"><div className="auth-box">
        <h1>{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
        <div className="seg" role="tablist">
          {(["signin", "signup", "magic"] as const).map((m) => (
            <button key={m} type="button" className={mode === m ? "on" : ""} onClick={() => pick(m)}>
              {m === "signin" ? "Password" : m === "signup" ? "Sign up" : "Magic link"}</button>))}
        </div>
        <form onSubmit={submit}>
          {mode === "signup" && (<><label className="f" htmlFor="n">Full name</label><input className="in" id="n" value={fullName} onChange={(e) => setFullName(e.target.value)} required /></>)}
          <label className="f" htmlFor="e">Work email</label>
          <input className="in" id="e" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          {mode !== "magic" && (<><label className="f" htmlFor="p">Password</label>
            <input className="in" id="p" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete={mode === "signup" ? "new-password" : "current-password"} /></>)}
          {err && <div className="msg err">{err}</div>}
          {ok && <div className="msg ok">{ok}</div>}
          <p style={{ marginTop: 18 }}><button className="btn block" disabled={busy} type="submit">{busy ? "One moment…" : mode === "signin" ? "Log in" : mode === "signup" ? "Create account" : "Send magic link"}</button></p>
        </form>
        <p style={{ marginTop: 10 }}><button type="button" className="btn ghost block" onClick={google}>Continue with Google</button></p>
      </div></div>
    </div>
  );
}
export default function LoginPage() { return <Suspense><LoginForm /></Suspense>; }
