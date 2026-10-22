package com.vuurkat.reservation

import org.junit.jupiter.api.Test
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import java.time.ZoneOffset
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class RateLimiterTest {

	private class TestClock(var now: Instant = Instant.parse("2026-01-01T00:00:00Z")) : Clock() {
		override fun instant() = now
		override fun getZone(): ZoneId = ZoneOffset.UTC
		override fun withZone(zone: ZoneId) = this
	}

	private val clock = TestClock()
	private val limiter = RateLimiter(limit = 2, window = Duration.ofMinutes(1), clock = clock)

	@Test
	fun `blocks requests over the limit`() {
		assertTrue(limiter.tryAcquire("1.1.1.1"))
		assertTrue(limiter.tryAcquire("1.1.1.1"))
		assertFalse(limiter.tryAcquire("1.1.1.1"))
	}

	@Test
	fun `counts each key separately`() {
		repeat(2) { limiter.tryAcquire("1.1.1.1") }

		assertFalse(limiter.tryAcquire("1.1.1.1"))
		assertTrue(limiter.tryAcquire("2.2.2.2"))
	}

	@Test
	fun `allows requests again after the window`() {
		repeat(3) { limiter.tryAcquire("1.1.1.1") }

		clock.now = clock.now.plus(Duration.ofMinutes(1))

		assertTrue(limiter.tryAcquire("1.1.1.1"))
	}
}
