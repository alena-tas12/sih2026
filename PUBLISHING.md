# Publishing Guide

## Overview

This monorepo uses GitHub Packages to publish scoped npm packages for the Genesis Compliance system.

## Packages

- `@genesis-compliance/rule-engine` - Rule evaluation engine
- `@genesis-compliance/database` - Database schema and migrations

## Publishing Process

### 1. Update Version Numbers

Update the version in each package's `package.json`:

```bash
cd packages/rule-engine
npm version minor  # or patch, major
```

### 2. Create a Release on GitHub

Create a new release on GitHub with a version tag (e.g., `v1.1.0`):

1. Go to the repository's releases page
2. Click "Draft a new release"
3. Create a tag (e.g., `v1.1.0`)
4. Add release notes
5. Publish the release

### 3. Automatic Publishing

The GitHub Actions workflow (`.github/workflows/publish.yml`) will automatically:

1. Build the packages
2. Publish to GitHub Packages
3. Create release assets (tar.gz and zip files)

## Manual Publishing

To manually publish packages:

```bash
# Set up credentials
export NPM_TOKEN=<your_github_token>

# Login to GitHub Packages
npm login --registry https://npm.pkg.github.com

# Build packages
npm run build:packages

# Publish a specific package
cd packages/rule-engine
npm publish
```

## Authentication

### For Users

To install packages from GitHub Packages:

```bash
npm login --registry https://npm.pkg.github.com
# Enter your GitHub username and personal access token (with read:packages scope)
```

Add to `.npmrc`:

```
@genesis-compliance:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_TOKEN
```

### For CI/CD

Use the `GITHUB_TOKEN` which is automatically available in GitHub Actions:

```yaml
NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Installation

Users can install packages with:

```bash
npm install @genesis-compliance/rule-engine
npm install @genesis-compliance/database
```

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- MAJOR version for incompatible API changes
- MINOR version for new functionality (backward compatible)
- PATCH version for bug fixes (backward compatible)

## Package Registry

Packages are published to: https://github.com/alena-tas12/sih2026/packages

## Support

For issues or questions, open an issue on the GitHub repository.
