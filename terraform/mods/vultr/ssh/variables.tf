variable "ipv4" {
  type      = string
}

variable "gh_repo" {
  type      = string
  default = "git@github.com:Amani215/goalkeeper-performance-tracker.git"
}

variable "gh_repo_dir"{
  type      = string
  default ="/goalkeeper-performance-tracker"
}