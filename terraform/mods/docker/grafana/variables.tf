variable "grafana_tag" {
  type    = string
  default = "9.2.5-ubuntu"
}

variable "grafana_network" {
  type    = string
  default = "goalkeeper_tracker_platform"
}

variable "hostname" {
  type    = string
  default = "localhost"
}

variable "grafana_config_path" {
  type    = string
  default = "/home/vagrant/goalkeeper-performance-tracker/grafana"
}
