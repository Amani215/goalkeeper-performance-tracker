terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2"
    }
    github = {
      source  = "integrations/github"
      version = "~> 6"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4"
    }
  }
  backend "remote" {
    organization = "amanibrik"

    workspaces {
      name = "staging"
    }
  }
}

module "ssh" {
  source     = "github.com/Amani215/goalkeeper-performance-tracker//terraform/modules/digitalocean_ssh"
  droplet    = var.do_droplet
  repository = var.gh_repository
}
module "instance" {
  source           = "github.com/Amani215/goalkeeper-performance-tracker//terraform/modules/digitalocean_instance"
  domain           = var.do_domain
  droplet          = var.do_droplet
  size             = var.do_size
  region           = var.do_region
  image            = var.do_image
  vpc              = var.do_vpc
  ssh_fingerprints = module.ssh.ssh_public_fingerprints
  ssh_public_key   = module.ssh.ssh_public_key
}
