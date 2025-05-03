# Use a Node.js base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install all dependencies (including Prisma CLI)
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Remix app (this generates the `build` directory)
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Set the NODE_ENV environment variable to production
ENV NODE_ENV=production
ENV API_URL=http://178.18.250.240:9050

# Start the Remix app in production mode using remix-serve
CMD ["npm", "start"]
