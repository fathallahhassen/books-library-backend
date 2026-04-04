## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

### Run Commands

1. **Start Docker Infrastructure (Production & Monitoring):**
   `docker compose up -d --build`

2. **Start Local Database (If stopped):**
   `sudo systemctl start postgresql`

---

### Service Access & URLs

- **Local Dev API (swagger):** http://localhost:3000/api
- **Docker Prod API (swagger):** http://localhost:3006/api
- **Grafana (Monitoring):** http://localhost:3007 (User: `admin` / Pass: `admin`)
- **Prometheus (Status):** http://localhost:9091/targets
- **Postgres (Local):** localhost:5432

*Note: Port 5432 is reserved for your local database. Docker services now run their own internal database to avoid
conflicts.*
