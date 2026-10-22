package com.vuurkat.notification

data class ReservationCreatedEvent(
	val reservationId: String,
	val name: String,
	val email: String,
	val note: String?,
	val consent: Boolean,
	val submittedAt: String,
)
