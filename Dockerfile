# Use an official Node.js runtime as a base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY tsconfig.json ./

# Install app dependencies
RUN npm install

# Copy the application code into the container
COPY ./src ./src/

COPY ./.env ./.env

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000
EXPOSE 3002
EXPOSE 3001
EXPOSE 3003

# Define the command to run your app
CMD ["npm", "start"]
