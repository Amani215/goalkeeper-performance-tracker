output "ssh_public_keys" {
  value = [digitalocean_ssh_key.droplet_public_key.fingerprint]
}
