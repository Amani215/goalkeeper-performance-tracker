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
    null = {
      source = "hashicorp/null"
      version = "3.2.1"
    }
  }
  backend "remote" {
    organization = "amanibrik"

    workspaces {
      name = "goalkeeper-performance-tracker"
    }
  }
}

### VULTR ###

provider "vultr" {
  api_key     = var.vultr_api_key
  rate_limit  = 100
  retry_limit = 3
}

provider "null" {

}

module "vultr_instance" {
  source = "github.com/Amani215/goalkeeper-performance-tracker//terraform/mods/vultr/instance"
  providers = {
    vultr = vultr
  }
}

module "ssh" {
  source = "github.com/Amani215/goalkeeper-performance-tracker//terraform/mods/vultr/ssh"
  depends_on = [
    module.vultr_instance
  ]
  ipv4 = module.vultr_instance.ipv4
}



### GHCR ###

provider "ghcr" {
  registry_auth {
    address  = "ghcr.io"
    username = var.GH_USER
    password = var.GH_PAT
  }
  host     = "ssh://root@${module.vultr_instance.ipv4}"
  ssh_opts = ["-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=/dev/null"]
}

provider "docker" {
  host     = "ssh://root@${module.vultr_instance.ipv4}"
  ssh_opts = ["-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=/dev/null"]
}

resource "docker_network" "gpt_network" {
  name = var.gpt_network
  depends_on = [
    module.ssh
  ]
}

module "postgres" {
  source      = "github.com/Amani215/goalkeeper-performance-tracker//terraform/mods/docker/postgres"
  db_username = var.db_username
  db_password = var.db_password
  pg_network  = var.gpt_network
  depends_on = [
    docker_network.gpt_network
  ]

}

module "redis" {
  source        = "github.com/Amani215/goalkeeper-performance-tracker//terraform/mods/docker/redis"
  redis_network = var.gpt_network
  depends_on = [
    docker_network.gpt_network
  ]

}

module "minio" {
  source              = "github.com/Amani215/goalkeeper-performance-tracker//terraform/mods/docker/minio"
  MINIO_ROOT_USER     = var.AWS_ACCESS_KEY_ID
  MINIO_ROOT_PASSWORD = var.AWS_SECRET_ACCESS_KEY
  minio_network       = var.gpt_network
  depends_on = [
    docker_network.gpt_network
  ]

}

module "webApp" {
  source                = "github.com/Amani215/goalkeeper-performance-tracker//terraform/mods/docker/webApp"
  backend_secret_key    = var.backend_secret_key
  wtf_csrf_secret_key   = var.wtf_csrf_secret_key
  web_network           = var.gpt_network
  admin_user            = var.admin_user
  admin_password        = var.admin_password
  pg_db                 = var.db_username
  pg_user               = var.db_username
  pg_host               = var.db_username
  pg_password           = var.db_password
  public_s3             = var.public_s3
  AWS_DOMAIN            = var.AWS_DOMAIN
  AWS_ACCESS_KEY_ID     = var.AWS_ACCESS_KEY_ID
  AWS_DEFAULT_REGION    = var.AWS_DEFAULT_REGION
  AWS_SECRET_ACCESS_KEY = var.AWS_SECRET_ACCESS_KEY
  providers = {
    docker = docker
    ghcr   = ghcr
  }
  depends_on = [
    docker_network.gpt_network,
    module.postgres,
    module.redis,
    module.minio
  ]
}

module "grafana" {
  source          = "github.com/Amani215/goalkeeper-performance-tracker//terraform/mods/docker/grafana"
  grafana_network = var.gpt_network
  depends_on = [
    docker_network.gpt_network,
    module.ssh
  ]

}

# module "nginx" {
#   source        = "github.com/Amani215/goalkeeper-performance-tracker//terraform/mods/docker/nginx"
#   nginx_network = var.gpt_network
#   depends_on = [
#     docker_network.gpt_network,
#     module.grafana,
#     module.webApp
#     module.ssh
#   ]
# }
