output "backend_instance_id" {
  description = "ID of the optional backend instance."
  value       = try(aws_instance.strng_backend[0].id, null)
}

output "environment" {
  description = "Environment represented by this configuration."
  value       = var.environment
}
