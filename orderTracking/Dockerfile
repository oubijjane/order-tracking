FROM eclipse-temurin:21-jdk

# Install native libs required by Java font/image/excel systems
RUN apt-get update && apt-get install -y \
    fontconfig \
    libfreetype6 \
    fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/orderTracking-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=prod"]
