variable "pg_tag" {
  type    = string
  default = "14-alpine3.16"
}

variable "db_sever_name" {
  type    = string
  default = "db"
}

variable "db_username" {
  type      = string
  sensitive = true
}

variable "db_password" {
  type      = string
  sensitive = true
}


variable "pg_network" {
  type    = string
  default = "goalkeeper_tracker_platform"
}

