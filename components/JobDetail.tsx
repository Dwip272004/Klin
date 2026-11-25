import { Job, timeAgo, tone, typeLabel } from "@/lib/jobs";

export function Logo({ name, size = 48 }: { name: string; size?: number }) {
  return <span className="jlogo" style={{ width: size, height: size, background: tone(name), fontSize: size * 0.46 }} aria-hidden>{name.trim()[0]?.toUpperCase()}</span>;
}

export default function JobDetail({ job }: { job: Job }) {
  const safeUrl = job.apply_url && /^https?:\/\//i.test(job.apply_url) ? job.apply_url : null;
  return (
    <article className="jd">
      <header className="jd-head">
        <Logo name={job.company} size={56} />
        <div>
          <h2>{job.title}</h2>
          <p className="jd-sub">{job.company} · {job.remote ? "Remote" : job.location || "Location not specified"} · <span className="muted">{timeAgo(job.created_at)}</span></p>
        </div>
      </header>
      <div className="jd-tags">
        <span className="tag">{typeLabel(job.employment_type)}</span>
        {job.remote && <span className="tag">Remote</span>}
        {job.pay_range && <span className="tag">{job.pay_range}</span>}
      </div>
      <div className="jd-actions">
        {safeUrl ? <a className="btn accent" href={safeUrl} target="_blank" rel="noopener noreferrer">Apply ↗</a> : <span className="muted">Apply details not provided</span>}
      </div>
      <h3 className="jd-h">About the job</h3>
      <div className="jd-body">{job.description}</div>
    </article>
  );
}
