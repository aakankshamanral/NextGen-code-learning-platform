# Use a slim Node image for faster downloads and smaller footprint
FROM node:20-slim

# Install GCC compiler
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Security: Don't run user code as root
RUN useradd -m sandbox
USER sandbox

EXPOSE 5000

# Start server
CMD ["npx", "ts-node", "server.ts"]