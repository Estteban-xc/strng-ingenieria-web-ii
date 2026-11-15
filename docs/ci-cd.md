# Continuous Integration and Delivery

The workflow `.github/workflows/ci.yml` validates every push to `main` or `develop` and every Pull Request. It starts an ephemeral MongoDB service, installs the client and server dependencies, builds the React client, starts the API, waits for `/api/health`, executes the API smoke tests and validates the Terraform configuration.

The workflow `.github/workflows/deploy-pages.yml` publishes the compiled frontend to GitHub Pages when changes reach `main`. This is a frontend delivery process; the Express API remains an independent deployment unit and must be hosted in a backend-compatible environment.

The pipeline uses no private values in the repository. If a future production deployment requires database access or external credentials, those values belong in GitHub Actions Secrets and must be injected as environment variables at runtime.
