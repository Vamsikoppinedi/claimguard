FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY claimguard_backend/ ./

RUN chmod +x gradlew
RUN ./gradlew build

EXPOSE 8080

CMD ["sh", "-c", "java -jar build/libs/*SNAPSHOT.jar"]