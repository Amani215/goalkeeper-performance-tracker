default:
	make up

.PHONY: up
up:
	docker compose --env-file .env up -d

.PHONY: down
down:
	docker compose down --volumes

.PHONY: test-backend
test-backend:
	./scripts/test-backend.sh

.PHONY: test-backend-ci
test-backend-ci:
	python3 -m pytest

.PHONY: lint-web-ui
lint-web-ui:
	cd web-ui && yarn lint

.PHONY: clear
clear:
	docker system prune -a -f --volumes

.PHONY: restart
restart: down up
