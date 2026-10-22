package com.vuurkat.notification

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("tappy")
data class TappyProperties(
	val publicSiteUrl: String,
	val notifyEmail: String,
	val fromEmail: String,
)
