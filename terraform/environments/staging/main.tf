terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3"
    }
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2"
    }
    github = {
      source  = "integrations/github"
      version = "~> 6"
    }
  }
}

module "instance" {
  source  = "github.com/Amani215/goalkeeper-performance-tracker//terraform/modules/digitalocean_instance"
  domain  = var.do_domain
  droplet = var.do_droplet
  size    = var.do_size
  region  = var.do_region
  image   = var.do_image
  vpc     = var.do_vpc
}

provider "docker" {
  host     = "ssh://amani@${module.instance.hostname}"
  ssh_opts = ["-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=/dev/null"]
}

resource "docker_network" "gpt" {
  name = var.docker_network
}

module "docker_gpt" {
  depends_on          = [docker_network.gpt]
  source              = "github.com/Amani215/goalkeeper-performance-tracker//terraform/modules/docker_gpt"
  domain              = module.instance.hostname
  traefik_username    = var.traefik_username
  traefik_password    = var.traefik_password
  traefik_email       = var.traefik_email
  traefik_ca_resolver = var.traefik_ca_resolver
  do_dns_token        = var.do_dns_token
}
