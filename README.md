<a href="https://minion.example">
  <img src="assets/banner.png" alt="Minion" />
</a>

<h1 align="center">
  <a href="https://minion.example">create-minion-app</a>
</h1>

<p align="center">
  <strong>Start building with Minion in seconds.</strong><br>
  Create a polished Android app with React or Svelte.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Android-3DDC84" alt="Android platform" />
  <img src="https://img.shields.io/badge/frameworks-React%20%7C%20Svelte-ff69b4" alt="React and Svelte" />
  <img src="https://img.shields.io/badge/status-experimental-orange" alt="Experimental project" />
</p>

<h3 align="center">
  <a href="https://minion.example/docs/getting-started">Getting Started</a>
  <span> &middot; </span>
  <a href="https://minion.example/docs/components">Components</a>
  <span> &middot; </span>
  <a href="https://minion.example/docs">Documentation</a>
</h3>

`create-minion-app` is the fastest way to start a Minion project. The wizard
sets up a native Android host, your chosen UI framework, file-based routing and
a small interactive demo so the first install has something real to run.

## Create an app

Run the wizard from any empty directory:

```sh
npx create-minion-app@latest
```

Choose a project name, select React or Svelte, and confirm the Android
application ID. Then install dependencies and launch the app:

```sh
cd my-minion-app
npm install
npm run setup
npm run android:install
npm run dev
```

## Choose a template

The same command supports both Minion adapters:

```sh
# React + TypeScript
npx create-minion-app@latest my-app --template react

# Svelte 5 + the Minion custom renderer build
npx create-minion-app@latest my-app --template svelte
```

The Svelte template pins the exact renderer-compatible Svelte revision used by
Minion. Both templates use the `minion-js` package and share the same native
Android runtime.

## Automation

For scripts and CI, skip the prompts with `--yes`:

```sh
npx create-minion-app@latest my-app \
  --template react \
  --id com.example.myapp \
  --yes
```

## What gets created

- **Android host** with Gradle configuration and a `MinionActivity`
- **Framework entry point** for React or Svelte
- **File-based routing** with a single home route
- **Interactive counter demo** using Minion primitives
- **Development scripts** for setup, type checking, bundling, device install and HMR

## Requirements

Generated apps require Node 22.18+, JDK 17, Android SDK 36, NDK
27.1.12297006 and CMake 3.22.1. Follow the
[environment setup guide](https://minion.example/docs/environment-setup) before
running `npm run setup`.

## License

`create-minion-app` is part of the Minion project and is currently distributed
under the project’s unpublished license.
