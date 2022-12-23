terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.23.1"
    }
  }
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
