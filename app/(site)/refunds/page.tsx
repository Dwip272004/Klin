import type { Metadata } from "next";
import LegalPage, { Support } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Refund & Cancellation Policy — Kiln" };

export default function Refunds() {
  return (
    <LegalPage title="Refund & Cancellation Policy" intro="Kiln sells one-time credit packs for digital service, so there is nothing to cancel and nothing to ship.">
      <h2>No subscriptions</h2>
      <p>Packs are paid once. We never charge you again automatically.</p>

      <h2>Automatic credit returns</h2>
      <p>When you start a run, credits are held. If a profile returns no data, or the run fails, the held credit for that row is returned to your balance straight away. You do not need to ask.</p>

      <h2>Refunds for unused credits</h2>
      <ul>
        <li>If you have not used any credits from a pack, you can request a refund within <strong>7 days</strong> of purchase.</li>
        <li>If part of a pack has been used, we can refund the value of the unused credits within the same 7 days.</li>
        <li>Credits that were successfully used (a row returned data) are not refundable.</li>
        <li>Free credits are not refundable and have no cash value.</li>
      </ul>

      <h2>Payment problems</h2>
      <p>If you were charged but credits did not appear, or you were charged twice, write to us with your Razorpay payment ID. We will fix it or refund the extra charge.</p>

      <h2>How to request a refund</h2>
      <p>Email <Support /> from your account email with your payment ID and the reason. We reply within 2 business days.</p>

      <h2>When you will get your money</h2>
      <p>Approved refunds go back to the original payment method through Razorpay. Banks usually take 5 to 7 business days to show them.</p>
    </LegalPage>
  );
}
