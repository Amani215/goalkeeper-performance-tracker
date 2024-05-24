data "docker_registry_image" "redis" {
  name = "redis/redis-stack:7.2.0-v10"
}

resource "docker_image" "redis" {
  name          = data.docker_registry_image.redis.name
  pull_triggers = [data.docker_registry_image.redis.sha256_digest]
}


resource "docker_container" "redis" {
  name    = "redis"
  image   = docker_image.redis.image_id
  restart = "always"

  networks_advanced {
    name = data.docker_network.gpt.id
  }

  volumes {
    container_path = "/data"
    host_path      = "${var.docker_volumes}/redis"
    read_only      = false
  }

  labels {
    label = "traefik.enable"
    value = "true"
  }

  labels {
    label = "traefik.http.routers.redis.rule"
    value = "Host(`redis.${var.domain}`)"
  }

  labels {
    label = "traefik.http.services.redis.loadbalancer.server.port"
    value = "8001"
  }

  labels {
    label = "traefik.http.routers.redis.middlewares"
    value = "basicauth@docker"
  }

}
