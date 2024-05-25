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
}

resource "tls_private_key" "droplet_key_pair" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "github_repository_deploy_key" "droplet_public_key" {
  title      = var.droplet
  repository = var.repository
  key        = tls_private_key.droplet_key_pair.public_key_openssh
  read_only  = true
}

resource "github_actions_secret" "droplet_private_key" {
  repository      = var.repository
  secret_name     = "do_ssh_${var.droplet}"
  plaintext_value = tls_private_key.droplet_key_pair.private_key_openssh
}

resource "digitalocean_ssh_key" "droplet_public_key" {
  name       = var.droplet
  public_key = tls_private_key.droplet_key_pair.public_key_openssh
}

data "github_ssh_keys" "personal_public_keys" {}

locals {
  ssh_keys = { for i, v in data.github_ssh_keys.personal_public_keys.keys : i => v }
}

resource "digitalocean_ssh_key" "personal_public_keys" {
  for_each   = local.ssh_keys
  name       = "gh-${each.key}"
  public_key = each.value
}

