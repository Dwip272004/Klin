import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Contact — Kiln" };

export default function Contact() {
  return (
    <LegalPage title="Contact" intro="Questions, payment issues or data requests? Write to us.">
      <h2>Support</h2>
      <p>{SITE.supportEmail ? <>Email <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>. We reply within 2 business days.</> : "Support email will be listed here soon."}</p>
      <h2>Data and privacy requests</h2>
      <p>To access, correct or delete your data, or to ask us to remove a profile from our results, email the same address with the details. See our <a href="/privacy">Privacy Policy</a>.</p>
      <h2>Business</h2>
      <p>{SITE.businessName}, India.</p>
    </LegalPage>
  );
}
