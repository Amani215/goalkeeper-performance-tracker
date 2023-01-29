terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.23.1"
    }
    ghcr = {
      source  = "kreuzwerker/docker"
      version = "2.23.1"
    }
  }
}

# Backend
resource "docker_container" "backend" {
  provider = docker
  image    = docker_image.backend.name
  name     = "backend"
  restart  = "always"
  networks_advanced {
    name = var.web_network
  }
  env = [
    "SECRET_KEY=${var.backend_secret_key}",
    "WTF_CSRF_SECRET_KEY=${var.wtf_csrf_secret_key}",
    "SQLALCHEMY_TRACK_MODIFICATIONS=True",
    "POSTGRES_USER=${var.pg_user}",
    "POSTGRES_PASSWORD=${var.pg_password}",
    "POSTGRES_HOST=${var.pg_host}",
    "POSTGRES_PORT=${var.pg_port}",
    "POSTGRES_DB=${var.pg_db}",
    "ADMIN_USERNAME=${var.admin_user}",
    "ADMIN_PASSWORD=${var.admin_password}",
    "REDIS_HOST=${var.redis_host}",
    "REDIS_PORT=${var.redis_port}",
    "PUBLIC_S3=${var.public_s3}",
    "AWS_DOMAIN=${var.AWS_DOMAIN}",
    "AWS_DEFAULT_REGION=${var.AWS_DEFAULT_REGION}",
    "AWS_ACCESS_KEY_ID=${var.AWS_ACCESS_KEY_ID}",
    "AWS_SECRET_ACCESS_KEY=${var.AWS_SECRET_ACCESS_KEY}",
    "PROFILE_PICS_BUCKET=${var.profile_pics_bucket}",
    "GOALKEEPER_PICS_BUCKET=${var.goalkeeper_pics_bucket}",
    "TRAINING_FORMS_BUCKET=${var.training_forms_bucket}"
  ]
}

resource "docker_image" "backend" {
  provider      = ghcr
  name          = data.docker_registry_image.backend.name
  pull_triggers = [data.docker_registry_image.backend.sha256_digest]
}

data "docker_registry_image" "backend" {
  name     = var.backend_image
  provider = ghcr
}

# WEB UI
resource "docker_container" "web_ui" {
  provider = docker
  image    = docker_image.web_ui.name
  name     = "web-ui"
  restart  = "always"
  networks_advanced {
    name = var.web_network
  }
  depends_on = [
    docker_container.backend
  ]
}

resource "docker_image" "web_ui" {
  provider      = ghcr
  name          = data.docker_registry_image.web_ui.name
  pull_triggers = [data.docker_registry_image.web_ui.sha256_digest]
}

data "docker_registry_image" "web_ui" {
  name     = var.web_ui_image
  provider = ghcr
}
