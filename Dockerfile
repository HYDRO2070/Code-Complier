# ---------- Optimised Dockerfile ----------
FROM node:18-slim

ARG DEBIAN_FRONTEND=noninteractive

# Install compilers & /usr/bin/time
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      g++ openjdk-17-jdk python3 python3-pip time && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

EXPOSE 8080
CMD ["node", "server.js"]
