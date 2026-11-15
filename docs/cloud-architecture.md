# STRNG Cloud Architecture

## Current service classification

| Model | STRNG service | Application in the project |
|---|---|---|
| IaaS | Optional AWS EC2 plan in `terraform/` | Represents a virtual machine where the Express API could run. |
| PaaS | GitHub Pages for the static frontend deployment | Publishes the compiled frontend without managing a server operating system. |
| SaaS | MongoDB Atlas, GitHub, Formspree and GitHub Actions | Provides managed database, source collaboration, contact processing and automation services. |

The practical architecture separates the React/Vite client, the Express API and the MongoDB Atlas database. The frontend sends HTTP requests to the API, while the API validates authentication, executes business rules and persists data through Mongoose. MongoDB Atlas remains an external managed service; it is not embedded in the application repository.

## Deployment boundary

GitHub Pages can publish the static client bundle, but it does not execute the private Express server. The API therefore requires a compatible backend host, such as a PaaS service or the optional IaaS representation declared with Terraform. The production frontend URL must be added to `CORS_ORIGINS` in the backend environment.

## Cloud decisions

The project uses managed services where they reduce operational work: MongoDB Atlas for database availability, GitHub for collaboration and Actions for automation. Terraform documents the IaaS alternative without provisioning infrastructure automatically. This separation makes the architecture explicit and avoids placing credentials or provider-specific state in the source repository.
