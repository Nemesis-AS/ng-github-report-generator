pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh "npm install"
                sh "ng build --configuration=production"
            }
        }
        stage('Test') {
            steps {
                script {
                    def scannerHome = tool 'SonarQube Scanner';
                    withSonarQubeEnv('SonarQube-local') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
        stage("Quality Gate") {
            steps {
              timeout(time: 1, unit: 'HOURS') {
                waitForQualityGate abortPipeline: true
              }
            }
        }
        stage("Deploy") {
            steps {
                sh "rm -r ${JENKINS_HOME}/export_files/*"
                sh "cp -r dist/first-app/* ${JENKINS_HOME}/export_files/"
            }
        }
    }
}
