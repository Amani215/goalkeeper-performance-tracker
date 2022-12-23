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
