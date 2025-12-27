# API

Robust, automated FastAPI scaffold.

## Quickstart

```bash
python -m venv .venv
source .venv/bin/activate
make install
make run
```

Open `http://localhost:8000/docs`.

## Endpoints

- `GET /health`
- `GET /info`

## Automation

- CI workflow runs lint and tests on push/PR.
- Docker image and compose file provided.

## Development

```bash
make lint
make test
```
