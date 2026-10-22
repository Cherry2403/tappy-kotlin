package com.vuurkat.notification

import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service

@Service
class EmailService(
	private val mailSender: JavaMailSender,
	private val props: TappyProperties,
) {

	fun sendOwnerNotification(event: ReservationCreatedEvent) {
		val text = listOf(
			"Reservation ID: ${event.reservationId}",
			"Submitted: ${event.submittedAt}",
			"Name: ${event.name}",
			"Email: ${event.email}",
			"Note: ${event.note ?: "-"}",
			"Consent to Terms & Privacy Policy: yes",
		).joinToString("\n")

		send(
			to = props.notifyEmail,
			replyTo = event.email,
			subject = "[Tappy] New reservation request",
			text = text,
		)
	}

	fun sendConfirmation(event: ReservationCreatedEvent) {
		val email = confirmationEmail(event.name, props.publicSiteUrl, props.notifyEmail)

		send(
			to = event.email,
			replyTo = props.notifyEmail,
			subject = "Your Tappy reservation is received",
			text = email.text,
			html = email.html,
		)
	}

	private fun send(to: String, replyTo: String, subject: String, text: String, html: String? = null) {
		val message = mailSender.createMimeMessage()
		val helper = MimeMessageHelper(message, html != null, "UTF-8")
		helper.setFrom(props.fromEmail, "VuurKat")
		helper.setTo(to)
		helper.setReplyTo(replyTo)
		helper.setSubject(subject)
		if (html != null) helper.setText(text, html) else helper.setText(text)
		mailSender.send(message)
	}
}
