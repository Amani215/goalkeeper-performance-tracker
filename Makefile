default:
	make up

.PHONY: up
up:
	docker compose --env-file .env up -d

.PHONY: upb
upb:
	docker compose --env-file .env up -d --build

.PHONY: down
down:
	docker compose down --volumes

.PHONY: test-backend
test-backend:
	./scripts/test-backend.sh

.PHONY: test-backend-file
test-backend-file:
	sh ./scripts/test-backend-file.sh

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

.PHONY: clear-db
clear-db:
	rm api/db/*.db

api/db/%.db:
	sqlite3 $@ ".databases"

.PHONY: create-db
create-db: api/db/dev.db api/db/test.db

.PHONY: upp
upp:
	docker compose -f docker-compose.prod.yml up -d --build