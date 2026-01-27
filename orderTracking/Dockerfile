FROM eclipse-temurin:21-jdk

# Install native libs required by Java font/image/excel systems
RUN apt-get update && apt-get install -y \
    fontconfig \
    libfreetype6 \
    fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN ./mvnw clean package -DskipTests

EXPOSE 8080

CMD ["java", "-Djava.awt.headless=true", "-jar", "target/*.jar"]
