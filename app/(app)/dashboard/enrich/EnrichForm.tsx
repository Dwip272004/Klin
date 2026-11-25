"use client";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";

const LI = /https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/in\/[^\s/?#,"']+/gi;

function Submit({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return <button className="btn accent block lg" type="submit" disabled={disabled || pending}>{pending ? "Enriching… up to a minute" : "Run enrichment"}</button>;
}

export default function EnrichForm({ action, balance, disabled }: { action: (fd: FormData) => Promise<void>; balance: number; disabled: boolean }) {
  const [text, setText] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const found = [...new Set((text.match(LI) ?? []).map((u) => u.toLowerCase()))];
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const ignored = lines.filter((l) => !(l.match(LI) ?? []).length).length;
  const count = found.length, over = count > 50, short = count > balance, ok = count > 0 && !over && !short;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    if (f.size > 500_000) { alert("File is too large. Keep it under 500 KB."); return; }
    const t = await f.text(); setText((p) => (p ? p + "\n" : "") + t); e.target.value = "";
  }

  return (
    <form action={action} className="enrich-grid">
      <div className="panel"><div className="pad">
        <label className="f" htmlFor="name" style={{ marginTop: 0 }}>Table name</label>
        <input className="in" id="name" name="name" placeholder="e.g. Chip design leads, Pune" maxLength={80} />
        <div className="row-between"><label className="f" htmlFor="urls">LinkedIn profile URLs</label>
          <button type="button" className="btn sm ghost" onClick={() => file.current?.click()}>Upload CSV / TXT</button></div>
        <input ref={file} type="file" accept=".csv,.txt,text/csv,text/plain" onChange={onFile} hidden />
        <textarea className="in tall" id="urls" name="urls" value={text} onChange={(e) => setText(e.target.value)} required
          placeholder={"Paste one profile URL per line, or upload a file.\nhttps://www.linkedin.com/in/…"} />
        {count > 0 && <div className="url-preview">{found.slice(0, 6).map((u) => <span key={u} className="chip found">{u.replace(/^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/in\//, "/in/")}</span>)}{count > 6 && <span className="chip none">+{count - 6} more</span>}</div>}
        {ignored > 0 && <p className="hint">{ignored} {ignored === 1 ? "line" : "lines"} without a valid profile URL will be skipped.</p>}
      </div></div>

      <aside className="panel summary"><div className="pad">
        <h3>Run summary</h3>
        <dl>
          <div><dt>Profiles</dt><dd>{count}</dd></div>
          <div><dt>Credits needed</dt><dd>{count}</dd></div>
          <div><dt>Your balance</dt><dd>{balance}</dd></div>
          <div className="total"><dt>After this run</dt><dd>{Math.max(balance - count, 0)}</dd></div>
        </dl>
        {over && <div className="msg err">Maximum 50 profiles per run.</div>}
        {short && !over && <div className="msg err">Not enough credits. <Link href="/dashboard/billing">Buy more →</Link></div>}
        <Submit disabled={disabled || !ok} />
        <ul className="notes"><li>Credits are held now and charged only for rows that return data.</li><li>Not-found rows are refunded automatically.</li><li>Runs take up to a minute.</li></ul>
      </div></aside>
    </form>
  );
}
