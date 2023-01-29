terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.23.1"
    }
  }
}

resource "docker_container" "grafana" {
  provider = docker
  image    = "grafana/grafana:${var.grafana_tag}"
  name     = "grafana"
  restart  = "always"
  networks_advanced {
    name = var.grafana_network
  }
  env = [
    "GF_SERVER_DOMAIN=${var.hostname}",
    "GF_SERVER_ROOT_URL=%(protocol)s://%(domain)s:%(http_port)s/grafana/",
    "GF_SERVER_SERVE_FROM_SUB_PATH=true",
    "GF_INSTALL_PLUGINS=marcusolsson-calendar-panel",
    "GF_USERS_DEFAULT_THEME=light",
    "GF_AUTH_ANONYMOUS_ENABLED=true"
  ]
  volumes {
    container_path = "/etc/grafana/provisioning"
    host_path      = "${var.grafana_config_path}/provisioning"
  }
}
