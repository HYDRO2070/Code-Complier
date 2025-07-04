FROM node:18

RUN apt-get update && \
    apt-get install -y g++ openjdk-17-jdk python3 time

WORKDIR /app
COPY . .
RUN npm install

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

CMD ["node", "server.js"]
