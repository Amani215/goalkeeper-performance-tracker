terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3"
    }
  }
}

data "docker_network" "gpt" {
  name = var.docker_network
}
