output "instance_ip" {
  value = aws_lightsail_instance.app_server.public_ip_address
}