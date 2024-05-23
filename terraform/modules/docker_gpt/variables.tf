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

variable "docker_network" {
  type    = string
  default = "gpt"
}
