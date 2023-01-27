terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.23.1"
    }
  }
}

resource "docker_container" "minio" {
  provider = docker
  image    = "minio/minio:${var.minio_tag}"
  name     = "minio"
  env = [
    "MINIO_ROOT_USER=${var.MINIO_ROOT_USER}",
    "MINIO_ROOT_PASSWORD=${var.MINIO_ROOT_PASSWORD}"
  ]
  volumes {
    container_path = "/var/lib/minio/data"
    volume_name    = "minio_vol"
  }
  networks_advanced {
    name = var.minio_network
  }
  command = ["server", "--console-address", ":9001", " /data"]
}

resource "docker_volume" "minio_vol" {
  name = "minio_vol"
}
