import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalSection } from "../components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions | VuurKat",
  description:
    "Terms and conditions for the VuurKat website and pre-launch reservation form.",
};

const CONTACT_EMAIL = "dieppn05@gmail.com";

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" effectiveDate="16 July 2026">
      <LegalSection heading="1. Who we are">
        <p>
          This website is operated by VuurKat (&ldquo;VuurKat&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;). You can contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-wine">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="2. About this website">
        <p>
          This website presents an upcoming product: an NFC business card and
          its companion dashboard. The product is not yet on sale. All
          information on this website, including descriptions, images,
          features, and any indications of pricing or availability, is
          preliminary and may change before launch without notice.
        </p>
      </LegalSection>

      <LegalSection heading="3. Reservations are not orders">
        <p>
          The reservation form on this website is an expression of interest
          only. By submitting it:
        </p>
        <ul className="ml-5 flex list-disc flex-col gap-2">
          <li>you do not place an order and no contract of sale is formed;</li>
          <li>no payment is taken and no payment details are collected;</li>
          <li>
            you take on no obligation to buy anything, and we take on no
            obligation to supply anything;
          </li>
          <li>
            we do not guarantee product availability, final specifications,
            pricing, or a launch date.
          </li>
        </ul>
        <p>
          We will use your details to contact you about your reservation,
          including letting you know when the product becomes available. You
          can withdraw your reservation at any time, free of charge, by
          emailing us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-wine">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="4. When we start selling">
        <p>
          Any future purchase will be governed by separate terms of sale made
          available to you before you place an order. If you are a consumer in
          the European Union, those terms will respect your statutory rights,
          including the pre-contractual information requirements and the
          14-day right of withdrawal under Directive 2011/83/EU (Consumer
          Rights Directive) and the legal guarantee of conformity under
          Directive (EU) 2019/771. Nothing on this website or in these terms
          limits any rights you have under applicable consumer protection law.
        </p>
      </LegalSection>

      <LegalSection heading="5. Acceptable use">
        <p>
          You agree to use this website lawfully and not to submit false,
          misleading, or abusive content through the reservation form, nor to
          interfere with the operation or security of the website.
        </p>
      </LegalSection>

      <LegalSection heading="6. Intellectual property">
        <p>
          All content on this website, including text, design, images,
          videos, and the VuurKat name, belongs to us or our licensors.
          You may not reproduce or use it for commercial purposes without our
          prior written permission.
        </p>
      </LegalSection>

      <LegalSection heading="7. Disclaimer and liability">
        <p>
          This website and its content are provided &ldquo;as is&rdquo; for
          information purposes. To the extent permitted by law, we are not
          liable for losses arising from reliance on preliminary product
          information or from temporary unavailability of the website. Nothing
          in these terms excludes or limits liability that cannot be excluded
          or limited under applicable law, including liability for intent,
          gross negligence, or death or personal injury.
        </p>
      </LegalSection>

      <LegalSection heading="8. Privacy">
        <p>
          How we handle your personal data is described in our{" "}
          <Link href="/privacy" className="text-wine">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection heading="9. Changes to these terms">
        <p>
          We may update these terms from time to time, for example when the
          product launches. The version published on this page applies, and
          the effective date above tells you when it was last changed.
        </p>
      </LegalSection>

      <LegalSection heading="10. Governing law">
        <p>
          These terms are governed by the laws applicable at our place of
          establishment. If you are a consumer residing in the European Union,
          you also benefit from the mandatory consumer protection provisions
          of the law of your country of residence, and you may bring
          proceedings before the courts of that country.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
