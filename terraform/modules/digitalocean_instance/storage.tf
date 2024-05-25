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
