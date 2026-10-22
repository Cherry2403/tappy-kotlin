# Tappy API (NestJS, legacy)

NestJS API for the Tappy landing page reservation flow. Reservation requests are queued through Redis (BullMQ) and emailed by a separate worker process.

## Local development

### 1. Install dependencies

```bash
$ npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in real values (Gmail app password, notify email, a Redis password of your choice, etc.):

```bash
$ cp .env.example .env
```

`PUBLIC_SITE_URL`, `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASSWORD` are required — the app will fail to start if any is missing.

### 3. Redis (one-time setup)

Redis must be running locally for the reservation queue to work.

```bash
$ brew install redis
```

Set a password in `/opt/homebrew/etc/redis.conf` matching your `.env`'s `REDIS_PASSWORD`:

```
requirepass your-REDIS_PASSWORD-from-.env
```

Then start it as a background service — it runs while you're logged in and stops on logout/shutdown, restarting automatically next time you log in:

```bash
$ brew services start redis
```

This is a one-time setup. After this, Redis is always available and you never need to run any Redis command again — just `npm run start:dev`.

### 4. Run the API

```bash
# development
$ npm run start

# watch mode (recommended)
$ npm run start:dev

# production mode
$ npm run start:prod
```

### 5. Run the email worker (optional, only needed to actually send reservation emails)

The API only enqueues jobs; a separate worker process sends the emails. Run it in another terminal:

```bash
$ npm run build && npm run start:worker:prod
```

Without the worker running, reservation requests are still accepted and queued in Redis — they just won't be emailed until a worker processes them.

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Production deployment

Production runs via Docker Compose (`compose.yaml` at the repo root) — see that file for the full stack (gateway, frontend, api, redis, worker).
