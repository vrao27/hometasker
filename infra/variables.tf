variable "region" {
  description = "AWS region for Lightsail resources"
  type        = string
  default     = "eu-central-1"
}

variable "domain_name" {
  description = "The domain to manage in Lightsail DNS (e.g. hometasker.org)"
  type        = string
}