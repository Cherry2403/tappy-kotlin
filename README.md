# Tappy (Kotlin rewrite)

Reservation backend for the TAPPY landing page (a VuurKat product), rebuilt with Kotlin, Spring Boot and RabbitMQ.

## About this repo

This is a personal learning project, **not the original Tappy repository**.
The original used Next.js with a NestJS API and a Redis/BullMQ worker. Coming from NestJS, I rewrote the backend
to learn Kotlin, Spring Boot and event-driven services. The frontend and the API contract are unchanged.

## Architecture

```
Browser ─> Caddy ─┬─> /api/* ─> reservation-service ──ReservationCreated──> RabbitMQ ─> notification-service ─> Gmail SMTP
                  └─> /*     ─> frontend (Next.js)
```

- **reservation-service** validates `POST /reserve`, publishes an event and returns `202 Accepted`.
- **notification-service** consumes the event and emails the owner and the visitor.
  Failed sends are retried with exponential backoff, then moved to a dead-letter queue.

Sending email is slow and can fail, so it should not block the request. With a queue in between,
the visitor still gets `202` when Gmail is down, and no message is lost.
There is no database because the product only needs to send emails.

## API

`POST /api/reserve`

```json
{ "name": "Jane Doe", "email": "jane@example.com", "note": "optional", "consent": true }
```

- `name` ≤ 100 chars, `email` valid and ≤ 254 chars, `note` optional and ≤ 2000 chars, `consent` must be `true`
- unknown fields are rejected, body is limited to 16 KB
- responses: `202` `{ "reservationId", "status": "accepted" }`, `400` invalid input,
  `429` more than 5 requests/min (in-memory, per instance), `503` queue unavailable

`GET /api/health` returns `{ "status": "ok" }`.

## Running locally

```bash
cp secrets/gmail.txt.example secrets/gmail.txt                    # sender Gmail address
cp secrets/gmail_password.txt.example secrets/gmail_password.txt  # Gmail app password
cp secrets/notify_email.txt.example secrets/notify_email.txt      # owner inbox
docker compose up --build
```

Then open http://localhost. To build and test the backend only (JDK 21): `cd backend && ./gradlew build`.


