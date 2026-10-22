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
- responses: `202` `{ "reservationId", "status": "accepted" }`, `400` invalid input, `413` body too large,
  `429` more than 5 reservations/min or 30 requests/min per IP (in-memory, per instance), `503` queue unavailable

`GET /api/health` returns `{ "status": "ok" }`.

## Running locally

```bash
cp secrets/gmail.txt.example secrets/gmail.txt                    # sender Gmail address
cp secrets/gmail_password.txt.example secrets/gmail_password.txt  # Gmail app password
cp secrets/notify_email.txt.example secrets/notify_email.txt      # owner inbox
openssl rand -hex 24 > secrets/rabbitmq_password.txt              # RabbitMQ password
docker compose up --build
```

Then open http://localhost:5302.

Secrets are mounted as Docker secrets and read by Spring through `configtree:/run/secrets/`,
so no credentials live in environment variables or config files.

To build and run the tests without Docker (JDK 21):

```bash
cd backend && ./gradlew build
```

## Project structure

```
backend/
  reservation-service/    REST API, validation, rate limiting, publishes ReservationCreated
  notification-service/   RabbitMQ listener, retry + dead-letter queue, email templates
  Dockerfile              shared multi-stage build (ARG SERVICE)
frontend/                 Next.js landing page
Caddyfile                 gateway: /api/* -> reservation-service, everything else -> frontend
compose.yaml              gateway, frontend, rabbitmq, both services (internal networks, read-only containers)
```

## Next steps

- **Transactional outbox** if reservations are ever stored, so saving and publishing cannot get out of sync
- **Publisher confirms** so the API only answers `202` once RabbitMQ has accepted the message
- **Idempotent consumer**, so a retry never sends the owner a duplicate email
- **Testcontainers** integration tests against a real RabbitMQ
- Shared rate limiting (gateway or Redis) when running more than one instance
- Kubernetes deployment, metrics and tracing

