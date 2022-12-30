terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.23.1"
    }
  }
}

resource "docker_container" "redis" {
  provider = docker
  image    = "redis:${var.redis_tag}"
  name     = "redis"
  env = [
    "ALLOW_EMPTY_PASSWORD=yes"
  ]
  volumes {
    container_path = "/var/lib/redis/data"
    volume_name    = "redis_vol"
  }
  networks_advanced {
    name = var.redis_network
  }
  depends_on = [
    docker_volume.redis_vol
  ]
}

resource "docker_volume" "redis_vol" {
  name = "redis_vol"
}


resource "docker_container" "redis_commander" {
  provider = docker
  image    = "rediscommander/redis-commander:${var.redis_commander_tag}"
  name     = "redis-commander"
  env = [
    "REDIS_HOSTS=redis:6379"
  ]
  networks_advanced {
    name = var.redis_network
  }
  depends_on = [
    docker_container.redis
  ]
}
