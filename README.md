# raven_test

## Necessary Versions
Node: v20.19.2
Adonis: v6.18.0
NPM: 10.8.2

## Setup
1. Clone the repo onto your local machine
2. In the server you want to deploy on, ensure you have a file for each environment containing the env variables (example):
    - .env.development
    - .env.production
3. There are also secrets listed in the github repo used in the deploy.yml file which handles the github CI/CD
4. When you are ready to swap or choose the deployment, edit the -- --env= argument in the deploy.yml file and set it equal to the environment you want to deploy to (corresponding .env.development or .env.production file)

## Process
When we end up wanting to push a new change go the server, the deploy.yml file will trigger an action which will ssh into the server and rebuild our front end to whichever environment we want to deploy to. The build process is handled by the build.js file which is located in the scripts folder. This file is called by the server when it is triggered by the deploy.yml file. 