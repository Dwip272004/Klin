import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyCheckoutSignature } from "@/lib/razorpay";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, string>;
  if (!b.razorpay_order_id || !b.razorpay_payment_id || !b.razorpay_signature) return NextResponse.json({ error: "Bad request." }, { status: 400 });
  if (!verifyCheckoutSignature(b.razorpay_order_id, b.razorpay_payment_id, b.razorpay_signature))
    return NextResponse.json({ error: "Payment signature invalid." }, { status: 400 });

  const admin = createAdminClient();
  // The order must belong to the signed-in user.
  const { data: pay } = await admin.from("payments").select("user_id").eq("razorpay_order_id", b.razorpay_order_id).maybeSingle();
  if (!pay || pay.user_id !== user.id) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  const { error } = await admin.rpc("fulfill_payment", { p_order: b.razorpay_order_id, p_payment: b.razorpay_payment_id });
  if (error) return NextResponse.json({ error: "Could not apply credits." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
