## Design Principle
To demonstrate our unified frontend setup, best practice and patterns.
* provide standard way to solve all typical needs
* make business logic code concise and straight forward
* emphasize maintainability 

## Usage
to start backend on https://localhost:8443
```
./gradlew :website:run
```
start frontend dev server
```
cd website-frontend
yarn install && yarn start
```
full build, dist to build/website/install/website
```
./gradlew buildFrontend
./gradlew :website:installDist
```

## Tech stack
* webpack
* react
* react-router
* redux
* redux-saga
* axios

## Design goals
* unified project setup and code quality checking across all frontend projects
    * review and finalize eslint and stylelint rules 
    * encapsulate all boilerplate code into reusable builder or lib code
* provide standard way of layout
    * nav, subpage switch
    * entire page switch, e.g. error page
    * modal dialog e.g. login or prompt
    * page flow, e.g. once login redirect to somewhere
* global error handling
    * handle server side AJAX error, e.g. 403->show login page, 400/500->show error page
    * handle client side JS, React rendering error, browser js loading errors   
    * stacktrace-js? https://github.com/getsentry/sentry?
* choice one UI lib
    * standard way validation form fields
    * theme support?
    * builtin progress indicator (customizable)
    * antd vs element UI vs semantic UI react?
* standard way of AJAX calls
    * encapsulate ajax lib, e.g. later we may switch axios to fetch  
    * standard way to validate ajax response, any chance to be consistent with proptypes? 

mid-long term:
* check dva, roadhog, should we impl similar one or use one with deeply customization
* write our own reusable UI lib, add animation
* check postcss vs scss/less？which is better, we need dynamic theme switching
* optimization to be builtin and transparent 
    * lazy load js/css/page
    * heavy UI component rendering, e.g. render solid color/place holder, then render in async
* collect all user behavior and send back to server
    * maybe we can send all redux action flow back to server, to make it easy to replay and debug?
* provide standard way to unit test components/reducer/etc
* provide standard way to support local dev, e.g. better mock server side ajax?
* UI automation test, selenium or just chrome headless 

## TODO
* how to manage sourcemap? just use nosources-source-map or put source-map somewhere else
