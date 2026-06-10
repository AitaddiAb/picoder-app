# Picoder App

Vue + Vite frontend for PiCoder, packaged for browser, Tauri desktop, and Capacitor Android.

## Development

```bash
pnpm install
pnpm serve
```

## Build

```bash
pnpm build
```

## Desktop

Run Tauri dev:

```bash
pnpm desktop:serve
```

Build desktop bundles:

```bash
pnpm macos:build
pnpm windows:build
```

## Android

Open Android project:

```bash
pnpm android:open
```

Build Android APK:

```bash
pnpm android:build
```

## App Icons / Splash Assets

Source logo:

```text
assets/logo.png
```

Regenerate Tauri desktop icons:

```bash
pnpm tauri icon assets/logo.png
```

Regenerate Capacitor Android icons and splash screens:

```bash
pnpm capacitor-assets generate --android --androidProject src-cap/android
```

After regenerating Android assets, sync Capacitor if needed:

```bash
pnpm cap sync android
```
