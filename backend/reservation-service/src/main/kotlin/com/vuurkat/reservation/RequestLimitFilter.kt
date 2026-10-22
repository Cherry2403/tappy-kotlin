package com.vuurkat.reservation

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.time.Duration

const val MAX_BODY_BYTES = 16 * 1024L

@Component
class RequestLimitFilter : OncePerRequestFilter() {

	private val globalLimiter = RateLimiter(limit = 30, window = Duration.ofMinutes(1))
	private val reserveLimiter = RateLimiter(limit = 5, window = Duration.ofMinutes(1))

	override fun doFilterInternal(request: HttpServletRequest, response: HttpServletResponse, chain: FilterChain) {
		if (request.requestURI == "/health") return chain.doFilter(request, response)

		val ip = request.remoteAddr
		val isReserve = request.method == "POST" && request.requestURI == "/reserve"

		if (!globalLimiter.tryAcquire(ip) || (isReserve && !reserveLimiter.tryAcquire(ip))) {
			return reject(response, HttpStatus.TOO_MANY_REQUESTS, "Too many requests. Please try again later.")
		}
		if (request.contentLengthLong > MAX_BODY_BYTES) {
			return reject(response, HttpStatus.CONTENT_TOO_LARGE, "Request body is too large.")
		}
		chain.doFilter(request, response)
	}

	private fun reject(response: HttpServletResponse, status: HttpStatus, message: String) {
		response.status = status.value()
		response.contentType = MediaType.APPLICATION_JSON_VALUE
		response.writer.write("""{"statusCode":${status.value()},"message":"$message"}""")
	}
}
