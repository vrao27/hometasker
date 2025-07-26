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
  tags = {
    Name = var.instance_name
  }
  provisioner "file" {
    source      = "${path.module}/docker-setup.sh"
    destination = "/home/ubuntu/docker-setup.sh"
    connection {
      type  = "ssh"
      user  = "ubuntu"
      host  = self.public_ip_address
      agent = true
    }
  }
  provisioner "remote-exec" {
    connection {
      type  = "ssh"
      user  = "ubuntu"
      host  = self.public_ip_address
      agent = true
    }
    inline = [
      "chmod +x /home/ubuntu/docker-setup.sh",
      "sudo /home/ubuntu/docker-setup.sh",
    ]
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
  port_info {
    protocol  = "tcp"
    from_port = 5000
    to_port   = 5000
  }
}