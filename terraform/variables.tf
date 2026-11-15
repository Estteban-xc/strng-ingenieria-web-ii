variable "aws_region" {
  description = "AWS region used for the optional STRNG infrastructure plan."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Logical project name used in resource tags."
  type        = string
  default     = "strng"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "staging"
}

variable "instance_type" {
  description = "EC2 instance type for an optional IaaS deployment."
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "AMI ID supplied for the selected AWS region; no default is provided."
  type        = string
  default     = ""
}
