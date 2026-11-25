"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const I = (d: string) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>;
const ICON = {
  tables: I("M3 5h18v14H3zM3 10h18M9 5v14"),
  run: I("M12 5v14M5 12h14"),
  post: I("M4 8h16v11H4zM9 8V5h6v3"),
  credits: I("M12 3a9 9 0 100 18 9 9 0 000-18zM9 12h6M12 9v6"),
  board: I("M4 6h16M4 12h16M4 18h10"),
  profile: I("M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-4 4-6 8-6s8 2 8 6"),
};

const ITEMS = [
  { href: "/dashboard", label: "Tables", icon: ICON.tables, active: (p: string) => p === "/dashboard" || p.startsWith("/dashboard/enrich/") },
  { href: "/dashboard/enrich", label: "New enrichment", icon: ICON.run, active: (p: string) => p === "/dashboard/enrich" },
  { href: "/dashboard/jobs/new", label: "Post a job", icon: ICON.post, active: (p: string) => p.startsWith("/dashboard/jobs") },
  { href: "/dashboard/billing", label: "Credits", icon: ICON.credits, active: (p: string) => p.startsWith("/dashboard/billing") },
  { href: "/jobs", label: "Job board", icon: ICON.board, active: () => false },
  { href: "/profile", label: "Profile", icon: ICON.profile, active: (p: string) => p.startsWith("/profile") },
];

export default function SideNav({ balance, email, name }: { balance: number; email: string; name: string }) {
  const path = usePathname();
  const initials = (name || email).split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("");
  const low = balance <= 5;
  return (
    <aside className="side">
      <Logo href="/dashboard" />
      <nav className="side-nav" aria-label="Workspace">
        {ITEMS.map((it) => (
          <Link key={it.href} href={it.href} className={"nav" + (it.active(path) ? " active" : "")} aria-current={it.active(path) ? "page" : undefined}>
            {it.icon}<span>{it.label}</span>
          </Link>
        ))}
      </nav>
      <div className="grow" />
      <div className={"side-credits" + (low ? " low" : "")}>
        <div className="k">Credits</div>
        <div className="v">{balance}</div>
        <Link href="/dashboard/billing" className="btn sm accent block">{low ? "Top up" : "Buy credits"}</Link>
      </div>
      <div className="side-user">
        <span className="avatar" aria-hidden>{initials}</span>
        <div className="who"><b>{name || "Your account"}</b><small>{email}</small></div>
      </div>
      <form action="/auth/signout" method="post"><button className="btn ghost sm block" type="submit">Sign out</button></form>
    </aside>
  );
}
