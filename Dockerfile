#!/bin/bash

# Use the official Node.js img as the base image
FROM node:18

# Set Working Directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json into the container
COPY  package*.json ./

# install Node.js app dependencies
RUN npm install

# Copy the Node.js Source Code into the container
COPY  . .

# Expose the PORT for Node.js to run on (environment variable)
ENV PORT 6060

# Command to run the Node.js app
CMD ["node", "dist/index.js"]