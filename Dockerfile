FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173 3001
CMD ["sh", "-c", "node server.cjs & npm run dev -- --host"]
