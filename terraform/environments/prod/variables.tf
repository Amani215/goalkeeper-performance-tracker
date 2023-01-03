variable "db_username" {
  type      = string
  sensitive = true
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "gpt_network" {
  type    = string
  default = "goalkeeper_tracker_platform"
}

variable "backend_secret_key" {
  type      = string
  sensitive = true
}

variable "wtf_csrf_secret_key" {
  type      = string
  sensitive = true
}

variable "GH_USER" {
  type      = string
  sensitive = true
}

variable "GH_PAT" {
  type      = string
  sensitive = true
}

variable "admin_user" {
  type      = string
  sensitive = true
}

variable "admin_password" {
  type      = string
  sensitive = true
}

variable "public_s3" {
  type = string
}

variable "AWS_DOMAIN" {
  type = string
}

variable "AWS_DEFAULT_REGION" {
  type      = string
  sensitive = true
}

variable "AWS_ACCESS_KEY_ID" {
  type      = string
  sensitive = true
}

variable "AWS_SECRET_ACCESS_KEY" {
  type      = string
  sensitive = true
}

variable "vultr_api_key" {
  type      = string
  sensitive = true
}

variable "cloudflare_zone_id" {
  type      = string
  sensitive = true
}

variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}

variable "cloudflare_api_hostname" {
  type      = string
  sensitive = true
}

variable "host_key_checking" {
  type    = string
  default = <<EOF
Host gpt.amanibrik.tk
  StrictHostKeyChecking no
EOF
}

variable "id_rsa_vultr" {
  type      = string
  sensitive = true
}