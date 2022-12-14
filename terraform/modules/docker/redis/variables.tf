variable "redis_tag" {
  type    = string
  default = "7-alpine3.16"
}

variable "redis_commander_tag" {
  type    = string
  default = "latest"
}

variable "redis_network" {
  type    = string
  default = "goalkeeper_tracker_platform"
}
