FROM node:18-slim

RUN apt-get update && apt-get install -y \
    python3 \
    gcc \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@9

WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build

EXPOSE 3001
CMD ["pnpm", "start"]
