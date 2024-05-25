terraform {
  required_providers {
    grafana = {
      source  = "grafana/grafana"
      version = "~> 3"
    }
  }
}

data "grafana_cloud_stack" "gpt" {
  slug = var.grafana_cloud_stack_name
}

resource "grafana_cloud_stack_service_account_token" "prometheus" {
  service_account_id = data.grafana_cloud_stack.gpt.prometheus_user_id
  name               = "prometheus_token"
  stack_slug         = data.grafana_cloud_stack.gpt.slug
}

resource "grafana_cloud_stack_service_account_token" "loki" {
  service_account_id = data.grafana_cloud_stack.gpt.logs_user_id
  name               = "loki_token"
  stack_slug         = data.grafana_cloud_stack.gpt.slug
}

resource "grafana_cloud_stack_service_account" "grafana_user" {
  stack_slug = data.grafana_cloud_stack.gpt.slug
  name       = "Grafana Dashboards User"
  role       = "Editor"
}

resource "grafana_cloud_stack_service_account_token" "grafana_user" {
  service_account_id = grafana_cloud_stack_service_account.grafana_user.id
  name               = "grafana_token"
  stack_slug         = data.grafana_cloud_stack.gpt.slug
}
