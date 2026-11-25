"use client";
import { useState } from "react";

export default function EnrichForm({ action, balance, disabled }: { action: (fd: FormData) => Promise<void>; balance: number; disabled: boolean }) {
  const [text, setText] = useState("");
  const count = new Set(text.split(/[\s,]+/).filter((l) => /linkedin\.com\/in\//i.test(l))).size;
  const over = count > 50, short = count > balance;
  return (
    <form action={action} className="panel"><div className="pad">
      <label className="f" htmlFor="name" style={{ marginTop: 0 }}>Table name</label>
      <input className="in" id="name" name="name" placeholder="e.g. Chip design leads, Pune" maxLength={80} />
      <label className="f" htmlFor="urls">LinkedIn profile URLs</label>
      <textarea className="in" id="urls" name="urls" value={text} onChange={(e) => setText(e.target.value)} placeholder={"https://www.linkedin.com/in/…\nhttps://www.linkedin.com/in/…"} required />
      <p className="cost">{count} {count === 1 ? "profile" : "profiles"} = {count} {count === 1 ? "credit" : "credits"} · you have {balance}</p>
      {over && <div className="msg err">Maximum 50 profiles per run.</div>}
      {short && !over && <div className="msg err">Not enough credits for this run.</div>}
      <p style={{ marginTop: 16 }}><button className="btn accent" type="submit" disabled={disabled || count < 1 || over || short}>Run enrichment</button></p>
    </div></form>
  );
}
