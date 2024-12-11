FROM node:latest

RUN apt-get update && apt-get install -y time

WORKDIR /app

COPY . /app

# Command to run the JavaScript code with time
CMD ["sh", "-c", "/usr/bin/time -f 'Execution Time: %e seconds\nMemory Used: %M KB' node user_code.js"]
