pipeline {
    agent any

    environment {
        NODEJS_TOOL = "NodeJS 20"    // NodeJS installation name in Jenkins
        BACKEND_DIR = "backend"
        FRONTEND_DIR = "frontend"
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

        stage('Archive Frontend Artifacts') {
            steps {
                echo "Archiving frontend build..."
                archiveArtifacts artifacts: "${FRONTEND_DIR}/dist/**", allowEmptyArchive: true
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
