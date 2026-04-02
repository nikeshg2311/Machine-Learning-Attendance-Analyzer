FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application files
COPY . .

# Expose the API port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
