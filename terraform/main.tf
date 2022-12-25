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
  }
}

provider "ghcr" {
  registry_auth {
    address  = "ghcr.io"
    username = var.GH_USER
    password = var.GH_PAT
  }
}


provider "docker" {
  host = "unix:///var/run/docker.sock"
}

resource "docker_network" "gpt_network" {
  name = var.gpt_network
}

module "postgres" {
  source      = "./modules/postgres"
  db_username = var.db_username
  db_password = var.db_password
  pg_network  = var.gpt_network
  depends_on = [
    docker_network.gpt_network
  ]
}

module "redis" {
  source        = "./modules/redis"
  redis_network = var.gpt_network
  depends_on = [
    docker_network.gpt_network
  ]
}

module "minio" {
  source              = "./modules/minio"
  MINIO_ROOT_USER     = var.MINIO_ROOT_USER
  MINIO_ROOT_PASSWORD = var.MINIO_ROOT_PASSWORD
  minio_network       = var.gpt_network
  depends_on = [
    docker_network.gpt_network
  ]
}

module "webApp" {
  source                = "./modules/webApp"
  api_secret_key        = var.api_secret_key
  wtf_csrf_secret_key   = var.wtf_csrf_secret_key
  web_network           = var.gpt_network
  admin_user            = var.admin_user
  admin_password        = var.admin_password
  pg_db                 = var.db_username
  pg_user               = var.db_username
  pg_host               = var.db_username
  pg_password           = var.db_password
  public_s3             = var.public_s3
  MINIO_ROOT_USER       = var.MINIO_ROOT_USER
  MINIO_ROOT_PASSWORD   = var.MINIO_ROOT_PASSWORD
  AWS_DOMAIN            = var.AWS_DOMAIN
  AWS_ACCESS_KEY_ID     = var.AWS_ACCESS_KEY_ID
  AWS_DEFAULT_REGION    = var.AWS_DEFAULT_REGION
  AWS_SECRET_ACCESS_KEY = var.AWS_SECRET_ACCESS_KEY
  providers = {
    docker = docker
    ghcr   = ghcr
  }
  depends_on = [
    docker_network.gpt_network
  ]
}
