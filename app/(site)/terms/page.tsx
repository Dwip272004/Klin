import type { Metadata } from "next";
import LegalPage, { Support } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of Service — Kiln" };

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" intro="The rules for using Kiln. By creating an account or using the service you agree to them.">
      <h2>1. The service</h2>
      <p>Kiln lets you submit LinkedIn profile URLs and receive business contact details, and lets you post jobs on a public job board. Features may change over time.</p>

      <h2>2. Your account</h2>
      <ul>
        <li>You must be at least 18 and give accurate information.</li>
        <li>You are responsible for activity on your account and for keeping your password secure.</li>
        <li>One person or business per account. Creating accounts to collect free credits repeatedly is not allowed.</li>
      </ul>

      <h2>3. Credits and payments</h2>
      <ul>
        <li>One credit is one profile lookup. Credits are charged only for rows that return data; credits for rows with no result are returned automatically.</li>
        <li>Packs are one-time purchases in Indian rupees, paid through Razorpay. There is no subscription and no automatic renewal.</li>
        <li>Credits belong to your account, cannot be transferred or sold, and have no cash value.</li>
        <li>Prices may change; the price shown at checkout applies to that purchase. Taxes may apply.</li>
        <li>Refunds are covered by our <a href="/refunds">Refund Policy</a>.</li>
      </ul>

      <h2>4. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>break any law, including laws on privacy, unsolicited email and telemarketing;</li>
        <li>use results to harass, deceive or discriminate against anyone;</li>
        <li>resell, publish or bulk-redistribute the data you receive, or use it to build a competing database;</li>
        <li>attack, overload or reverse-engineer the service, or try to get around limits or payments;</li>
        <li>post job listings that are fake, misleading, discriminatory, or that ask candidates for money.</li>
      </ul>
      <p>You are responsible for having a lawful basis to contact the people in your results.</p>

      <h2>5. Job board</h2>
      <p>Each account can have two live job posts at a time, each live for up to 30 days. You own your posts but give us permission to display them on the site and in search engines. We may remove posts that break these terms.</p>

      <h2>6. Data accuracy</h2>
      <p>Results come from third-party sources and may be incomplete, outdated or wrong. We do not guarantee accuracy or that a given profile will return data.</p>

      <h2>7. Intellectual property</h2>
      <p>Kiln, its design and its software belong to {SITE.businessName}. You may use the service under these terms but may not copy it.</p>

      <h2>8. Suspension and termination</h2>
      <p>We may suspend or close accounts that break these terms or put the service at risk. You can stop using Kiln and delete your account at any time.</p>

      <h2>9. Disclaimers and liability</h2>
      <p>The service is provided “as is” and “as available”. To the extent the law allows, we are not liable for indirect or consequential losses, and our total liability for any claim is limited to the amount you paid us in the 3 months before the claim.</p>

      <h2>10. Governing law</h2>
      <p>These terms are governed by the laws of India. Disputes are subject to the courts at our registered location, unless the law gives you the right to go elsewhere.</p>

      <h2>11. Changes and contact</h2>
      <p>We may update these terms and will change the date above. Continuing to use Kiln after an update means you accept it. Questions: <Support />.</p>
    </LegalPage>
  );
}
