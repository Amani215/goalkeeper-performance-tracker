output "ipv4" {
  value = vultr_instance.gpt_instance.main_ip
}

output "ipv6" {
  value = vultr_instance.gpt_instance.v6_main_ip 
}