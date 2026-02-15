FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port
ENV PORT=8080
EXPOSE 8080

# Start the app
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "8080"]
