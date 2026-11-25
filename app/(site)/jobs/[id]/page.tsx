import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import JobDetail from "@/components/JobDetail";
import type { Job } from "@/lib/jobs";

export const dynamic = "force-dynamic";

export default async function Job({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const supabase = await createClient();
  const { data: j } = await supabase.from("job_postings").select("*").eq("id", id).maybeSingle();
  if (!j) notFound();
  const ld = {
    "@context": "https://schema.org/", "@type": "JobPosting", title: j.title, description: j.description,
    datePosted: j.created_at, validThrough: j.expires_at, employmentType: j.employment_type.toUpperCase().replace("-", "_"),
    hiringOrganization: { "@type": "Organization", name: j.company },
    ...(j.remote ? { jobLocationType: "TELECOMMUTE" } : {}),
    ...(j.location ? { jobLocation: { "@type": "Place", address: j.location } } : {}),
  };
  return (
    <div className="container" style={{ padding: "56px 24px 80px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <a className="jback show" href="/jobs">← All jobs</a>
      <JobDetail job={j as Job} />
    </div>
  );
}
