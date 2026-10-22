# syntax=docker/dockerfile:1.7

FROM eclipse-temurin:21-jdk AS builder
ARG SERVICE
WORKDIR /app
COPY gradlew settings.gradle.kts build.gradle.kts ./
COPY gradle gradle
COPY reservation-service/build.gradle.kts reservation-service/
COPY notification-service/build.gradle.kts notification-service/
COPY ${SERVICE}/src ${SERVICE}/src
RUN --mount=type=cache,id=tappy-gradle,target=/root/.gradle,sharing=locked \
    ./gradlew :${SERVICE}:bootJar --no-daemon

FROM eclipse-temurin:21-jre-alpine AS runner
ARG SERVICE
WORKDIR /app
RUN addgroup -S -g 1001 app && adduser -S -u 1001 -G app app
COPY --from=builder --chown=app:app /app/${SERVICE}/build/libs/${SERVICE}-*.jar app.jar
USER app
ENTRYPOINT ["java", "-jar", "app.jar"]
