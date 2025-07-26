output "instance_ip" {
  description = "Public IP (static) of the Lightsail instance"
  value       = aws_lightsail_instance.app_server.public_ip_address
}
