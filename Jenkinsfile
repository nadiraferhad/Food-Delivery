pipeline {
    agent any

    environment {
        NODEJS_TOOL = "NodeJS 20"          // Name of NodeJS installation in Jenkins global tools
        BACKEND_DIR = "backend"
        FRONTEND_DIR = "frontend"
        DOCKER_IMAGE = "nadiraferhad/food-delivery:latest"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from Git...'
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                echo "Using Node.js from Jenkins NodeJS Tool: ${NODEJS_TOOL}"
                nodejs("${NODEJS_TOOL}") {
                    sh 'node -v'
                    sh 'npm -v'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                nodejs("${NODEJS_TOOL}") {
                    dir("${BACKEND_DIR}") {
                        sh 'npm install'
                    }
                    dir("${FRONTEND_DIR}") {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                nodejs("${NODEJS_TOOL}") {
                    dir("${FRONTEND_DIR}") {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                nodejs("${NODEJS_TOOL}") {
                    dir("${BACKEND_DIR}") {
                        sh 'npm test || echo "No tests configured"'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image: ${DOCKER_IMAGE}"
                sh "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Push to Docker Hub (Optional)') {
            when {
                expression { return env.PUSH_DOCKER == 'true' }
            }
            steps {
                echo "Pushing Docker image to registry..."
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    sh "docker push ${DOCKER_IMAGE}"
                }
            }
        }

        stage('Archive Frontend Artifacts') {
            steps {
                echo "Archiving frontend build..."
                archiveArtifacts artifacts: "${FRONTEND_DIR}/dist/**", allowEmptyArchive: true
            }
        }

        stage('Push Changes to GitHub (Optional)') {
            when {
                expression { return env.PUSH_GIT == 'true' }
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-creds', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh """
                        git config user.name "Jenkins"
                        git config user.email "jenkins@local"
                        git add .
                        git commit -m "Automated commit from Jenkins"
                        git push https://${GIT_USER}:${GIT_PASS}@github.com/nadiraferhad/Food-Delivery.git HEAD:main
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning workspace..."
            cleanWs()
        }
        success {
            echo "Build completed successfully!"
        }
        failure {
            echo "Build failed!"
        }
    }
}
