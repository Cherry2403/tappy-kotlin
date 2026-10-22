package com.vuurkat.reservation

import org.springframework.amqp.core.TopicExchange
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

const val RESERVATIONS_EXCHANGE = "reservations"
const val RESERVATION_CREATED_KEY = "reservation.created"

@Configuration
class RabbitConfig {

	@Bean
	fun reservationsExchange() = TopicExchange(RESERVATIONS_EXCHANGE)

	@Bean
	fun messageConverter() = JacksonJsonMessageConverter()
}
