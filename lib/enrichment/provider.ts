export type Enriched = { name?: string; title?: string; company?: string; location?: string; email?: string; linkedin_url: string };
export type RowOutcome = { status: "found" | "not_found" | "error"; result?: Enriched };
export type BatchRow = { id: string; url: string };

const base = () => (process.env.ENRICHMENT_API_URL ?? "").replace(/\/$/, "");
const POLL_EVERY_MS = 5000;
const DEADLINE_MS = 50_000; // stay inside the 60s function limit

export function providerConfigured() {
  return Boolean(process.env.ENRICHMENT_API_KEY && process.env.ENRICHMENT_API_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

const headers = () => ({ "Content-Type": "application/json", Token: process.env.ENRICHMENT_API_KEY! });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Statuses that mean the request is still in flight (or may flip shortly after acceptance).
const PENDING = new Set(["queued", "researching", "missing"]);

type PollItem = { requestId: string; status?: string; contact?: Record<string, any> | null };

function toOutcome(url: string, item: PollItem): RowOutcome {
  const c = item.contact ?? {};
  const email = typeof c.email === "string" && c.email ? c.email : undefined;
  if (!email) return { status: item.status === "error" ? "error" : "not_found" };
  const loc = c.contactLocation ?? {};
  const location = loc.fullString || [loc.city ?? c.city, loc.state ?? c.state, loc.country ?? c.country].filter(Boolean).join(", ") || undefined;
  return { status: "found", result: { name: c.fullName || c.name, title: c.jobTitle || c.title, company: c.companyName || c.company, location, email, linkedin_url: url } };
}

// Data-provider adapter (email-only research = 1 credit per found contact).
// Swap this function to change the source; the rest of the app only sees RowOutcome.
export async function enrichBatch(rows: BatchRow[]): Promise<Map<string, RowOutcome>> {
  const out = new Map<string, RowOutcome>();
  const fail = () => { for (const r of rows) if (!out.has(r.id)) out.set(r.id, { status: "error" }); return out; };
  try {
    const res = await fetch(`${base()}/contacts/research`, {
      method: "POST", headers: headers(), signal: AbortSignal.timeout(20000),
      body: JSON.stringify({ contacts: rows.map((r) => ({ liProfileUrl: r.url })), researchTypes: ["email"] }),
    });
    if (!res.ok) return fail();
    const { requestIds } = (await res.json()) as { requestIds?: string[] };
    // One request ID per contact, in input order.
    if (!requestIds || requestIds.length !== rows.length) return fail();
    const byReq = new Map(requestIds.map((id, i) => [id, rows[i]]));

    const start = Date.now();
    let waiting = [...requestIds];
    while (waiting.length && Date.now() - start < DEADLINE_MS) {
      await sleep(POLL_EVERY_MS);
      const p = await fetch(`${base()}/contacts/research/poll?requestIds=${waiting.join(",")}`, { headers: headers(), signal: AbortSignal.timeout(20000) });
      if (!p.ok) continue;
      const { data } = (await p.json()) as { data?: PollItem[] };
      const still: string[] = [];
      for (const item of data ?? []) {
        const row = byReq.get(item.requestId);
        if (!row) continue;
        if (item.status && PENDING.has(item.status) && Date.now() - start < DEADLINE_MS - POLL_EVERY_MS) still.push(item.requestId);
        else out.set(row.id, toOutcome(row.url, item));
      }
      waiting = still;
    }
    return fail(); // anything unresolved by the deadline is refunded as an error
  } catch {
    return fail();
  }
}
