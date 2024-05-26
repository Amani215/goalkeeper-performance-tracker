output "ssh_public_fingerprints" {
  value = [digitalocean_ssh_key.droplet_public_key.fingerprint]
}

output "ssh_public_key" {
  value = tls_private_key.droplet_key_pair.public_key_openssh
}
