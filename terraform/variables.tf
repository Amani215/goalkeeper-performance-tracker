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

variable "api_secret_key" {
  type      = string
  sensitive = true
}

variable "wtf_csrf_secret_key" {
  type      = string
  sensitive = true
}

variable "GH_USER" {
  type      = string
  sensitive = true
}

variable "GH_PAT" {
  type      = string
  sensitive = true
}

variable "admin_user" {
  type      = string
  sensitive = true
}

variable "admin_password" {
  type      = string
  sensitive = true
}

variable "public_s3" {
  type = string
}

variable "MINIO_ROOT_USER" {
  type      = string
  sensitive = true
}

variable "MINIO_ROOT_PASSWORD" {
  type      = string
  sensitive = true
}
