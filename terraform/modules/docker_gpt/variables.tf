variable "domain" {
  type    = string
  default = "localhost.brikfoot.xyz"
}

variable "traefik_username" {
  type    = string
  default = "amani"
}

variable "traefik_password" {
  type      = string
  default   = "amani"
  sensitive = true
}

variable "traefik_email" {
  type    = string
  default = "amani@example.com"
}

variable "traefik_ca_resolver" {
  type    = string
  default = "staging"
}

variable "do_dns_token" {
  type      = string
  sensitive = true
}

variable "docker_network" {
  type    = string
  default = "gpt"
}

variable "docker_volumes" {
  type    = string
  default = "/mnt/staging"
}
