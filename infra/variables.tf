variable "aws_region" {
  description = "AWS region for Lightsail"
  default     = "eu-central-1"
}

variable "instance_name" {
  description = "Name for the Lightsail instance"
  default     = "hometasker-app"
}

variable "availability_zone" {
  description = "Availability Zone for Lightsail instance"
  default     = "eu-central-1a"
}

variable "blueprint_id" {
  description = "Lightsail blueprint ID (Ubuntu, etc)"
  default     = "ubuntu_22_04"
}

variable "bundle_id" {
  description = "Lightsail plan (nano_2_0, small_2_0, etc)"
  default     = "small_2_0"
}

variable "key_pair_name" {
  description = "hometasker-key"
  default     = "LightsailDefaultKey-eu-central-1"
}
