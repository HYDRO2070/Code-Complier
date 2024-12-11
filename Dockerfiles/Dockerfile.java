# Use Debian-based OpenJDK image
FROM openjdk:11-jdk-slim

# Install the `time` command and clean up
RUN apt-get update && apt-get install -y time && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the application code to the container
COPY . /app

# Command to compile and run the Java program with time
CMD ["sh", "-c", "/usr/bin/time -f 'Execution Time: %e seconds\\nMemory Used: %M KB' javac user_code.java && java user_code"]
