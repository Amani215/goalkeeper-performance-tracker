variable "do_domain" {
  type    = string
  default = "brikfoot.xyz"
}

variable "do_droplet" {
  type    = string
  default = "staging"
}

variable "do_size" {
  type    = string
  default = "s-2vcpu-2gb"
}

variable "do_region" {
  type    = string
  default = "fra1"
}

variable "do_image" {
  type    = string
  default = "docker-20-04"
}

variable "do_vpc" {
  type    = string
  default = "staging"
}

variable "docker_network" {
  type    = string
  default = "gpt"
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
  default = "prod"
}

variable "do_dns_token" {
  type      = string
  sensitive = true
}
