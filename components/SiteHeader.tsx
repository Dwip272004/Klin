import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Logo from "./Logo";

export default async function SiteHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <header className="site">
      <div className="container bar">
        <Logo />
        <nav className="links">
          <Link href="/#how">How it works</Link>
          <Link href="/#compare">Compare</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/jobs">Jobs</Link>
        </nav>
        <div className="bar-cta">
          {user ? <Link className="btn" href="/dashboard">Open workspace</Link> : (<>
            <Link className="textlink" href="/login">Log in</Link>
            <Link className="btn accent" href="/login?mode=signup">Start free</Link></>)}
        </div>
      </div>
    </header>
  );
}
