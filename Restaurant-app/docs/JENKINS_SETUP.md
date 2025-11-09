# Jenkins CI/CD Setup Guide

This guide shows you how to set up Jenkins to automatically build your Docker image using environment variables/secrets instead of manually passing build arguments.

## Overview

Instead of manually running:
```bash
docker build --build-arg VITE_API_URL=... -t restaurant-app .
```

Jenkins will automatically:
- ✅ Build when you push to Git
- ✅ Use environment variables/secrets for API URLs
- ✅ No manual `--build-arg` needed
- ✅ Secure secret management

## Quick Setup

### Step 1: Install Jenkins

If you don't have Jenkins installed:

**macOS:**
```bash
brew install jenkins-lts
brew services start jenkins-lts
```

**Linux:**
```bash
# Download and install from https://www.jenkins.io/download/
```

**Docker:**
```bash
docker run -d -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts
```

### Step 2: Configure Jenkins Environment Variable

You have **3 options** to set `VITE_API_URL` in Jenkins:

#### Option 1: Global Environment Variable (Recommended)

1. Go to **Jenkins Dashboard**
2. Click **Manage Jenkins** → **Configure System**
3. Scroll to **Global properties**
4. Check **Environment variables**
5. Click **Add**
6. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1`
7. Click **Save**

**This applies to ALL jobs** - no need to configure per job.

#### Option 2: Job-Level Environment Variable

1. Go to your Jenkins job
2. Click **Configure**
3. Scroll to **Build Environment**
4. Check **Inject environment variables to the build process**
5. In **Properties Content**, add:
   ```
   VITE_API_URL=https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1
   ```
6. Click **Save**

**This applies only to this specific job.**

#### Option 3: Using Jenkins Credentials (Most Secure)

1. Go to **Jenkins Dashboard**
2. Click **Manage Jenkins** → **Manage Credentials**
3. Click **Add Credentials**
4. Select **Secret text**
5. Add:
   - **Secret:** `https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1`
   - **ID:** `vite-api-url`
   - **Description:** `MockAPI.io API URL`
6. Click **OK**

Then update your Jenkinsfile to use credentials:
```groovy
environment {
    VITE_API_URL = credentials('vite-api-url')
}
```

### Step 3: Create Jenkins Job

#### Option A: Using Jenkinsfile (Recommended)

1. Go to **Jenkins Dashboard**
2. Click **New Item**
3. Enter job name: `restaurant-app`
4. Select **Pipeline**
5. Click **OK**
6. In **Pipeline** section:
   - **Definition:** Pipeline script from SCM
   - **SCM:** Git
   - **Repository URL:** Your Git repository URL
   - **Branch Specifier:** `*/main` or `*/master`
   - **Script Path:** `Jenkinsfile` (or `Jenkinsfile.simple`)
7. Click **Save**

#### Option B: Freestyle Project

1. Go to **Jenkins Dashboard**
2. Click **New Item**
3. Enter job name: `restaurant-app`
4. Select **Freestyle project**
5. Click **OK**
6. Configure:
   - **Source Code Management:** Git
   - **Repository URL:** Your Git repository URL
   - **Branch:** `*/main` or `*/master`
   - **Build:** Add build step → **Execute shell**
   - **Command:**
     ```bash
     docker build \
       --build-arg VITE_API_URL="${VITE_API_URL:-https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1}" \
       -t restaurant-app:${BUILD_NUMBER} \
       -t restaurant-app:latest \
       .
     ```
7. Click **Save**

### Step 4: Run the Job

1. Go to your Jenkins job
2. Click **Build Now**
3. Watch the build run automatically!

## Jenkinsfile Explained

### Simple Version (`Jenkinsfile.simple`)

```groovy
pipeline {
    agent any
    
    environment {
        // Gets VITE_API_URL from Jenkins environment variables
        // Falls back to default MockAPI.io URL if not set
        VITE_API_URL = "${env.VITE_API_URL ?: 'https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1'}"
    }
    
    stages {
        stage('Build') {
            steps {
                sh """
                    docker build \
                      --build-arg VITE_API_URL="${VITE_API_URL}" \
                      -t restaurant-app:latest \
                      .
                """
            }
        }
    }
}
```

### Full Version (`Jenkinsfile`)

Includes:
- Checkout code
- Build Docker image
- Test container
- Push to registry (optional)
- Cleanup

## Using Different URLs for Different Environments

### Option 1: Different Jobs

Create separate jobs:
- `restaurant-app-dev` → Uses `VITE_API_URL_DEV`
- `restaurant-app-prod` → Uses `VITE_API_URL_PROD`

### Option 2: Parameterized Build

Update Jenkinsfile:

```groovy
pipeline {
    agent any
    
    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'staging', 'prod'],
            description: 'Select environment'
        )
    }
    
    environment {
        VITE_API_URL = "${params.ENVIRONMENT == 'prod' ? env.VITE_API_URL_PROD : env.VITE_API_URL_DEV}"
    }
    
    // ... rest of pipeline
}
```

### Option 3: Branch-Based

Update Jenkinsfile:

```groovy
pipeline {
    agent any
    
    environment {
        VITE_API_URL = "${env.BRANCH_NAME == 'main' ? env.VITE_API_URL_PROD : env.VITE_API_URL_DEV}"
    }
    
    // ... rest of pipeline
}
```

## Using Jenkins Credentials (Most Secure)

### Step 1: Create Credential

1. **Manage Jenkins** → **Manage Credentials**
2. Click **Add Credentials**
3. Select **Secret text**
4. **Secret:** Your MockAPI.io URL
5. **ID:** `vite-api-url`
6. Click **OK**

### Step 2: Update Jenkinsfile

```groovy
pipeline {
    agent any
    
    environment {
        // Get from Jenkins credentials
        VITE_API_URL = credentials('vite-api-url')
    }
    
    stages {
        stage('Build') {
            steps {
                sh """
                    docker build \
                      --build-arg VITE_API_URL="${VITE_API_URL}" \
                      -t restaurant-app:latest \
                      .
                """
            }
        }
    }
}
```

## Webhook Setup (Automatic Builds on Git Push)

### GitHub Webhook

1. Go to your GitHub repository
2. **Settings** → **Webhooks** → **Add webhook**
3. **Payload URL:** `http://your-jenkins-url/github-webhook/`
4. **Content type:** `application/json`
5. **Events:** Select **Just the push event**
6. Click **Add webhook**

