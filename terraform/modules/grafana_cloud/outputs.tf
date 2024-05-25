output "prometheus_write_url" {
  sensitive = true
  value     = data.grafana_cloud_stack.gpt.prometheus_remote_write_endpoint
}

output "prometheus_user_token" {
  sensitive = true
  value     = grafana_cloud_stack_service_account_token.prometheus.key
}

output "prometheus_user_id" {
  sensitive = true
  value     = data.grafana_cloud_stack.gpt.prometheus_user_id
}

output "loki_url" {
  value = data.grafana_cloud_stack.gpt.logs_url
}

output "loki_user_token" {
  sensitive = true
  value     = grafana_cloud_stack_service_account_token.loki.key
}

output "loki_user_id" {
  sensitive = true
  value     = data.grafana_cloud_stack.gpt.logs_user_id
}

output "grafana_url" {
  value = data.grafana_cloud_stack.gpt.url
}

output "grarfana_user_id" {
  value = grafana_cloud_stack_service_account.grafana_user.id
}

output "grafana_user_token" {
  sensitive = true
  value     = grafana_cloud_stack_service_account_token.grafana_user.key
}
