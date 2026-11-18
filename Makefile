COMPOSE ?= docker compose

.PHONY: setup up down restart rebuild test lint lint-fix

setup:
	$(COMPOSE) config --quiet
	$(COMPOSE) build hugo
	$(COMPOSE) run --rm --no-deps tools npm install --ignore-scripts --no-audit --no-fund

up:
	$(COMPOSE) up -d hugo

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart hugo

rebuild:
	$(COMPOSE) build --no-cache hugo
	$(COMPOSE) up -d --force-recreate hugo

test:
	$(COMPOSE) run --build --rm --no-deps hugo --minify --destination /tmp/ciam-public

lint:
	$(COMPOSE) run --rm --no-deps tools npm run lint

lint-fix:
	$(COMPOSE) run --rm --no-deps tools npm run lint:fix