### GitLab Webhook

1. Go to your GitLab project
2. **Settings** → **Webhooks**
3. **URL:** `http://your-jenkins-url/project/restaurant-app`
4. **Trigger:** Push events
5. Click **Add webhook**

### Jenkins Configuration

1. Go to your Jenkins job
2. **Configure** → **Build Triggers**
3. Check **GitHub hook trigger for GITScm polling** (for GitHub)
   OR
   Check **Build when a change is pushed to GitLab** (for GitLab)
4. Click **Save**

Now builds will trigger automatically on every push!

## Troubleshooting

### Build Fails: "VITE_API_URL not found"

**Solution:** Make sure you've set the environment variable in Jenkins:
- Global: Manage Jenkins → Configure System → Global properties
- Job-level: Job → Configure → Build Environment → Inject environment variables

### Build Uses Wrong URL

**Solution:** Check environment variable value:
```bash
# In Jenkins build log, add:
echo "VITE_API_URL=${VITE_API_URL}"
```

### Docker Not Available

**Solution:** Make sure Docker is installed and accessible:
```bash
# In Jenkins build log, add:
docker --version
```

### Permission Denied

**Solution:** Add Jenkins user to docker group:
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

## Best Practices

1. ✅ **Use Global Environment Variables** for shared values
2. ✅ **Use Jenkins Credentials** for sensitive data
3. ✅ **Use Different Variables** for different environments
4. ✅ **Set Up Webhooks** for automatic builds
5. ✅ **Use Docker Layer Caching** for faster builds

## Example: Complete Setup

### 1. Set Global Environment Variable

**Jenkins** → **Manage Jenkins** → **Configure System** → **Global properties**:
```
VITE_API_URL=https://690dc4e6bd0fefc30a0241c0.mockapi.io/api/v1
```

### 2. Create Pipeline Job

**Jenkins** → **New Item** → **Pipeline**:
- **Name:** `restaurant-app`
- **Pipeline script from SCM**
- **SCM:** Git
- **Repository:** Your Git repo
- **Script Path:** `Jenkinsfile`

### 3. Set Up Webhook

**GitHub/GitLab** → **Webhooks**:
- **URL:** `http://your-jenkins-url/github-webhook/`
- **Events:** Push

### 4. Push Code

```bash
git push
```

### 5. Watch It Build!

Jenkins automatically:
- Detects the push
- Reads `VITE_API_URL` from environment
- Builds Docker image
- (Optional) Pushes to registry

## Summary

✅ **Set `VITE_API_URL` in Jenkins** (Global or Job-level)
✅ **Use Jenkinsfile** for automated builds
✅ **Set up webhooks** for automatic builds on push
✅ **No manual `--build-arg` needed!**

Your Docker builds are now fully automated with Jenkins! 🚀

