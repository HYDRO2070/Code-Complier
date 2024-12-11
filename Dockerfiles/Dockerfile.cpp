# Use the appropriate base image
FROM gcc:latest

# Install time command
RUN apt-get update && apt-get install -y time

# Set the working directory
WORKDIR /app

# Copy the user code into the container
COPY . /app

# Command to compile and run the user code with time
CMD ["sh", "-c", "/usr/bin/time -f 'Execution Time: %e seconds\nMemory Used: %M KB' g++ user_code.cpp -o user_code && ./user_code"]
