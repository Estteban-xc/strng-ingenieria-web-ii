locals {
  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# This resource is intentionally guarded by ami_id. The academic repository
# validates the IaC structure without creating billable infrastructure.
resource "aws_instance" "strng_backend" {
  count                      = var.ami_id == "" ? 0 : 1
  ami                        = var.ami_id
  instance_type              = var.instance_type
  associate_public_ip_address = false
  tags                       = local.tags
}
