data "digitalocean_domain" "gpt" {
  name = var.domain
}

resource "digitalocean_record" "A" {
  domain = digitalocean_domain.gpt.id
  type   = "A"
  name   = var.droplet
  value  = digitalocean_droplet.gpt.ipv4_address
}

resource "digitalocean_record" "AAAA" {
  domain = digitalocean_domain.gpt.id
  type   = "AAAA"
  name   = var.droplet
  value  = digitalocean_droplet.gpt.ipv6_address
}

resource "digitalocean_record" "CNAME" {
  domain = digitalocean_domain.gpt.id
  type   = "CNAME"
  name   = "*.${var.droplet}"
  value  = var.droplet
}