# NestJS Load-Balanced Application

This repository contains a Docker Compose setup for a load-balanced NestJS application with PostgreSQL database.

## Architecture Overview

The setup consists of the following components:

- **NGINX Load Balancer**: Routes traffic between two NestJS application instances
- **NestJS Application (2 instances)**: Backend services that handle API requests
- **PostgreSQL Database**: Persistent storage shared by both application instances

```
                    ┌─────────────┐
                    │             │
                    │  NGINX LB   │
                    │  (Port 8081)│
                    │             │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
      ┌───────▼──────┐          ┌───────▼──────┐
      │              │          │              │
      │  NestJS App1 │          │  NestJS App2 │
      │  (Port 3000) │          │  (Port 3000) │
      │              │          │              │
      └───────┬──────┘          └───────┬──────┘
              │                         │
              └────────────┬────────────┘
                           │
                    ┌──────▼──────┐
                    │             │
                    │  PostgreSQL │
                    │  (Port 5432)│
                    │             │
                    └─────────────┘
```

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. Clone this repository

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Create the NGINX configuration file
   Create a file named `nginx.conf` in the project root with the following content:

   ```nginx
   events {
     worker_connections 1024;
   }

   http {
     upstream nestjs_app {
       server app1:3000;
       server app2:3000;
     }

     server {
       listen 80;

       location / {
         proxy_pass http://nestjs_app;
         proxy_set_header Host $host;
         proxy_set_header X-Real-IP $remote_addr;
       }
     }
   }
   ```

3. Start the services

   ```bash
   docker-compose up -d
   ```

4. Access the application at `http://localhost:8081`

## Configuration

### Environment Variables

#### NestJS Application (app1, app2)

- `DATABASE_HOST`: PostgreSQL database host
- `DATABASE_PORT`: PostgreSQL database port
- `DATABASE_USER`: PostgreSQL username
- `DATABASE_PASSWORD`: PostgreSQL password
- `DATABASE_NAME`: PostgreSQL database name

#### PostgreSQL

- `POSTGRES_USER`: PostgreSQL username
- `POSTGRES_PASSWORD`: PostgreSQL password
- `POSTGRES_DB`: PostgreSQL database name

## Services

### NGINX Load Balancer

- **Image**: nginx:latest
- **Port**: 8081 (mapped to container port 80)
- **Configuration**: Uses the `nginx.conf` file for load balancing configuration

### NestJS Application (app1, app2)

- **Build**: Uses the local Dockerfile for building the NestJS application
- **Port**: Exposes port 3000 internally
- **Restart Policy**: Always restarts on failure

### PostgreSQL Database

- **Image**: postgres:14-alpine
- **Port**: 5432 (exposed to host for direct access if needed)
- **Data Persistence**: Uses named volume `postgres_data` for database persistence

## Networks

- **app_network**: Bridge network for communication between containers

## Volumes

- **postgres_data**: Persistent volume for PostgreSQL data

## Development

To make changes to the application:

1. Modify your NestJS application code
2. Rebuild and restart the containers:
   ```bash
   docker-compose down
   docker-compose up --build -d
   ```

## Scaling

To scale the application to more instances:

```bash
docker-compose up -d --scale app=3
```

Note: If scaling beyond 2 instances, you'll need to update the nginx.conf file to include additional server entries.

## Troubleshooting

### Checking Logs

```bash
# View logs from all services
docker-compose logs

# View logs from a specific service
docker-compose logs app1
docker-compose logs nginx
```

### Accessing PostgreSQL

```bash
docker exec -it nestjs_postgres psql -U sohail -d nestjs
```

### Container Status

```bash
docker-compose ps
```
