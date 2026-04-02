pipeline {
    agent any

    stages {
        stage('Clone') {
            steps {
                echo 'Code already in Jenkins workspace'
            }
        }

        stage('Backend Install') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Application ready for deployment'
            }
        }
    }
}