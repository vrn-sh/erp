# Build configuration
# -------------------

APP_NAME = `grep -Eo '"name": "\w*"' package.json | cut -d ':' -f 2 | tr -d '"'`
APP_VERSION = `grep -Eo '"version": "[0-9\.]*"' package.json | cut -d ':' -f 2 | tr -d '"'`
GIT_REVISION = `git rev-parse HEAD`
DOCKER_IMAGE_TAG ?= $(APP_VERSION)
DOCKER_LOCAL_IMAGE = $(APP_NAME):$(DOCKER_IMAGE_TAG)

# Introspection targets
# ---------------------

.PHONY: help
help: header targets

.PHONY: header
header:
	@echo "\033[34mEnvironment\033[0m"
	@echo "\033[34m---------------------------------------------------------------\033[0m"
	@printf "\033[33m%-23s\033[0m" "APP_NAME"
	@printf "\033[35m%s\033[0m" $(APP_NAME)
	@echo ""
	@printf "\033[33m%-23s\033[0m" "APP_VERSION"
	@printf "\033[35m%s\033[0m" $(APP_VERSION)
	@echo ""
	@printf "\033[33m%-23s\033[0m" "GIT_REVISION"
	@printf "\033[35m%s\033[0m" $(GIT_REVISION)
	@echo ""
	@printf "\033[33m%-23s\033[0m" "DOCKER_IMAGE_TAG"
	@printf "\033[35m%s\033[0m" $(DOCKER_IMAGE_TAG)
	@echo ""
	@printf "\033[33m%-23s\033[0m" "DOCKER_LOCAL_IMAGE"
	@printf "\033[35m%s\033[0m" $(DOCKER_LOCAL_IMAGE)
	@echo "\n"

.PHONY: targets
targets:
	@echo "\033[34mTargets\033[0m"
	@echo "\033[34m---------------------------------------------------------------\033[0m"
	@perl -nle'print $& if m{^[a-zA-Z_-\d]+:.*?## .*$$}' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'

# Build targets
# -------------

.PHONY: update
update: ## Updates dependencies
	yarn outdated

.PHONY: docker
docker: ## Build the Docker image
	docker build --tag voron-web .

# Development targets
# -------------------

.PHONY: run
run: dependencies ## Run the web client
	yarn dev --host


.PHONY: build
build: dependencies ## Build the project
	yarn build


.PHONY: watch
watch: dependencies ## Runs the project preview
	yarn run dev

.PHONY: dependencies
dependencies: ## Install dependencies
	yarn


# Check, lint and format targets
# ------------------------------

.PHONY: check
check: dependencies ## Run various checks on project files
	rm -rf dist
	yarn run lint
	yarn run build
