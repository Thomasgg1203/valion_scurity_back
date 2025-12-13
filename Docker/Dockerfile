# 1. Use Node.js 22 Alpine for smaller image size
FROM node:22-alpine

# 2. Set timezone (default to America/Bogota, can be overridden)
ARG TZ=America/Bogota
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    apk del tzdata

# 3. Create working directory inside container
WORKDIR /app

# 4. Copy package files first (better for Docker cache)
COPY package*.json ./

# 5. Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# 6. Copy entire project to /app
COPY . .

# 7. Build TypeScript (generates /dist folder)
RUN npm run build

# 8. Expose backend port (dynamically set via ENV)
ARG PORT=3000
EXPOSE ${PORT}

# 9. Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:${PORT}/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 10. Run application in production mode
CMD ["npm", "run", "start:prod"]