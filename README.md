# Fusion Capstone

Mobile app to make the life of CPOS's sales representative easier. It enables them to replace the existing paper and pen system with the latest mobile technology. 

This app will help in keeping track of each and every business they want.

With the latest technology, reports will be sent to their CRM so that on a management level, they can have an overview of the enitre project

# Project link
Clone [GitHub Repository Link](https://github.com/AdrianoCucci/CPOS-Capstone-App "Repo title")

# Prerequisite

1. Install [Node](https://nodejs.org/en/download/ "Node title") and npm 
2. Install [Angular CLI](https://cli.angular.io/ "Angular Title")
3. Install the [Ionic CLI](https://ionicframework.com/docs/installation/cli "Ionic Title")
```
$ npm install -g ionic
```


# Start the project 
The project is started with the regular ionic commands.

1. Run `npm install` to install all dependencies.
2. Run `ionic serve` to start the development environment.
3. To build the project run `ionic build android` or `ionic build ios`. In order for you to build an iOS app, you need to run on MacOS.

# Run the App

## Testing in browser
The majority of Ionic app development can be spent right in the browser using the `ionic serve` command:

```
$ cd newAppName
$ ionic serve
```

## Build & Run on a real device 

```
$ ionic cordova build android/ios
$ ionic cordova run android/ios
```

## Getting Started

* Clone the repo: `git clone https://github.com/AdrianoCucci/CPOS-Capstone-App.git`
* Fork the repo

## Project Structure

```
.
 ├── resources                    # Build files on the specific platforms (iOS, Android) and app icon + splash
 ├── src                          # This is where the app lives - *the main folder*
 ├── .gitignore                   # Specifies intentionally untracked files to ignore when using Git
 ├── .io-config.json              # Ionic ID
 ├── config.xml                   # Ionic config file
 ├── .ionic.config.json           # Global configuration for your Ionic app
 ├── package.json                 # Dependencies and build scripts
 ├── readme.md                    # Project description
 ├── tsconfig.json                # TypeScript configurations
 └── tslint.json                  # TypeScript linting options
```

### src directory
```
.
   ├── ...
   ├── src                       
   │   ├── app                    # This folder contains global modules and styling
   │   ├── assets                 # This folder contains images and the *data.json*
   |   ├── theme                  # The global SCSS variables to use throughout the app
   |   ├── declarations.d.ts      # A config file to make TypeScript objects available in intellisense
   |   ├── index.html             # The root index app file - This launches the app
   └── ...
```
# Add Firebase on project
## Create a Firebase Project
Before you can add Firebase to your JavaScript app, you need to [create a Firebase project](https://firebase.google.com/docs/web/setup#create-project) to connect to your app.

## Register your app
After you have a Firebase project, you can add your web app to it.

## Install dependencies
[@angular/fire](https://github.com/angular/angularfire) is the official Angular library for Firebase, we’ll install both packages:
```
$ npm install firebase @angular/fire --save
```
## Setup Firebase
To initialize Firebase in your app, you need to provide your app’s [Firebase project configuration](https://firebase.google.com/docs/web/setup#config-object). Copy it on src/environments/environment.ts
```
export const environment = {
  production: false,
  firebase: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  }
};
```
## Setup Google Maps
For the application to interact with Google Maps, you will need an API key for both Android and iOS.
Follow these steps:

1. If you haven't already, [create a Google Console account](https://console.cloud.google.com/).
2. See [how to setup API keys in the Google Console](https://support.google.com/googleapi/answer/6158862?hl=en).
3. Create two different API keys for Android an iOS.
4. Add restrictions to both API keys. 
   1. For the Android key:
      1. Under **Application restrictions**, select **Android apps**.
      2. Under **API restrictions**, select **Restrict key**.
      3. From the **Select APIs** drop-down list, select **Maps SDK for Android**
      4. Save your changes to the API key.
   1. For the iOS key:
      1. Under **Application restrictions**, select **iOS apps**.
      2. Under **API restrictions**, select **Restrict key**.
      3. From the **Select APIs** drop-down list, select **Maps SDK for iOS**
      4. Save your changes to the API key.
5. Add both API keys to the application's ```config.xml``` file located in the root directory here:
   ```
   <plugin name="uk.co.workingedge.phonegap.plugin.launchnavigator" source="npm">
       <variable name="GOOGLE_API_KEY_FOR_ANDROID" value="(YOUR-ANDROID-KEY)" />
   </plugin>
   <preference name="GOOGLE_MAPS_ANDROID_API_KEY" value="(YOUR-ANDROID-KEY)" />
   <preference name="GOOGLE_MAPS_IOS_API_KEY" value="(YOUR-IOS-KEY)" />
   ```
Once complete, there is one last API key you must create for the server. See the next step below for details.

## Server Setup
This project has a server written in associated with it responsible for making Google Maps API requests, which can be found here:
[GitHub Repository Link](https://github.com/AdrianoCucci/CPOS-Capstone-Server "Repo title")

When hosting the server, be sure to reference its URL in the value of the global ```apiHost``` string located in:
[src/app/services/google-maps/google-maps.service.ts](https://github.com/AdrianoCucci/CPOS-Capstone-App/blob/master/src/app/services/google-maps/google-maps.service.ts) on line 46 (without a trailing slash).
The Google Maps Service will send HTTP GET requests to this URL, where the server should then return a Google Maps API response.
