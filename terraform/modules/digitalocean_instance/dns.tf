data "digitalocean_domain" "gpt" {
  name = var.domain
}

resource "digitalocean_record" "A" {
  domain = data.digitalocean_domain.gpt.id
  type   = "A"
  name   = var.droplet
  value  = digitalocean_droplet.gpt.ipv4_address
  ttl    = 3600
}

resource "digitalocean_record" "AAAA" {
  domain = data.digitalocean_domain.gpt.id
  type   = "AAAA"
  name   = var.droplet
  value  = digitalocean_droplet.gpt.ipv6_address
  ttl    = 3600
}

resource "digitalocean_record" "CNAME" {
  domain = data.digitalocean_domain.gpt.id
  type   = "CNAME"
  name   = "*.${var.droplet}"
  value  = "${var.droplet}.${data.digitalocean_domain.gpt.id}."
  ttl    = 3600
}
