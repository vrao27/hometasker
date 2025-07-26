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

resource "time_sleep" "wait_for_network" {
  depends_on = [aws_lightsail_instance_public_ports.web]
  
  create_duration = "2m" # Wait 2 minutes for network stabilization
}

resource "null_resource" "docker_provisioner" {
  depends_on = [time_sleep.wait_for_network]

  triggers = {
    instance_ip = aws_lightsail_instance.app_server.public_ip_address
  }

  connection {
    type        = "ssh"
    user        = "ubuntu"
    host        = aws_lightsail_instance.app_server.public_ip_address
    private_key = file(var.ssh_private_key_path)
    timeout     = "10m"
  }

  provisioner "file" {
    source      = "${path.module}/docker-setup.sh"
    destination = "/home/ubuntu/docker-setup.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /home/ubuntu/docker-setup.sh",
      "sudo /home/ubuntu/docker-setup.sh",
    ]
  }
}