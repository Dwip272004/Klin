import Link from "next/link";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: balance } = await supabase.rpc("my_credit_balance");
  return (
    <div className="shell">
      <aside className="side">
        <Logo href="/dashboard" />
        <Link className="nav" href="/dashboard">Tables</Link>
        <Link className="nav" href="/dashboard/enrich">New enrichment</Link>
        <Link className="nav" href="/dashboard/billing">Credits <span className="credits-pill">{balance ?? 0}</span></Link>
        <Link className="nav" href="/jobs">Job board</Link>
        <Link className="nav" href="/profile">Profile</Link>
        <div className="grow" />
        <div className="who">{user?.email}</div>
        <form action="/auth/signout" method="post"><button className="btn ghost sm" type="submit" style={{ width: "100%" }}>Sign out</button></form>
      </aside>
      <div className="workspace">{children}</div>
    </div>
  );
}
