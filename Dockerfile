FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN cd app/myResponder && npm ci
RUN npm run build
RUN rm -rf app/myResponder/node_modules
EXPOSE 3000
CMD ["npm", "start"]
