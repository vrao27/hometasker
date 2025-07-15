variable "region" {
  description = "AWS region for Lightsail resources"
  type        = string
  default     = "eu-central-1"
}

variable "availability_zone" {
  default = "eu-central-1a"
}

variable "domain_name" {
  description = "hometasker.org"
  type        = string
}

variable "instance_name" {
  default = "hometasker-app"
}

variable "key_pair_name" {
  description = "Hometasker-key.pem"
}

