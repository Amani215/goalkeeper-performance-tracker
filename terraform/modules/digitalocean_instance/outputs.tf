
output "hostname" {
  value = "${var.droplet}.${data.digitalocean_domain.gpt.id}"
}
