package com.vuurkat.reservation

import org.springframework.amqp.AmqpException
import org.springframework.http.HttpStatus
import org.springframework.http.converter.HttpMessageNotReadableException
import tools.jackson.databind.exc.UnrecognizedPropertyException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class ApiExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException::class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	fun handleValidation(ex: MethodArgumentNotValidException) = mapOf(
		"statusCode" to 400,
		"message" to ex.bindingResult.fieldErrors.map { "${it.field}: ${it.defaultMessage}" },
	)

	@ExceptionHandler(HttpMessageNotReadableException::class)
	@ResponseStatus(HttpStatus.BAD_REQUEST)
	fun handleBadBody(ex: HttpMessageNotReadableException): Map<String, Any> {
		val unknownField = (ex.cause as? UnrecognizedPropertyException)?.propertyName
		val message = if (unknownField != null) "property $unknownField should not exist" else "Invalid request body"
		return mapOf("statusCode" to 400, "message" to listOf(message))
	}

	@ExceptionHandler(AmqpException::class)
	@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
	fun handleQueueDown(ex: AmqpException) = mapOf(
		"statusCode" to 503,
		"message" to "Reservations are temporarily unavailable. Please try again.",
	)
}
