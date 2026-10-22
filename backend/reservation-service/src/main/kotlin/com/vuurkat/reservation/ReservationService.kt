package com.vuurkat.reservation

import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.UUID

@Service
class ReservationService(private val rabbitTemplate: RabbitTemplate) {

	fun create(request: ReserveRequest): ReserveResponse {
		val event = ReservationCreatedEvent(
			reservationId = UUID.randomUUID().toString(),
			name = request.name!!,
			email = request.email!!,
			note = request.note?.ifBlank { null },
			consent = request.consent!!,
			submittedAt = Instant.now().toString(),
		)
		rabbitTemplate.convertAndSend(RESERVATIONS_EXCHANGE, RESERVATION_CREATED_KEY, event)
		return ReserveResponse(event.reservationId)
	}
}
