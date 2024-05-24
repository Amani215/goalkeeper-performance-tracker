data "docker_registry_image" "traefik" {
  name = "traefik:v3.0"
}

resource "docker_image" "traefik" {
  name          = data.docker_registry_image.traefik.name
  pull_triggers = [data.docker_registry_image.traefik.sha256_digest]
}

resource "docker_container" "traefik" {
  name    = "traefik"
  image   = docker_image.traefik.image_id
  restart = "always"

  networks_advanced {
    name = data.docker_network.gpt.id
  }

  command = [
    "--providers.docker=true",
    "--providers.docker.exposedByDefault=false",
    "--api.dashboard=true",
    "--api.debug=true",
    "--metrics=true",
    "--metrics.prometheus=true",
    "--metrics.prometheus.addEntryPointsLabels=true",
    "--metrics.prometheus.addrouterslabels=true",
    "--log.filePath=/var/log/traefik/traefik.log",
    "--log.format=json",
    "--log.level=WARN",
    "--accesslog=true",
    "--accesslog.filepath=/var/log/traefik/traefik_access.log",
    "--accesslog.format=json",

    "--certificatesresolvers.staging.acme.email=${var.traefik_email}",
    "--certificatesresolvers.staging.acme.storage=/etc/traefik/certs/staging.json",
    "--certificatesresolvers.staging.acme.caserver=https://acme-staging-v02.api.letsencrypt.org/directory",
    "--certificatesresolvers.staging.acme.dnschallenge=true",
    "--certificatesresolvers.staging.acme.dnschallenge.provider=digitalocean",

    "--certificatesresolvers.prod.acme.email=${var.traefik_email}",
    "--certificatesresolvers.prod.acme.storage=/etc/traefik/certs/prod.json",
    "--certificatesresolvers.prod.acme.caserver=https://acme-v02.api.letsencrypt.org/directory",
    "--certificatesresolvers.prod.acme.dnschallenge=true",
    "--certificatesresolvers.prod.acme.dnschallenge.provider=digitalocean",

    "--entryPoints.web.address=:80",
    "--entrypoints.web.http.redirections.entrypoint.to=websecure",
    "--entryPoints.web.http.redirections.entrypoint.scheme=https",
    "--entryPoints.websecure.address=:443",
    "--entrypoints.websecure.asDefault=true",
    "--entrypoints.websecure.http.tls.certresolver=${var.traefik_ca_resolver}",
    "--entrypoints.websecure.http.tls.domains[0].main=${var.domain}",
    "--entrypoints.websecure.http.tls.domains[0].sans=*.${var.domain}"
  ]

  volumes {
    container_path = "/var/run/docker.sock"
    host_path      = "/var/run/docker.sock"
    read_only      = true
  }

  volumes {
    container_path = "/etc/traefik/certs"
    host_path      = "/etc/traefik/certs"
    read_only      = false
  }

  volumes {
    container_path = "/var/log/traefik"
    host_path      = "/var/logs/traefik"
    read_only      = false
  }

  ports {
    internal = 443
    external = 443
  }

  ports {
    internal = 80
    external = 80
  }

  labels {
    label = "traefik.enable"
    value = "true"
  }

  labels {
    label = "traefik.http.routers.traefik.rule"
    value = "Host(`traefik.${var.domain}`)"
  }

  labels {
    label = "traefik.http.routers.traefik.service"
    value = "api@internal"
  }

  labels {
    label = "traefik.http.services.traefik.loadbalancer.server.port"
    value = "8080"
  }

  labels {
    label = "traefik.http.middlewares.basicauth.basicauth.users"
    value = "${var.traefik_username}:${bcrypt(var.traefik_password)}"
  }

  labels {
    label = "traefik.http.routers.traefik.middlewares"
    value = "basicauth@docker"
  }

  env = [
    "DO_AUTH_TOKEN=${var.do_dns_token}"
  ]

}
