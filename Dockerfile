FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN cd app/myResponder && npm ci && npm run build && rm -rf node_modules
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
