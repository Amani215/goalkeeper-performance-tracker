terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.23.1"
    }
    ghcr = {
      source  = "kreuzwerker/docker"
      version = "2.23.1"
    }
    vultr = {
      source  = "vultr/vultr"
      version = "2.12.0"
    }
  }
  cloud {
    organization = "amanibrik"

    workspaces {
      name = "local-goalkeeper"
    }
  }
}

### VULTR ###

provider "vultr" {
  api_key     = var.vultr_api_key
  rate_limit  = 100
  retry_limit = 3
}

module "vultr_instance" {
  source = "../../modules/vultr/instance"
  providers = {
    vultr = vultr
  }
}

### GHCR ###

provider "ghcr" {
  registry_auth {
    address  = "ghcr.io"
    username = var.GH_USER
    password = var.GH_PAT
  }
}


provider "docker" {
  host = "ssh://root@${module.vultr_instance.ipv4}"
}
