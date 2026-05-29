FROM node:20-slim

RUN apt-get update && apt-get install -y \
    python3 \
    gcc \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@9

WORKDIR /app
RUN mkdir -p data

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

EXPOSE 8080
CMD ["pnpm", "start"]
