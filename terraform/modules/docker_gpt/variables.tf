variable "domain" {
    type = string
    default = "brikfoot.xyz"  
}

variable "droplet" {
    type = string
    default = "staging"  
}

variable "username" {
  type = string
  default = "amani"
}

variable "password" {
  type = string
  default = "amani"
  sensitive = true
}
