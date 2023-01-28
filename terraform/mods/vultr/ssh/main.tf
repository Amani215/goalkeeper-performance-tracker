terraform {
  required_providers {
    null = {
      source = "hashicorp/null"
      version = "3.2.1"
    }
  }
}

resource "null_resource" "gh_repo" {
  triggers = {
    ipv4 = var.ipv4
  }

  provisioner "remote-exec" {
    # Bootstrap script called with private_ip of each node in the cluster
    inline = [
      "git clone ${var.gh_repo} ${var.gh_repo_dir}",
    ]
  }
  connection {
    host = var.ipv4
    type = "ssh"
    user = "root"
    agent = false
  }
}
