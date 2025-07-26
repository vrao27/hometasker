output "instance_ip" {
  value       = aws_lightsail_instance.app_server.public_ip_address
  description = "Public IP address of the Lightsail instance"
  depends_on  = [null_resource.docker_provisioner]
}

output "instance_status" {
  value       = aws_lightsail_instance.app_server.state
  description = "Current state of the instance"
}