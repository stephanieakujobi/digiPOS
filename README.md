# DigiPOS
DigiPOS is a mobile app to make the life of CPOS's sales representative easier. It enables them to replace the existing paper and pen system with the latest mobile technology. 

This app will help in keeping track of each and every business they want.

With the latest technology, reports will be sent to their CRM so that on a management level, they can have an overview of the enitre project.

## Setup the App
### Prerequisites
1. Install [Git](https://git-scm.com/).
2. Install [Node.js](https://nodejs.org/en/download/ "Node title").
3. Install [Angular CLI](https://cli.angular.io/ "Angular Title").
4. Install the [Ionic CLI](https://ionicframework.com/docs/installation/cli "Ionic Title") (See the [Ionic docs](https://ionicframework.com/docs/intro) for more information about the Ionic framework).
```
$ npm install -g ionic
```
5. Clone this repository using the Git CLI.
```
git clone https://github.com/AdrianoCucci/CPOS-Capstone-App.git
```
### Start an Ionic project 
The project is started with the regular Ionic commands.

1. Run `npm install` to install all dependencies.
2. Run `ionic serve` to start the development environment.
3. To build the project run `ionic build android` or `ionic build ios`. In order for you to build an iOS app, you need to run on MacOS.

### Create a Firebase Project
1. Before you can add Firebase to the app, you need to [create a Firebase project](https://firebase.google.com/docs/web/setup#create-project).
2. Install the [@angular/fire](https://github.com/angular/angularfire) dependancy into the project.
```
$ npm install firebase @angular/fire --save
```
3. To initialize Firebase in the app, you need to provide your [Firebase project configuration](https://firebase.google.com/docs/web/setup#config-object).
Once setup, copy the app configuration settings into **src/credentials/firebase.credentials.ts**.
```
export const FIREBASE_CREDENTIALS = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
  measurementId: ''
};
```

### Setup Google Maps
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

### Server Setup
This project has a server written in associated with it responsible for making Google Maps API requests, which can be found here:
[GitHub Repository Link](https://github.com/AdrianoCucci/CPOS-Capstone-Server "Repo title")

When hosting the server, be sure to reference its URL in the value of the global ```apiHost``` string located in:
[src/app/services/google-maps/google-maps.service.ts](https://github.com/AdrianoCucci/CPOS-Capstone-App/blob/master/src/app/services/google-maps/google-maps.service.ts) on line 46 (without a trailing slash).
The Google Maps Service will send HTTP GET requests to this URL, where the server should then return a Google Maps API response.

## Run the App
### Testing in browser
The majority of Ionic app development can be spent right in the browser using the following command:
```
$ ionic cordova run browser -l
```
Note that native mobile-specific features will not function when debugging in the browser.

### Testing on a real device
*Note: In the documentation linked below, anything related to "Capaciter" can be ignored. This app uses Cordova features instead.*

1. See the Ionic docs for [how to setup an Android device](https://ionicframework.com/docs/installation/android) and [how to setup an iOS device](https://ionicframework.com/docs/installation/ios).
2. See the Ionic docs for [how to run on an Android device](https://ionicframework.com/docs/building/android) and [how to run on an iOS device](https://ionicframework.com/docs/building/ios).

### Project Structure
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
