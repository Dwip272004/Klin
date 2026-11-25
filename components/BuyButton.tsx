"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

declare global { interface Window { Razorpay?: new (o: Record<string, unknown>) => { open(): void } } }

function loadScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function BuyButton({ planId, label, accent, block }: { planId: string; label: string; accent?: boolean; block?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function buy() {
    setBusy(true); setMsg(null);
    try {
      if (!(await loadScript())) throw new Error("Could not load the payment window.");
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ planId }) });
      const o = await res.json();
      if (!res.ok) throw new Error(o.error ?? "Checkout failed.");
      const rzp = new window.Razorpay!({
        key: o.keyId, amount: o.amount, currency: "INR", order_id: o.orderId, name: "Kiln", description: `${o.name} pack`,
        prefill: { email: o.email }, theme: { color: "#ff5a1f" },
        handler: async (r: Record<string, string>) => {
          const v = await fetch("/api/checkout/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r) });
          setMsg(v.ok ? "Payment received. Credits added." : "Paid, but crediting is delayed. It will appear shortly.");
          router.refresh();
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.open();
    } catch (e) { setMsg(e instanceof Error ? e.message : "Something went wrong."); setBusy(false); return; }
    setBusy(false);
  }
  return (
    <>
      <button className={"btn" + (accent ? " accent" : "") + (block ? " block" : "")} onClick={buy} disabled={busy}>{busy ? "Opening…" : label}</button>
      {msg && <div className="msg ok" style={{ marginTop: 10 }}>{msg}</div>}
    </>
  );
}
