import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Logo from "@/components/Logo";
import RevealOnScroll from "@/components/RevealOnScroll";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <RevealOnScroll />
      <main>{children}</main>
      <footer className="site-foot">
        <div className="container foot">
          <div><Logo /><p className="muted">Enrich a list. Keep the rows that matter.</p></div>
          <div className="foot-links">
            <Link href="/pricing">Pricing</Link><Link href="/jobs">Jobs</Link><Link href="/login">Log in</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
