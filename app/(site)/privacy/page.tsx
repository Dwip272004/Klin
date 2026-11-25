import type { Metadata } from "next";
import LegalPage, { Support } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy — Kiln" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" intro={`How ${SITE.businessName} (“Kiln”, “we”) collects, uses and protects personal data when you use this website and service.`}>
      <h2>1. What we collect</h2>
      <ul>
        <li><strong>Account data:</strong> your name, email address and password (stored hashed, never in plain text), or your Google profile name and email if you sign in with Google.</li>
        <li><strong>Profile data:</strong> optional details you add, such as company, job title, LinkedIn URL and bio.</li>
        <li><strong>Enrichment inputs and results:</strong> the LinkedIn profile URLs you submit, and the results returned for them (such as name, job title, company, location and work email).</li>
        <li><strong>Job posts:</strong> the content you publish on the job board, which is public.</li>
        <li><strong>Payment records:</strong> order amount, plan, status and Razorpay order and payment IDs. We do not see or store your card, UPI or bank details; Razorpay handles them.</li>
        <li><strong>Technical data:</strong> a sign-in session cookie, and standard server logs (IP address, browser type, pages requested).</li>
      </ul>

      <h2>2. How we use it</h2>
      <ul>
        <li>To create your account, sign you in and keep your session secure.</li>
        <li>To run enrichment, keep a credit balance, and show your run history.</li>
        <li>To take payments, apply credits and issue receipts.</li>
        <li>To prevent abuse and fraud, and to keep the service running.</li>
        <li>To respond to support requests and meet legal obligations.</li>
      </ul>
      <p>We do not sell your personal data. We do not use it for advertising.</p>

      <h2>3. Who we share it with</h2>
      <p>We use service providers who process data on our behalf:</p>
      <ul>
        <li><strong>Supabase</strong>: database and authentication.</li>
        <li><strong>Vercel</strong>: website hosting.</li>
        <li><strong>Razorpay</strong>: payment processing.</li>
        <li><strong>Third-party data providers</strong>: when you run enrichment, the LinkedIn URLs you submit are sent to a data provider to look up business contact details.</li>
        <li><strong>Google</strong>: only if you choose to sign in with Google.</li>
      </ul>
      <p>We may also disclose data when required by law or to protect our rights and users.</p>

      <h2>4. Information about other people</h2>
      <p>Enrichment returns business contact details about people who are not our users. You are responsible for having a lawful reason to contact them and for following applicable laws on email and calling. If your details appear in a result and you want them removed, write to <Support /> with the profile URL and we will delete the stored result and tell the data provider where we can.</p>

      <h2>5. Cookies</h2>
      <p>We use only the cookies needed to keep you signed in. We do not use advertising or tracking cookies.</p>

      <h2>6. How long we keep data</h2>
      <p>Account, profile and enrichment data is kept while your account is active. When you delete your account, we delete your profile, runs and results. Payment and credit records may be kept for as long as tax and accounting law requires.</p>

      <h2>7. Your rights</h2>
      <p>You can ask to access, correct, download or delete your personal data, and to withdraw consent, at any time. You can edit your profile in the app. For anything else, contact <Support />. Under India’s Digital Personal Data Protection Act, 2023, you may also nominate someone to exercise these rights on your behalf and complain to the Data Protection Board of India if we do not resolve your concern.</p>

      <h2>8. Security</h2>
      <p>Data is encrypted in transit, access to each user’s data is restricted by database-level rules, and secret keys are kept on the server only. No system is perfectly secure, so please use a strong, unique password.</p>

      <h2>9. Children</h2>
      <p>Kiln is for adults and is not intended for anyone under 18.</p>

      <h2>10. International transfers</h2>
      <p>Our providers may process data outside India. By using Kiln you agree to this, subject to applicable law.</p>

      <h2>11. Changes</h2>
      <p>We will post updates on this page and change the date above. For material changes we will notify you by email or in the app.</p>

      <h2>12. Contact and grievances</h2>
      <p>Questions or complaints: <Support />. Grievance contact: {SITE.businessName}. We aim to respond within 7 days.</p>
    </LegalPage>
  );
}
