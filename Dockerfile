FROM node:23-alpine

# Install Python and pip (Alpine uses apk, not apt-get)
RUN apk add --no-cache python3 py3-pip

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