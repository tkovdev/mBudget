# Project Overview

# How to Setup
## Prereqs
- install Firebase Admin SDK (npm)

## Steps
- create an `.env` file in the root directory and add the settings from firebase console under "general"


## Setting variables
- copy the required fields into a new file called `.env` under the root folder of this repo
```
    PRODUCTION=true
    API_URL=<N/aA>
    GAPI_CLIENT_ID=<client_id_from_google_console>
    GAPI_REDIRECT_URI=<redirect_uri_from_google_console>
    FIREBASE_API_KEY=<from_firebase_console>
    AUTH_DOMAIN=<from_firebase_console>
    PROJECT_ID=<from_firebase_console>
    STORAGE_BUCKET=<from_firebase_console>
    MESSAGING_SENDER_ID=<from_firebase_console>
    APP_ID=<from_firebase_console>
    MEASUREMENT_ID=<N/A>
```
- run <code>export $(cat .env | xargs)</code> to set the env vars for the terminal session (rather than setting permanently)
- to check vars were set correctly, run <code>printenv</code>

## Building
run `npm run build:prod`, this will create the correct environment.ts file from the .env file

## Deploying
run "Building" first, then run `firebase deploy`