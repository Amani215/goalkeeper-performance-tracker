variable "nginx_tag" {
  type    = string
  default = "stable-alpine"
}

variable "nginx_network" {
  type    = string
  default = "goalkeeper_tracker_platform"
}

variable "nginx_config_path" {
  type    = string
  default = "/home/vagrant/goalkeeper-performance-tracker/nginx/stage"
}
