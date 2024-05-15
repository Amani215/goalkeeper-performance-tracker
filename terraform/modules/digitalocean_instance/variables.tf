variable "domain" {
    type = string
    default = "brikfoot.xyz"  
}

variable "droplet" {
    type = string
    default = "staging"  
}

variable "size" {
    type = string
    default = "s-1vcpu-1gb"  
}

variable "region" {
  type = string
  default = "fra1"
}

variable "image" {
  type = string
  default = "docker-22-04"
}

variable "vpc" {
  type = string
  default = "staging"
}
