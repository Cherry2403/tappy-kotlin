package com.vuurkat.reservation

import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.util.concurrent.ConcurrentHashMap

class RateLimiter(
	private val limit: Int,
	private val window: Duration,
	private val clock: Clock = Clock.systemUTC(),
) {
	private data class Window(val start: Instant, val count: Int)

	private val windows = ConcurrentHashMap<String, Window>()

	fun tryAcquire(key: String): Boolean {
		val now = clock.instant()
		if (windows.size > 10_000) windows.values.removeIf { now >= it.start + window }

		val current = windows.compute(key) { _, existing ->
			if (existing == null || now >= existing.start + window) Window(now, 1)
			else existing.copy(count = existing.count + 1)
		}!!
		return current.count <= limit
	}
}
