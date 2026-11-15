# STRNG Infrastructure as Code

This directory contains a safe Terraform template for the optional IaaS representation of the STRNG backend. It is designed for academic validation and documentation. The default configuration creates zero resources because `ami_id` is empty; therefore, `terraform plan` does not provision billable infrastructure.

The configuration uses variables and tags to make the environment reproducible. Cloud credentials must be supplied through the local AWS credential chain or a protected CI secret. They must never be written in `.tf` files or committed to the repository.

Typical validation commands are:

```bash
terraform fmt -check -recursive
terraform init -backend=false
terraform validate
terraform plan -var-file=terraform.tfvars
```

`terraform apply` is intentionally not part of the normal academic workflow. It should only be used by an authorized account after reviewing the plan and confirming the provider costs.
