FROM node:23-alpine

# Install Python, pip, AND Chromium (needed for Puppeteer)
RUN apk add --no-cache \
    python3 \
    py3-pip \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Tell Puppeteer to use the installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Install Python dependencies
RUN pip3 install --break-system-packages beautifulsoup4 requests recipe-scrapers

COPY . .

# Use Railway's PORT environment variable
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]