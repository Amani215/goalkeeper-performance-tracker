variable "web_network" {
  type    = string
  default = "goalkeeper_tracker_platform"
}

variable "api_image" {
  type    = string
  default = "ghcr.io/amani215/goalkeeper-performance-tracker-api:master-alpine3.15"
}

variable "web_ui_image" {
  type    = string
  default = "ghcr.io/amani215/goalkeeper-performance-tracker-web-ui:master-alpine"
}

### FLASK ###
variable "api_secret_key" {
  type      = string
  sensitive = true
}

variable "wtf_csrf_secret_key" {
  type      = string
  sensitive = true
}

# POSTGRES
variable "pg_user" {
  type      = string
  sensitive = true
}

variable "pg_password" {
  type      = string
  sensitive = true
}

variable "pg_host" {
  type      = string
  sensitive = true
}

variable "pg_port" {
  type    = string
  default = "5432"
}

variable "pg_db" {
  type      = string
  sensitive = true
}

### MINIO ###
variable "public_s3" {
  type = string
}

variable "AWS_DOMAIN" {
  type = string
}

variable "MINIO_ROOT_PASSWORD" {
  type      = string
  sensitive = true
}

variable "MINIO_ROOT_USER" {
  type      = string
  sensitive = true
}

variable "AWS_DEFAULT_REGION" {
  type      = string
  sensitive = true
}

variable "AWS_ACCESS_KEY_ID" {
  type      = string
  sensitive = true
}

variable "AWS_SECRET_ACCESS_KEY" {
  type      = string
  sensitive = true
}

variable "profile_pics_bucket" {
  type    = string
  default = "profile-pics"
}

variable "goalkeeper_pics_bucket" {
  type    = string
  default = "goalkeeper-pics"
}

variable "training_forms_bucket" {
  type    = string
  default = "training-forms"
}

### REDIS ###
variable "redis_host" {
  type    = string
  default = "redis"
}

variable "redis_port" {
  type    = string
  default = "6379"
}

### DEFAULT USER ###
variable "admin_user" {
  type      = string
  sensitive = true
}

variable "admin_password" {
  type      = string
  sensitive = true
}
