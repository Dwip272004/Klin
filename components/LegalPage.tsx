import { SITE } from "@/lib/site";

export default function LegalPage({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <div className="container" style={{ paddingBottom: 90 }}>
      <div className="page-head"><div className="eyebrow">Legal</div><h1 style={{ fontSize: "clamp(40px,5vw,64px)" }}>{title}</h1>
        <p>{intro}</p><p className="muted" style={{ fontSize: 14, marginTop: 10 }}>Last updated {SITE.updated}</p></div>
      <article className="legal">{children}</article>
    </div>
  );
}

export function Support() {
  return SITE.supportEmail ? <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> : <span>our support email on the Contact page</span>;
}
