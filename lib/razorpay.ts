import crypto from "node:crypto";

export const razorpayConfigured = () => Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

export async function createOrder(amountPaise: number, receipt: string, notes: Record<string, string>) {
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt, notes }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error("Razorpay order failed");
  return (await res.json()) as { id: string; amount: number };
}

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};
const hmac = (secret: string, data: string) => crypto.createHmac("sha256", secret).update(data).digest("hex");

export const verifyCheckoutSignature = (orderId: string, paymentId: string, signature: string) =>
  safeEqual(hmac(process.env.RAZORPAY_KEY_SECRET!, `${orderId}|${paymentId}`), signature);

export const verifyWebhookSignature = (rawBody: string, signature: string) =>
  Boolean(process.env.RAZORPAY_WEBHOOK_SECRET) && safeEqual(hmac(process.env.RAZORPAY_WEBHOOK_SECRET!, rawBody), signature);
