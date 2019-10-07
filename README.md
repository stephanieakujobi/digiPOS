# Fusion Capstone

Mobile app to make the life of CPOS's sales representative easier. It enables them to replace the existing paper and pen system with the latest mobile technology. 

This app will help in keeping track of each and every business they want.

With the latest technology, reports will be sent to their CRM so that on a management level, they can have an overview of the enitre project

# Project link
Install [GitHub Repository Link](https://github.com/AdrianoCucci/CPOS-Capstone-App "Repo title")

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
