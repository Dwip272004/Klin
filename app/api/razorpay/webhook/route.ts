import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyWebhookSignature } from "@/lib/razorpay";

// Backup path: credits the purchase even if the buyer closes the tab before /verify runs.
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyWebhookSignature(raw, req.headers.get("x-razorpay-signature") ?? "")) return new NextResponse("invalid signature", { status: 400 });
  const evt = JSON.parse(raw) as { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string; amount?: number } } } };
  const pay = evt.payload?.payment?.entity;
  if ((evt.event === "payment.captured" || evt.event === "order.paid") && pay?.id && pay.order_id) {
    const admin = createAdminClient();
    const { data: row } = await admin.from("payments").select("amount_paise").eq("razorpay_order_id", pay.order_id).maybeSingle();
    if (row && (pay.amount === undefined || pay.amount === row.amount_paise)) {
      await admin.rpc("fulfill_payment", { p_order: pay.order_id, p_payment: pay.id });
    }
  }
  return NextResponse.json({ ok: true });
}
