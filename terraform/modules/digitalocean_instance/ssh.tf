
data "github_ssh_keys" "ssh" {}

locals {
  ssh_keys = {for i, v in data.github_ssh_keys.ssh.keys: i => v}
}

resource "digitalocean_ssh_key" "ssh" {
  for_each = local.ssh_keys
  name       = "gh-${each.key}"
  public_key = each.value
}
