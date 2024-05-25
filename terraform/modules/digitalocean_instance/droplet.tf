resource "digitalocean_vpc" "gpt" {
  name   = var.vpc
  region = var.region
}

resource "digitalocean_droplet" "gpt" {
  image     = var.image
  name      = var.droplet
  region    = var.region
  size      = var.size
  ipv6      = true
  user_data = file("${path.module}/cloud-init.yaml")
  vpc_uuid  = digitalocean_vpc.gpt.id
  ssh_keys  = var.ssh_keys
}
