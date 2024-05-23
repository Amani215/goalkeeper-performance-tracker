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
  ssh_keys  = [for v in digitalocean_ssh_key.ssh : v.fingerprint]
}

resource "digitalocean_volume" "gpt" {
  region                  = var.region
  name                    = var.droplet
  size                    = 100
  initial_filesystem_type = "ext4"
  description             = "docker storage"
}

resource "digitalocean_volume_attachment" "gpt" {
  droplet_id = digitalocean_droplet.gpt.id
  volume_id  = digitalocean_volume.gpt.id
}
