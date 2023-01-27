terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.23.1"
    }
  }
}

resource "docker_container" "nginx" {
  provider = docker
  image    = "nginx:${var.nginx_tag}"
  name     = "nginx"
  networks_advanced {
    name = var.nginx_network
  }
  volumes {
    container_path = "/etc/nginx/conf.d"
    host_path      = var.nginx_config_path
  }
  ports {
    internal = 80
    external = 80
  }
  # ports {
  #   internal = 443
  #   external = 443
  # }
  restart = "always"
}
