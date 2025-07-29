output "instance_ip" {
  description = "Public IP (static) of the Lightsail instance"
  value       = "3.120.124.199"
}
output "instance_name" {
  description = "Name of the Lightsail instance"
  value       = aws_lightsail_instance.app_server.name
}
