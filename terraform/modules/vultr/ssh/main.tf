terraform {
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "2.2.3"
    }
  }
}

resource "local_sensitive_file" "ssh_key" {
  content         = var.id_rsa_vultr
  filename        = "/id_rsa_vultr"
  file_permission = "0400"
}