package com.vuurkat.notification

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.Queue
import org.springframework.amqp.core.QueueBuilder
import org.springframework.amqp.core.TopicExchange
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

const val RESERVATIONS_EXCHANGE = "reservations"
const val RESERVATION_CREATED_KEY = "reservation.created"
const val RESERVATION_CREATED_QUEUE = "notification.reservation-created"
const val RESERVATION_CREATED_DLQ = "notification.reservation-created.dlq"

@Configuration
class RabbitConfig {

	@Bean
	fun reservationsExchange() = TopicExchange(RESERVATIONS_EXCHANGE)

	@Bean
	fun reservationCreatedQueue(): Queue = QueueBuilder.durable(RESERVATION_CREATED_QUEUE)
		.deadLetterExchange("")
		.deadLetterRoutingKey(RESERVATION_CREATED_DLQ)
		.build()

	@Bean
	fun reservationCreatedDlq(): Queue = QueueBuilder.durable(RESERVATION_CREATED_DLQ).build()

	@Bean
	fun reservationCreatedBinding(reservationCreatedQueue: Queue, reservationsExchange: TopicExchange): Binding =
		BindingBuilder.bind(reservationCreatedQueue).to(reservationsExchange).with(RESERVATION_CREATED_KEY)

	@Bean
	fun messageConverter() = JacksonJsonMessageConverter()
}
