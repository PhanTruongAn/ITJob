# Stage 1: Build the app
FROM gradle:7.6.0-jdk17 AS builder

WORKDIR /app
COPY . .

RUN gradle build --no-daemon -x test

# Stage 2: Run the app
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy JAR file from builder
COPY --from=builder /app/build/libs/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
