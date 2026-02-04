# Use official Node.js Alpine image
FROM node:22.14.0-alpine

# Set working directory
WORKDIR /app

# Copy only dependency manifests
COPY package*.json ./

# Use npm mirror in Asia (optional - rất nhanh ở VN)
# RUN npm config set registry https://registry.npmmirror.com

RUN npm install --legacy-peer-deps

# Enable caching and faster dependency install
# RUN --mount=type=cache,target=/root/.npm npm ci --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Expose port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
