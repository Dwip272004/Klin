import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createOrder, razorpayConfigured } from "@/lib/razorpay";
import { planById } from "@/lib/pricing";

export async function POST(req: Request) {
  if (!razorpayConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY)
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });

  const { planId } = (await req.json().catch(() => ({}))) as { planId?: string };
  const plan = planId ? planById(planId) : undefined;
  if (!plan) return NextResponse.json({ error: "Unknown plan." }, { status: 400 });

  try {
    // Price comes from the server-side plan table, never from the client.
    const order = await createOrder(plan.priceInr * 100, `kiln_${user.id.slice(0, 8)}_${Date.now()}`, { user_id: user.id, plan_id: plan.id });
    const { error } = await createAdminClient().from("payments").insert({
      user_id: user.id, plan_id: plan.id, credits: plan.profiles, amount_paise: plan.priceInr * 100, razorpay_order_id: order.id,
    });
    if (error) throw error;
    return NextResponse.json({ orderId: order.id, amount: order.amount, keyId: process.env.RAZORPAY_KEY_ID, name: plan.name, email: user.email });
  } catch {
    return NextResponse.json({ error: "Could not start checkout." }, { status: 502 });
  }
}
