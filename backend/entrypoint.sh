#!/usr/bin/env sh
# entrypoint.sh

# If no .env exists at runtime, seed it from .env.example
if [ ! -f /app/.env ]; then
  echo "[entrypoint] .env missing → copying .env.example to .env"
  cp /app/.env.example /app/.env
fi

# Run the main container command (node server.js)
exec "$@"
