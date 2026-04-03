# Use the official Node.js image as the base image
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Change ownership of the application directory to the non-root user
# The node:22 base image already includes a non-root 'node' user
RUN chown -R node:node /usr/src/app

# Switch to the non-root user
USER node

# Set NODE_ENV to production
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]