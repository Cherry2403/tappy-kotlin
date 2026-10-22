package com.vuurkat.notification

import org.slf4j.LoggerFactory
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Component

@Component
class ReservationListener(private val emailService: EmailService) {

	private val log = LoggerFactory.getLogger(javaClass)

	@RabbitListener(queues = [RESERVATION_CREATED_QUEUE])
	fun onReservationCreated(event: ReservationCreatedEvent) {
		emailService.sendOwnerNotification(event)
		emailService.sendConfirmation(event)
		log.info("Reservation emails sent: {}", event.reservationId)
	}
}
