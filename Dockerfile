# Use the official Node.js image as the base image (version 18)
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Install Python and other build dependencies
RUN apk add --no-cache python3 make g++

# Copy the package.json, yarn.lock, and other necessary files to the working directory
COPY package.json yarn.lock ./

# Install all dependencies, including development dependencies for building the app
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application for production
RUN yarn build

# Remove development dependencies to reduce the image size
RUN yarn install --production

# Expose the port that the application will run on
EXPOSE 3000

# Start the Next.js application in production mode
CMD ["yarn", "start"]
