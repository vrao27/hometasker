provider "aws" {
  region = var.aws_region
}

resource "aws_lightsail_static_ip" "ip" {
  name = "hometasker-static-ip"
}

resource "aws_lightsail_instance" "app_server" {
  name              = var.instance_name
  availability_zone = var.availability_zone
  blueprint_id      = var.blueprint_id
  bundle_id         = var.bundle_id
  key_pair_name     = var.key_pair_name

  user_data = file("${path.module}/cloud-init.sh")

  tags = {
    Name = var.instance_name
  }
}

resource "aws_lightsail_static_ip_attachment" "attach" {
  instance_name  = aws_lightsail_instance.app_server.name
  static_ip_name = aws_lightsail_static_ip.ip.name
}

resource "aws_lightsail_instance_public_ports" "open" {
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
  port_info {
    protocol  = "tcp"
    from_port = 3000
    to_port   = 3000
  }
}


