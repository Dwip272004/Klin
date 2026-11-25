export type Enriched = { name?: string; title?: string; company?: string; location?: string; email?: string; linkedin_url: string };
export type RowOutcome = { status: "found" | "not_found" | "error"; result?: Enriched };

export function providerConfigured() {
  return Boolean(process.env.ENRICHMENT_API_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// Data-provider adapter. Swap this function to change the source; the rest of the app does not care.
// Current implementation targets Apollo's people-match endpoint (untested against a live key).
export async function enrichOne(linkedinUrl: string): Promise<RowOutcome> {
  try {
    const res = await fetch("https://api.apollo.io/api/v1/people/match", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cache-Control": "no-cache", "x-api-key": process.env.ENRICHMENT_API_KEY! },
      body: JSON.stringify({ linkedin_url: linkedinUrl, reveal_personal_emails: false }),
      signal: AbortSignal.timeout(15000),
    });
    if (res.status === 404) return { status: "not_found" };
    if (!res.ok) return { status: "error" };
    const { person } = (await res.json()) as { person?: Record<string, any> | null };
    if (!person) return { status: "not_found" };
    const email = typeof person.email === "string" && !person.email.startsWith("email_not_unlocked") ? person.email : undefined;
    const location = [person.city, person.state, person.country].filter(Boolean).join(", ") || undefined;
    const result: Enriched = { name: person.name, title: person.title, company: person.organization?.name, location, email, linkedin_url: linkedinUrl };
    return result.name || result.email ? { status: "found", result } : { status: "not_found" };
  } catch {
    return { status: "error" };
  }
}
