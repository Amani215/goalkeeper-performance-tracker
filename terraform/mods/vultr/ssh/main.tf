terraform {
  required_providers {
    null = {
      source  = "hashicorp/null"
      version = "3.2.1"
    }
  }
}

resource "null_resource" "known_host" {
  triggers = {
    ipv4 = var.ipv4
  }

  provisioner "local-exec" {
    command = "ssh-keyscan -H ${var.ipv4} >> ~/.ssh/known_hosts"
  }
}

resource "null_resource" "gh_keys" {
  triggers = {
    ipv4 = var.ipv4
  }

  provisioner "remote-exec" {
    # Bootstrap script called with private_ip of each node in the cluster
    inline = [
      "echo \"github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl\"  >> ~/.ssh/known_hosts",
      "echo \"github.com ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBEmKSENjQEezOmxkZMy7opKgwFB9nkt5YRrYMjNuG5N87uRgg6CLrbo5wAdT/y6v0mKV0U2w0WZ2YB/++Tpockg=\" >> ~/.ssh/known_hosts",
      "echo \"github.com ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAq2A7hRGmdnm9tUDbO9IDSwBK6TbQa+PXYPCPy6rbTrTtw7PHkccKrpp0yVhp5HdEIcKr6pLlVDBfOLX9QUsyCOV0wzfjIJNlGEYsdlLJizHhbn2mUjvSAHQqZETYP81eFzLQNnPHt4EVVUh7VfDESU84KezmD5QlWpXLmvU31/yMf+Se8xhHTvKSCZIFImWwoG6mbUoWf9nzpIoaSjB+weqqUUmpaaasXVal72J+UX2B+2RPW3RcT0eOzQgqlJL3RKrTJvdsjE3JEAvGq3lGHSZXy28G3skua2SmVi/w4yCE6gbODqnTWlg7+wC604ydGXA8VJiS5ap43JXiUFFAaQ==\" >> ~/.ssh/known_hosts",
    ]
  }
  connection {
    host  = var.ipv4
    type  = "ssh"
    user  = "root"
    agent = true
  }
  depends_on = [
    null_resource.known_host
  ]
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
    host  = var.ipv4
    type  = "ssh"
    user  = "root"
    agent = true
  }
  depends_on = [
    null_resource.gh_keys
  ]
}
