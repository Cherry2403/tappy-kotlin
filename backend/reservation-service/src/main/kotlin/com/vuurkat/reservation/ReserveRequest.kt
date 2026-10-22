package com.vuurkat.reservation

import jakarta.validation.constraints.AssertTrue
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

const val CONSENT_MESSAGE = "You must accept the Terms & Conditions and Privacy Policy"

data class ReserveRequest(
	@NotBlank
	@Size(max = 100)
	val name: String?,

	@NotBlank
	@Email
	@Size(max = 254)
	val email: String?,

	@Size(max = 2000)
	val note: String? = null,

	@NotNull(message = CONSENT_MESSAGE)
	@AssertTrue(message = CONSENT_MESSAGE)
	val consent: Boolean?,
)

data class ReserveResponse(
	val reservationId: String,
	val status: String = "accepted",
)
