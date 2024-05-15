terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
      version = "~> 3"
    }
  }
}

resource "docker_network" "gpt" {
  name = "gpt"
}
