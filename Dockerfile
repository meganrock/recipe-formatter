FROM node:23-alpine

# Install Python and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Install Python dependencies
RUN pip3 install --break-system-packages beautifulsoup4 requests recipe-scrapers

# Copy all project files
COPY . .

# Use Railway's PORT environment variable
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]