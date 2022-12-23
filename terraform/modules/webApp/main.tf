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

# resource "docker_registry_image" "api_image" {
#   name = "ghcr.io/amani215/goalkeeper-performance-tracker-api:master-alpine3.15"
#   build {
#     context = path.cwd
#     auth_config {
#       host_name = "ghcr.io"
#       user_name = "amani215"
#       password  = var.password
#     }
#   }
# }

resource "docker_container" "api" {
  provider = docker
  image    = docker_image.api.name
  name     = "api"
  networks_advanced {
    name = var.web_network
  }
  env = [
    "SECRET_KEY=${var.api_secret_key}",
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
    "PROFILE_PICS_BUCKET=${var.profile_pics_bucket}",
    "GOALKEEPER_PICS_BUCKET=${var.goalkeeper_pics_bucket}",
    "TRAINING_FORMS_BUCKET=${var.training_forms_bucket}"
  ]
}

resource "docker_image" "api" {
  provider      = ghcr
  name          = data.docker_registry_image.api.name
  pull_triggers = [data.docker_registry_image.api.sha256_digest]
}

data "docker_registry_image" "api" {
  name     = var.api_image
  provider = ghcr
}
