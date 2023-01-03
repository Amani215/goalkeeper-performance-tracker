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

resource "docker_network" "gpt_network" {
  name = var.gpt_network

}

module "postgres" {
  source      = "../../modules/docker/postgres"
  db_username = var.db_username
  db_password = var.db_password
  pg_network  = var.gpt_network
  depends_on = [
    docker_network.gpt_network
  ]

}

module "redis" {
  source        = "../../modules/docker/redis"
  redis_network = var.gpt_network
  depends_on = [
    docker_network.gpt_network
  ]

}

module "minio" {
  source              = "../../modules/docker/minio"
  MINIO_ROOT_USER     = var.AWS_ACCESS_KEY_ID
  MINIO_ROOT_PASSWORD = var.AWS_SECRET_ACCESS_KEY
  minio_network       = var.gpt_network
  depends_on = [
    docker_network.gpt_network
  ]

}

module "webApp" {
  source                = "../../modules/docker/webApp"
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
  source          = "../../modules/docker/grafana"
  grafana_network = var.gpt_network
  depends_on = [
    docker_network.gpt_network
  ]

}

module "nginx" {
  source        = "../../modules/docker/nginx"
  nginx_network = var.gpt_network
  depends_on = [
    docker_network.gpt_network,
    module.grafana,
    module.webApp
  ]

}
