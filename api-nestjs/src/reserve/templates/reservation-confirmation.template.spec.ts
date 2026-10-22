import { createReservationConfirmationTemplate } from './reservation-confirmation.template';

describe('createReservationConfirmationTemplate', () => {
  it('creates branded HTML and plaintext confirmation', () => {
    const template = createReservationConfirmationTemplate({
      name: 'Tappy Guest',
      siteUrl: 'https://olive-wine.cherry.id.vn/',
      replyToEmail: 'hello@example.com',
    });

    expect(template.html).toContain('#f0ead8');
    expect(template.html).toContain('#5e1f35');
    expect(template.html).toContain('VUURKAT');
    expect(template.html).toContain('https://olive-wine.cherry.id.vn/privacy');
    expect(template.html).toContain('https://olive-wine.cherry.id.vn/terms');
    expect(template.text).toContain('No payment has been taken.');
    expect(template.text).toContain('among the first to reserve');
    expect(template.text).toContain('first in line for updates');
    expect(template.text).not.toContain('24 hours');
    expect(template.text).toContain('hello@example.com');
  });

  it('escapes untrusted names in HTML', () => {
    const template = createReservationConfirmationTemplate({
      name: '<script>alert("x")</script>',
      siteUrl: 'https://olive-wine.cherry.id.vn/',
      replyToEmail: 'hello@example.com',
    });

    expect(template.html).not.toContain('<script>');
    expect(template.html).toContain(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;',
    );
  });
});
