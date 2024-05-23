terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 2"
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
  source = "github.com/Amani215/goalkeeper-performance-tracker//terraform/modules/digitalocean_instance"
}

provider "docker" {
  host     = "ssh://amani@${module.instance.hostname}"
  ssh_opts = ["-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=/dev/null"]
}

resource "docker_network" "name" {
  name = var.docker_network
}

module "docker_gpt" {
  source = "github.com/Amani215/goalkeeper-performance-tracker//terraform/modules/docker_gpt"
  domain = module.instance.hostname
}
