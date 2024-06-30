FROM openjdk:22-oracle

WORKDIR /app

COPY target/retailcheckout-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]