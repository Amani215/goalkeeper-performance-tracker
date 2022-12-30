terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "3.31.0"
    }
  }
}

resource "cloudflare_record" "ipv4" {
  zone_id = var.zone_id
  name    = var.subdomain
  value   = var.ipv4
  type    = "A"
  ttl     = 3600
}

resource "cloudflare_record" "ipv6" {
  zone_id = var.zone_id
  name    = var.subdomain
  value   = var.ipv6
  type    = "AAAA"
  ttl     = 3600
}

resource "cloudflare_record" "alias" {
  zone_id = var.zone_id
  name    = "*.${var.subdomain}"
  value   = var.subdomain
  type    = "CNAME"
  ttl     = 3600
  depends_on = [
    cloudflare_record.ipv4,
    cloudflare_record.ipv6
  ]
}
