package com.vuurkat.reservation

import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import io.mockk.runs
import io.mockk.slot
import io.mockk.verify
import org.junit.jupiter.api.Test
import org.springframework.amqp.AmqpConnectException
import org.springframework.amqp.rabbit.core.RabbitTemplate
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNull

class ReservationServiceTest {

	private val rabbitTemplate = mockk<RabbitTemplate>()
	private val service = ReservationService(rabbitTemplate)

	private val request = ReserveRequest(name = "An", email = "an@example.com", note = "  ", consent = true)

	@Test
	fun `publishes reservation created event`() {
		val event = slot<ReservationCreatedEvent>()
		every { rabbitTemplate.convertAndSend(any<String>(), any<String>(), capture(event)) } just runs

		val response = service.create(request)

		verify { rabbitTemplate.convertAndSend(RESERVATIONS_EXCHANGE, RESERVATION_CREATED_KEY, any<Any>()) }
		assertEquals("accepted", response.status)
		assertEquals(response.reservationId, event.captured.reservationId)
		assertEquals("an@example.com", event.captured.email)
		assertNull(event.captured.note)
	}

	@Test
	fun `throws when rabbitmq is down`() {
		every { rabbitTemplate.convertAndSend(any<String>(), any<String>(), any<Any>()) } throws
			AmqpConnectException(RuntimeException("connection refused"))

		assertFailsWith<AmqpConnectException> { service.create(request) }
	}
}
