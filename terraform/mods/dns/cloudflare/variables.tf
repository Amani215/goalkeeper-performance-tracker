variable "subdomain" {
  type    = string
  default = "gpt.amanibrik.tk"
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
