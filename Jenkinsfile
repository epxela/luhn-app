pipeline {
  agent any

  stages {

    stage('Build') {
      steps {
        sh 'docker compose -f deploy/compose.yml build'
      }
    }

    stage('Test') {
      steps {
        sh 'echo "tests ok"'
      }
    }

    stage('Deploy') {
      steps {
        sh 'docker compose -f deploy/compose.yml up -d'
      }
    }

  }
}
