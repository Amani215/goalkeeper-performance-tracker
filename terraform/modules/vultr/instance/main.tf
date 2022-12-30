terraform {
  required_providers {
    vultr = {
      source  = "vultr/vultr"
      version = "2.12.0"
    }
  }
}

resource "vultr_instance" "gpt_instance" {
  plan             = "vc2-2c-4gb"
  region           = "Frankfurt"
  app_id           = "37"
  ssh_key_ids      = ["4494b9bc-993d-48f5-8205-e598be4a21ce", "706dbac8-0735-435f-8e99-8a74b2ff9711"]
  enable_ipv6      = true
  activation_email = true
  backups          = "disabled"
  label            = "gpt_instance"
  tags             = ["gpt_instance"]
  ddos_protection  = false
  hostname         = var.hostname
}