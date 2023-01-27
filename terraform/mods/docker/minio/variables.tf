variable "minio_tag" {
  type    = string
  default = "RELEASE.2022-09-25T15-44-53Z.fips"
}

variable "MINIO_ROOT_USER" {
  type      = string
  sensitive = true
}

variable "MINIO_ROOT_PASSWORD" {
  type      = string
  sensitive = true
}

variable "minio_network" {
  type    = string
  default = "goalkeeper_tracker_platform"
}
