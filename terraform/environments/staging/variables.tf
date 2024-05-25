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

variable "gh_repository" {
  type    = string
  default = "goalkeeper-performance-tracker"
}
