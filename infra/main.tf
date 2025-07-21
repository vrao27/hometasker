terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
provider "aws" {
  region = var.region
}
resource "aws_lightsail_instance" "app_server" {
  name              = var.instance_name
  availability_zone = var.availability_zone
  blueprint_id      = "ubuntu_22_04"
  bundle_id         = "small_2_0"
  key_pair_name     = var.key_pair_name
  user_data         = fileexists("${path.module}/docker-setup.sh") ? file("${path.module}/docker-setup.sh") : ""

  tags = {
    Name = var.instance_name
  }
}
resource "aws_lightsail_instance_public_ports" "web" {
  instance_name = aws_lightsail_instance.app_server.name
  port_info {
    protocol  = "tcp"
    from_port = 22
    to_port   = 22
  }
  port_info {
    protocol  = "tcp"
    from_port = 80
    to_port   = 80
  }
  port_info {
    protocol  = "tcp"
    from_port = 443
    to_port   = 443
  }
}
output "debug_keypair" {
  value = var.key_pair_name
}
