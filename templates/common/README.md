# Minion App

Application source lives in `src/`. `minion.config.json` selects the entry point,
framework and Android application ID. `android/` contains only this app's native
configuration; the runtime comes from the installed `minion-js` package.

Use Node 22.18 or 24+, JDK 17, Android SDK 36, NDK 27.1.12297006 and CMake 3.22.1.
Set `JAVA_HOME` and `ANDROID_HOME`. Connect an authorized Android device.

```sh
npm install
npm run setup
npm run doctor
npm run android:install
npm run dev
```

HMR preserves compatible React and Svelte component state. Full-reload fallbacks
reset it; use `npm run dev -- --no-hmr` to always reload. Keep React components
separate from the entry module. Java or C++ changes require another APK build.
Run `npm run typecheck` and `npm run format:check` before sharing changes.

If changing the Android application ID, update `minion.config.json`,
`android/app/build.gradle` and `MainActivity.java` together.
