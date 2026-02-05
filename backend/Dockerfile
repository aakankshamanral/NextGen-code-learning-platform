# 1. Use Node.js as the base image
FROM node:24.13.0

# 2. Install GCC and essential tools for C compilation
RUN apt-get update && apt-get install -y gcc g++ make

# 3. Create and set the working directory
WORKDIR /app

# 4. Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# 5. Copy the rest of your backend code
COPY . .

# 6. Expose the port your server runs on
EXPOSE 5000

# 7. Start the engine using the ESM loader
CMD ["node", "--loader", "ts-node/esm", "server.ts"]