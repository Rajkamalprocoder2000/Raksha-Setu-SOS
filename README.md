# Raksha Setu SOS

Raksha Setu SOS is a React Native safety app prototype focused on fast emergency response. The app includes mobile onboarding, Google sign-in, emergency SOS, trusted contacts, safe zones, nearby help, alerts, tracking controls, and plan management.

## Project Preview

![Raksha Setu SOS app preview](https://raw.githubusercontent.com/Rajkamalprocoder2000/Raksha-Setu-SOS/main/assets/device-raksha-setu.png)

## Tech Stack

- React Native 0.73.7 for Android and iOS app development
- React 18.2 for component-based UI
- Firebase Auth for Google authentication
- Google Sign-In for native Google login
- React Native WebView for the embedded Leaflet/OpenStreetMap nearby help map
- Local reducer-based store for demo app state

## Main Features

- Mobile OTP demo login with OTP `9342`
- Google sign-in using Firebase Authentication
- SOS press-and-hold flow with alert creation
- Trusted contacts add/remove flow
- Safe zones add, pause/resume, and delete flow
- Nearby help request flow
- Live map with current location and nearby safety points
- Emergency hotline quick dial
- Alerts screen for SOS, tracking, zone, and nearby updates
- Free, Plus, and Family plan selection
- Tracking toggle and sign-out controls

## Project Structure

```text
SafeGuardRN/
  App.js                         Root app, auth listener, and navigation state
  index.js                       React Native app registry entry
  package.json                   Scripts and npm dependencies
  android/                       Android native project
  ios/                           iOS native project
  src/
    data/
      demoState.js               Demo contacts, zones, alerts, plans, nearby points
    screens/
      AuthFlow.js                Mobile OTP and Google sign-in screens
      MainFlow.js                Home, alerts, nearby, settings, contacts, zones, plans
    services/
      googleAuth.js              Firebase + Google Sign-In helper functions
    store/
      AppStore.js                App reducer, actions, and context provider
    ui/
      components.js              Shared UI components
    theme.js                     Colors, spacing, radius, and shadow tokens
```

## How The App Works

1. `App.js` wraps the app with `AppProvider`, listens for Firebase Google auth session changes, and switches between `AuthFlow` and `MainFlow`.
2. `AuthFlow.js` handles demo mobile login. The demo OTP is `9342`. It also supports Google sign-in through `googleAuth.js`.
3. `AppStore.js` keeps app state in a React reducer. Actions handle login, sign-out, SOS, contacts, zones, plans, tracking, and nearby requests.
4. `MainFlow.js` renders the logged-in app. It uses simple route state for tabs and inner screens.
5. Nearby help uses `react-native-webview` to render a Leaflet map with OpenStreetMap tiles.
6. `theme.js` keeps the white/red safety design consistent across screens.

## Setup

Install dependencies:

```bash
npm install
```

Start Metro:

```bash
npm start
```

Run Android:

```bash
npm run android
```

Run iOS:

```bash
npm run ios
```

## Firebase / Google Sign-In Notes

Google sign-in is wired in `src/services/googleAuth.js`. For a production build, add the correct Firebase project files and OAuth client IDs:

- Android: `android/app/google-services.json`
- iOS: `ios/GoogleService-Info.plist`
- Web and iOS OAuth client IDs in `googleAuth.js`

These files are ignored by Git because they are environment-specific.

## Current Status

This repository contains the React Native source code and native project folders. Generated folders such as `node_modules`, Android build output, logs, APKs, and environment files are intentionally excluded from Git.
