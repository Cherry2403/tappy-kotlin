package com.vuurkat.notification

import java.net.URI

data class EmailContent(val html: String, val text: String)

private fun escapeHtml(value: String) = value
	.replace("&", "&amp;")
	.replace("<", "&lt;")
	.replace(">", "&gt;")
	.replace("\"", "&quot;")
	.replace("'", "&#39;")

fun confirmationEmail(name: String, siteUrl: String, replyToEmail: String): EmailContent {
	val safeName = escapeHtml(name)
	val privacyUrl = URI.create(siteUrl).resolve("/privacy").toString()
	val termsUrl = URI.create(siteUrl).resolve("/terms").toString()

	val html = """<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>Your Tappy reservation is received</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f0ead8;color:#1e1c17;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">You are among the first to reserve. We will share updates as soon as there is news.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f0ead8;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:#f5f2e9;">
            <tr>
              <td style="padding:42px 40px 16px;font-family:Georgia,'Times New Roman',serif;color:#5c5a2e;font-size:28px;letter-spacing:0.08em;text-align:center;">VUURKAT</td>
            </tr>
            <tr>
              <td style="padding:0 40px 32px;font-family:Arial,Helvetica,sans-serif;color:#5c5a2e;font-size:12px;letter-spacing:0.12em;text-align:center;text-transform:uppercase;">A thoughtful way to connect</td>
            </tr>
            <tr>
              <td style="padding:0 40px;"><div style="height:1px;background-color:#5c5a2e;"></div></td>
            </tr>
            <tr>
              <td style="padding:36px 40px 12px;font-family:Georgia,'Times New Roman',serif;color:#5e1f35;font-size:16px;font-style:italic;">Reservation received</td>
            </tr>
            <tr>
              <td style="padding:0 40px 20px;font-family:Georgia,'Times New Roman',serif;color:#1e1c17;font-size:38px;line-height:1.1;">Your card is on hold.</td>
            </tr>
            <tr>
              <td style="padding:0 40px;font-family:Arial,Helvetica,sans-serif;color:#1e1c17;font-size:16px;line-height:1.7;">
                <p style="margin:0 0 18px;">Hi $safeName,</p>
                <p style="margin:0 0 18px;">Thank you for your interest in Tappy. You are among the first to reserve, and we will keep you first in line for updates on finishes, availability, and launch.</p>
                <p style="margin:0;">No payment has been taken. Your reservation is an expression of interest, not an order, and creates no obligation to buy.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px 36px;">
                <a href="$siteUrl" style="display:inline-block;background-color:#5e1f35;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;line-height:20px;padding:14px 24px;text-decoration:none;">View Tappy</a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 40px;"><div style="height:1px;background-color:#5c5a2e;"></div></td>
            </tr>
            <tr>
              <td style="padding:28px 40px 40px;font-family:Arial,Helvetica,sans-serif;color:#1e1c17;font-size:13px;line-height:1.6;text-align:center;">
                <p style="margin:0 0 14px;">Need to change or withdraw your reservation?<br>Reply to this email or contact <a href="mailto:$replyToEmail" style="color:#5e1f35;">$replyToEmail</a>.</p>
                <p style="margin:0;"><a href="$privacyUrl" style="color:#5c5a2e;">Privacy</a><span style="color:#5c5a2e;"> &middot; </span><a href="$termsUrl" style="color:#5c5a2e;">Terms</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>"""

	val text = listOf(
		"VUURKAT",
		"A thoughtful way to connect",
		"",
		"Reservation received",
		"",
		"Hi $name,",
		"",
		"Your card is on hold.",
		"",
		"Thank you for your interest in Tappy. You are among the first to reserve, and we will keep you first in line for updates on finishes, availability, and launch.",
		"",
		"No payment has been taken. Your reservation is an expression of interest, not an order, and creates no obligation to buy.",
		"",
		"View Tappy: $siteUrl",
		"",
		"Need to change or withdraw your reservation? Reply to this email or contact $replyToEmail.",
		"",
		"Privacy: $privacyUrl",
		"Terms: $termsUrl",
	).joinToString("\n")

	return EmailContent(html, text)
}
