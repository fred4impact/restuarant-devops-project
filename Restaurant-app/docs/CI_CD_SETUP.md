# CI/CD Setup Guide

This guide shows you how to automate Docker builds using CI/CD tools (GitHub Actions, GitLab CI, etc.) so you don't have to manually pass build arguments.

## Overview

Instead of manually running:
```bash
docker build --build-arg VITE_API_URL=... -t restaurant-app .
```

CI/CD will automatically:
- ✅ Build when you push to Git
- ✅ Use secrets/environment variables for API URLs
- ✅ Build and optionally push Docker images
- ✅ No manual intervention needed

## GitHub Actions Setup

### Step 1: Create GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add your secrets:

   **Secret Name:** `VITE_API_URL`
   **Value:** `https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1`

   (Or your custom MockAPI.io URL)

### Step 2: Use the Workflow

The workflow file is already created at `.github/workflows/docker-build.yml`

**Simple version (just builds):**
- Uses: `.github/workflows/docker-build-simple.yml`
- Builds on push to main/master
- Doesn't push to registry (just builds)

**Full version (builds and pushes):**
- Uses: `.github/workflows/docker-build.yml`
- Builds on push to main/master
- Pushes to GitHub Container Registry

### Step 3: How It Works

The workflow automatically:
1. Checks out your code
2. Sets up Docker Buildx
3. Reads `VITE_API_URL` from GitHub Secrets
4. Builds the Docker image with the API URL
5. (Optional) Pushes to registry

### Step 4: View Builds

1. Go to your GitHub repository
2. Click **Actions** tab
3. See your builds running automatically

## GitLab CI Setup

### Step 1: Create GitLab CI/CD Variables

1. Go to your GitLab project
2. Click **Settings** → **CI/CD** → **Variables**
3. Click **Add variable**
4. Add your variable:

   **Key:** `VITE_API_URL`
   **Value:** `https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1`
   **Type:** Variable
   **Protected:** (optional)
   **Masked:** (optional)

### Step 2: Use the GitLab CI Config

The config file is already created at `.gitlab-ci.yml`

It automatically:
- Builds on push to main/master/develop
- Uses `VITE_API_URL` from GitLab CI/CD variables
- Pushes to GitLab Container Registry

## Other CI/CD Platforms

### CircleCI

Create `.circleci/config.yml`:

```yaml
version: 2.1
jobs:
  build:
    docker:
      - image: docker:24
    steps:
      - checkout
      - setup_remote_docker
      - run:
          name: Build Docker image
          command: |
            docker build \
              --build-arg VITE_API_URL="${VITE_API_URL:-https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1}" \
              -t restaurant-app:latest .
```

Add `VITE_API_URL` in CircleCI project settings → Environment Variables.

### Jenkins

Create `Jenkinsfile`:

```groovy
pipeline {
    agent any
    environment {
        VITE_API_URL = "${env.VITE_API_URL ?: 'https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1'}"
    }
    stages {
        stage('Build') {
            steps {
                sh '''
                    docker build \
                      --build-arg VITE_API_URL="${VITE_API_URL}" \
                      -t restaurant-app:latest .
                '''
            }
        }
    }
}
```

### Azure DevOps

Create `azure-pipelines.yml`:

```yaml
trigger:
  - main
  - master

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: Docker@2
    inputs:
      containerRegistry: 'YourRegistry'
      repository: 'restaurant-app'
      command: 'build'
      Dockerfile: '**/Dockerfile'
      buildContext: '.'
      arguments: '--build-arg VITE_API_URL=$(VITE_API_URL)'
```

Add `VITE_API_URL` in Azure DevOps → Pipelines → Library → Variable groups.

## How It Works

### The Flow

```
1. You push code to Git
   ↓
2. CI/CD detects the push
   ↓
3. CI/CD reads VITE_API_URL from secrets/variables
   ↓
4. CI/CD runs: docker build --build-arg VITE_API_URL=$VITE_API_URL
   ↓
5. Docker image is built automatically
   ↓
6. (Optional) Image is pushed to registry
```

### Environment Variables vs Build Args

**In CI/CD:**
- `VITE_API_URL` is stored as a **secret/variable** in your CI/CD platform
- CI/CD passes it as `--build-arg` to Docker
- Docker embeds it into the JavaScript bundle at build time

**Why this works:**
- ✅ No manual `--build-arg` needed
- ✅ Secrets are secure (not in code)
- ✅ Different values for different environments
- ✅ Automatic builds on every push

## Setting Up Secrets

### GitHub Actions

1. Repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `VITE_API_URL`
4. Value: Your MockAPI.io URL
5. Click **Add secret**

### GitLab CI

1. Project → **Settings** → **CI/CD** → **Variables**
2. Click **Add variable**
3. Key: `VITE_API_URL`
4. Value: Your MockAPI.io URL
5. Click **Add variable**

### Using Different URLs for Different Branches

**GitHub Actions:**
```yaml
build-args: |
  VITE_API_URL=${{ 
    github.ref == 'refs/heads/main' && secrets.VITE_API_URL_PROD ||
    github.ref == 'refs/heads/develop' && secrets.VITE_API_URL_DEV ||
    'https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1'
  }}
```

**GitLab CI:**
```yaml
variables:
  VITE_API_URL: "${CI_COMMIT_BRANCH == 'main' ? $VITE_API_URL_PROD : $VITE_API_URL_DEV}"
```

## Testing Locally

You can test the CI/CD workflow locally using `act` (for GitHub Actions):

```bash
# Install act
brew install act  # macOS
# or download from https://github.com/nektos/act

# Run GitHub Actions locally
act -s VITE_API_URL=https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1
```

## Troubleshooting

### Build Fails: "VITE_API_URL not found"

**Solution:** Make sure you've added the secret/variable in your CI/CD platform.

### Build Uses Wrong URL

**Solution:** Check that your secret/variable name matches exactly (case-sensitive).

### Want to Use Default URL

**Solution:** The workflows have a fallback default URL, so it will work even without secrets.

## Best Practices

1. ✅ **Use secrets for sensitive data** (API URLs, keys)
2. ✅ **Use different URLs for different environments** (dev, staging, prod)
3. ✅ **Don't commit secrets** to Git
4. ✅ **Use CI/CD variables** instead of hardcoding
5. ✅ **Test locally** before pushing

## Quick Start

1. **Add secret in your CI/CD platform:**
   - GitHub: Settings → Secrets → Add `VITE_API_URL`
   - GitLab: Settings → CI/CD → Variables → Add `VITE_API_URL`

2. **Push your code:**
   ```bash
   git add .
   git commit -m "Add CI/CD"
   git push
   ```

3. **Watch it build automatically!**
   - GitHub: Go to Actions tab
   - GitLab: Go to CI/CD → Pipelines

That's it! No more manual `--build-arg` needed! 🚀

