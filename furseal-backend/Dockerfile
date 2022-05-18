FROM maven:openjdk AS build
RUN mkdir -p /workspace
WORKDIR /workspace
COPY pom.xml /workspace
COPY src /workspace/src
RUN --mount=type=cache,target=/root/.m2 mvn -f pom.xml clean package -DskipTests

FROM openjdk
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 9000
ENTRYPOINT ["java","-jar","app.jar"]