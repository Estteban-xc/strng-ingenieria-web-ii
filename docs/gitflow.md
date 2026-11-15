# GitFlow and Collaborative Version Control

The team uses `main` as the stable delivery branch and `develop` as the integration branch. New work is isolated in feature branches and integrated through Pull Requests.

```text
main
└── develop
    ├── feature/cloud-documentation
    ├── feature/ci-cd
    ├── feature/terraform
    └── feature/observability
```

## Branch responsibilities

- `main`: stable version prepared for delivery.
- `develop`: integration point for approved features.
- `feature/<name>`: isolated implementation of one requirement.
- `release/<version>`: optional stabilization branch before a delivery.
- `hotfix/<name>`: urgent correction derived from `main` and merged back into `main` and `develop`.

Changes are reviewed through Pull Requests. Commits should describe one coherent change, for example `feat: expose Prometheus metrics` or `ci: validate API and frontend build`. The `.gitignore` excludes `.env`, dependency folders, build output and logs. The public repository therefore receives the configuration template rather than private credentials.
