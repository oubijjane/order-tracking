#!/bin/bash
# Build React frontend
cd frontend
npm install
npm run build
cd ..

# Copy React build to Spring Boot static folder
rm -rf backend/src/main/resources/static
cp -r frontend/build backend/src/main/resources/static

# Build Spring Boot backend (skip tests for faster deploy)
cd backend
./mvnw clean package -DskipTests
cd ..

# Run Spring Boot with production profile
cd backend
java -jar target/*.jar -Dspring.profiles.active=prod