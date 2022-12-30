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
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "3.31.0"
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

### CLOUDFLARE ###

provider "cloudflare" {
  api_token    = var.cloudflare_api_token
  api_hostname = var.cloudflare_api_hostname
}

module "cloudflare_dns" {
  source = "../../modules/dns/cloudflare"
  providers = {
    cloudflare = cloudflare
  }
  ipv4    = module.vultr_instance.ipv4
  ipv6    = module.vultr_instance.ipv6
  zone_id = var.cloudflare_zone_id
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
