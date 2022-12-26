terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.23.1"
    }
  }
}

resource "docker_container" "pg_db" {
  provider = docker
  image    = "postgres:${var.pg_tag}"
  name     = var.db_sever_name
  env = [
    "POSTGRES_PASSWORD=${var.db_password}",
    "POSTGRES_USER=${var.db_username}",
    "POSTGRES_DB=${var.db_username}",
    "PGDATA=/var/lib/postgresql/data"
  ]
  volumes {
    container_path = "/var/lib/postgresql/data"
    volume_name    = "pg_vol"
  }
  networks_advanced {
    name = var.pg_network
  }
  depends_on = [
    docker_volume.pg_vol
  ]
}

resource "docker_volume" "pg_vol" {
  name = "pg_vol"
}

# Adminer
resource "docker_container" "adminer" {
  provider = docker
  image    = "michalhosna/adminer"
  name     = "adminer"
  networks_advanced {
    name = var.pg_network
  }
}
