import type { Metadata } from "next";
import LegalPage, { LegalSection } from "../components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | VuurKat",
  description:
    "How VuurKat collects and uses personal data submitted through the reservation form, in line with the GDPR.",
};

const CONTACT_EMAIL = "dieppn05@gmail.com";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" effectiveDate="16 July 2026">
      <LegalSection heading="1. Who is responsible for your data">
        <p>
          VuurKat (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is the data
          controller for personal data collected through this website. For
          anything related to your data, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-wine">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="2. What we collect">
        <p>
          We only collect personal data that you give us yourself, when you
          submit the reservation form:
        </p>
        <ul className="ml-5 flex list-disc flex-col gap-2">
          <li>your name;</li>
          <li>your email address;</li>
          <li>an optional note, if you choose to write one.</li>
        </ul>
        <p>
          We do not collect payment details, and we do not require an account.
        </p>
      </LegalSection>

      <LegalSection heading="3. No cookies, no tracking">
        <p>
          This website does not use cookies, analytics, or advertising
          trackers. Our hosting provider may keep short-lived technical logs
          (such as IP addresses) that are necessary to operate and secure the
          website; we rely on our legitimate interest in keeping the website
          secure (Article 6(1)(f) GDPR) for this.
        </p>
      </LegalSection>

      <LegalSection heading="4. Why we use your data, and on what legal basis">
        <p>We use the data from the reservation form to:</p>
        <ul className="ml-5 flex list-disc flex-col gap-2">
          <li>
            <strong>respond to your reservation</strong> and let you know when
            the product becomes available. This is a step taken at your
            request prior to entering into a contract (Article 6(1)(b) GDPR);
          </li>
          <li>
            <strong>send you occasional updates about the product</strong>,
            only with your consent given when you submit the form (Article
            6(1)(a) GDPR and Article 13 of the ePrivacy Directive). You can
            withdraw this consent at any time by emailing us, and every email
            we send tells you how to opt out.
          </li>
        </ul>
        <p>
          We do not sell your data, do not use it for advertising, and do not
          use it for automated decision-making or profiling.
        </p>
      </LegalSection>

      <LegalSection heading="5. Where your data goes">
        <p>
          When you submit the form, your details are delivered to our inbox by
          email. They are not stored in a database on this website. The only
          service providers that process your data on our behalf are:
        </p>
        <ul className="ml-5 flex list-disc flex-col gap-2">
          <li>
            <strong>Google (Gmail)</strong>, used to deliver and store the
            reservation emails. Google may process data in the United States;
            this transfer is covered by Google&rsquo;s certification under the
            EU–US Data Privacy Framework and, where applicable, EU Standard
            Contractual Clauses;
          </li>
          <li>
            <strong>our website hosting provider</strong>, which serves this
            website and keeps technical security logs.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="6. How long we keep your data">
        <p>
          We keep your reservation details until the product launches and your
          request has been handled, and no longer than necessary for that
          purpose. If you withdraw your reservation, or ask us to delete your
          data, we delete it without undue delay.
        </p>
      </LegalSection>

      <LegalSection heading="7. Your rights">
        <p>Under the GDPR you have the right to:</p>
        <ul className="ml-5 flex list-disc flex-col gap-2">
          <li>access the personal data we hold about you;</li>
          <li>have inaccurate data corrected;</li>
          <li>have your data deleted (&ldquo;right to be forgotten&rdquo;);</li>
          <li>restrict or object to our processing;</li>
          <li>receive your data in a portable format;</li>
          <li>
            withdraw your consent at any time, without affecting the
            lawfulness of processing before withdrawal.
          </li>
        </ul>
        <p>
          To exercise any of these rights, email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-wine">
            {CONTACT_EMAIL}
          </a>
          . We will respond within one month. You also have the right to lodge
          a complaint with the data protection authority in your EU country of
          residence.
        </p>
      </LegalSection>

      <LegalSection heading="8. Children">
        <p>
          This website is not directed at children, and we do not knowingly
          collect data from anyone under 16.
        </p>
      </LegalSection>

      <LegalSection heading="9. Changes to this policy">
        <p>
          If we change how we handle your data, for example when the product
          launches, we will update this page and, where the change is
          significant, notify you by email. The effective date above tells you
          when this policy was last changed.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
