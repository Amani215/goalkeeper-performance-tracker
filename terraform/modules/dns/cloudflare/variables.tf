variable "subdomain" {
  type    = string
  default = "gpt"
}

variable "ipv4" {
  type = string
}

variable "ipv6" {
  type = string
}

variable "zone_id" {
  type = string
  sensitive = true
}
