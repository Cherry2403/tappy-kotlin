package com.vuurkat.reservation

import org.springframework.stereotype.Service
import java.util.UUID

@Service
class ReservationService {

	fun create(request: ReserveRequest): ReserveResponse {
		val reservationId = UUID.randomUUID().toString()
		return ReserveResponse(reservationId)
	}
}
