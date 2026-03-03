# Pokedex (React + TypeScript + Webpack)

A single-page Pokedex app inspired by classic Pokemon UI styling.

It includes:
- 386 Pokemon (Gen 1-3) bundled locally in the app data
- Search by Pokemon name or ID
- Pokemon browser list with filtering
- Evolution chain quick navigation
- Shiny sprite toggle
- Trainer name onboarding and local persistence
- Theme template selector: Classic Red, Blue, Green, Yellow

## Tech Stack

- React 18
- TypeScript
- Webpack 5
- webpack-dev-server

## Project Structure

- `index.tsx` - React app entry point
- `pokedex.tsx` - Main app UI and Pokemon dataset
- `index.html` - App HTML shell
- `webpack.config.js` - Build and dev-server config

## Local Development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm start
```

Default dev URL: `http://localhost:3000`

## Production Build

Build command:

```bash
npm run build
```

This build:
- Compiles webpack assets to `dist/`
- Copies `index.html` into `dist/`
- Mirrors `dist/` into `build/` for compatibility with hosts that expect `build`

## Deployment Notes (Hostinger / Static Hosting)

Use:
- Build command: `npm run build`
- Publish directory: `dist` (recommended)

The project also generates `build/` as a fallback publish directory.

## Theme Templates

The app includes a Theme dropdown with:
- Classic Red
- Classic Blue
- Classic Green
- Classic Yellow

Selected theme is saved in browser local storage.

