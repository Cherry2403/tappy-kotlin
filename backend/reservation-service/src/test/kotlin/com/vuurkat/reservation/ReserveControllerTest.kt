package com.vuurkat.reservation

import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post

@WebMvcTest(ReserveController::class)
@Import(ReserveControllerTest.MockConfig::class)
class ReserveControllerTest(@Autowired private val mockMvc: MockMvc) {

	@TestConfiguration
	class MockConfig {
		@Bean
		fun reservationService() = mockk<ReservationService> {
			every { create(any()) } returns ReserveResponse("test-id")
		}
	}

	private fun postReserve(body: String) = mockMvc.post("/reserve") {
		contentType = MediaType.APPLICATION_JSON
		content = body
	}

	@Test
	fun `returns 202 for a valid reservation`() {
		postReserve("""{"name":"An","email":"an@example.com","consent":true}""").andExpect {
			status { isAccepted() }
			jsonPath("$.reservationId") { value("test-id") }
			jsonPath("$.status") { value("accepted") }
		}
	}

	@Test
	fun `returns 400 when consent is false`() {
		postReserve("""{"name":"An","email":"an@example.com","consent":false}""").andExpect {
			status { isBadRequest() }
			jsonPath("$.message[0]") { value("consent: $CONSENT_MESSAGE") }
		}
	}

	@Test
	fun `returns 400 for unknown fields`() {
		postReserve("""{"name":"An","email":"an@example.com","consent":true,"admin":true}""").andExpect {
			status { isBadRequest() }
			jsonPath("$.message[0]") { value("property admin should not exist") }
		}
	}
}
