# Frontend Dockerfile
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build frontend
RUN npm run build

# Serve with a simple server
RUN npm install -g serve
EXPOSE 3000
CMD ["npm", "run", "preview", "--", "--port", "3000", "--host"]


