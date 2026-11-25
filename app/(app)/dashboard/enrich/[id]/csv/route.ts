import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const cell = (v: unknown) => {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // neutralise spreadsheet formulas
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new NextResponse("Not found", { status: 404 });
  const supabase = await createClient();
  const { data: rows } = await supabase.from("enrichment_rows").select("input_url,status,result").eq("job_id", id).order("created_at");
  if (!rows) return new NextResponse("Not found", { status: 404 });
  const head = ["linkedin_url", "status", "name", "title", "company", "location", "email"];
  const lines = [head.join(","), ...rows.map((r) => { const x = (r.result ?? {}) as Record<string, string>;
    return [r.input_url, r.status, x.name, x.title, x.company, x.location, x.email].map(cell).join(","); })];
  return new NextResponse(lines.join("\n"), { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="kiln-${id.slice(0, 8)}.csv"` } });
}
