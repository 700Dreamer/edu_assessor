# Stage 1: Build the frontend
FROM node:22-slim AS frontend-builder
WORKDIR /app/front/ed_front

# Enable pnpm
RUN corepack enable pnpm

# Install dependencies
COPY front/ed_front/package.json front/ed_front/pnpm-lock.yaml* ./
RUN pnpm install

# Build Next.js
COPY front/ed_front ./
RUN pnpm build

# Stage 2: Final image with Python and Node.js
FROM python:3.11-slim

# Install Node.js and Supervisor
RUN apt-get update && apt-get install -y curl supervisor && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

WORKDIR /app

# Copy python dependencies and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Copy frontend built code from the builder stage
COPY --from=frontend-builder /app/front/ed_front/node_modules /app/front/ed_front/node_modules
COPY --from=frontend-builder /app/front/ed_front/.next /app/front/ed_front/.next
COPY --from=frontend-builder /app/front/ed_front/public /app/front/ed_front/public
COPY --from=frontend-builder /app/front/ed_front/package.json /app/front/ed_front/package.json

# Expose Railway PORT (Railway injects this at runtime)
EXPOSE 3000

# Start supervisor to run both Next.js and FastAPI
CMD ["/usr/bin/supervisord", "-c", "/app/supervisord.conf"]
