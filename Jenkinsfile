pipeline{
    agent any
    environment {
        user = credentials('sapplings-user')
        host = credentials('sapplings-ip')
    }
    stages{
        stage('stop previous deployment'){  
            steps{
                sshagent(credentials : ['sapplings droplet 1']) {
                    sh ("ssh $user@$host pm2 stop app || echo 'pm2 instance does not exist'")
                    sh ("ssh $user@$host pm2 delete app || echo 'pm2 instance does not exist'")
                }  
            } 
        }
        stage('delete previous deployment'){
            steps{
                    sshagent(credentials : ['sapplings droplet 1']) {
                    sh ("ssh $user@$host rm -r saplings2021backend || echo 'folder does not exist'")
                    sh ("ssh $user@$host mkdir saplings2021backend")
                }
            }           
        }
        stage('move latest'){   
            steps{
                sshagent(credentials : ['sapplings droplet 1']) {
                    sh ("rsync -pav . $user@$host:saplings2021backend")              
                }
            }           
        }
        stage('installing dependencies'){
            steps{
                sshagent(credentials : ['sapplings droplet 1']) {
                    sh ("ssh $user@$host npm i --prefix saplings2021backend")               
                }  
            }         
        }
        stage('restart app'){
            steps{
                sshagent(credentials : ['sapplings droplet 1']) {
                    sh ("ssh  $user@$host cd saplings2021backend && pm2 start app.js --name app")               
                }           
            }
        }   
    }
}
