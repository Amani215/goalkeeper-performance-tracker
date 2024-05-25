data "docker_registry_image" "minio" {
  name = "minio/minio:RELEASE.2024-04-18T19-09-19Z.fips"
}

resource "docker_image" "minio" {
  name          = data.docker_registry_image.minio.name
  pull_triggers = [data.docker_registry_image.minio.sha256_digest]
}

resource "docker_container" "minio" {
  name    = "minio"
  image   = docker_image.minio.image_id
  restart = "always"

  networks_advanced {
    name = data.docker_network.gpt.id
  }

  command = ["server", "--console-address", ":9001", "/data"]

  volumes {
    container_path = "/data"
    host_path      = "${var.docker_volumes}/minio"
    read_only      = false
  }

  env = [
    "MINIO_ROOT_USER=${var.minio_username}",
    "MINIO_ROOT_PASSWORD=${var.minio_password}",
    "MINIO_BROWSER_REDIRECT_URL=https://minioconsole.${var.domain}",
    "MINIO_PROMETHEUS_AUTH_TYPE=public"
  ]

  labels {
    label = "traefik.enable"
    value = "true"
  }

  labels {
    label = "traefik.http.routers.minio.rule"
    value = "Host(`minio.${var.domain}`)"
  }

  labels {
    label = "traefik.http.services.minio.loadbalancer.server.port"
    value = "9000"
  }

  labels {
    label = "traefik.http.routers.minioconsole.rule"
    value = "Host(`minioconsole.${var.domain}`)"
  }

  labels {
    label = "traefik.http.services.minioconsole.loadbalancer.server.port"
    value = "9001"
  }

  labels {
    label = "traefik.http.routers.minioconsole.middlewares"
    value = "basicauth@docker"
  }

}
