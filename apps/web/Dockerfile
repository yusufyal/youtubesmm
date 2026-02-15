FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Increase Node.js memory for build
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Build the Next.js app
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Reset memory limit for runtime
ENV NODE_OPTIONS=""
ENV PORT=8080
EXPOSE 8080

# Start the app
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "8080"]
