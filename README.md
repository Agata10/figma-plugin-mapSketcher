# Map Sketcher

## Table of Contents

- [About](#about)
- [Technologies](#technologies)
- [Run Locally](#run-locally)
- [Lessons](#lessons-learned)
- [Future app possibilities](#possibilities)
- [Demo](#demo)
- [Screenshots](#screenshots)
- [API Reference](#api-reference)
- [License](#license)

## About

Map Sketcher is figma plugin for genereting countries maps.
The UI was created using React App and bundled to Figma Plugin API by webpack.\
The user enters the country name, then he's able to genereate map into Preview, if he wants to change the country he simply can do it. After that 'Append Vector' place map into Figma.

## Technologies

- React
- TypeScript
- HTML / CSS
- Figma Plugin API
- different API's to generete GeoJson
- webpack

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

build

```bash
  npm run build
```

Start the server

```bash
  npm run start
```

Watch tsconfig file

```bash
Ctrl+Shift+B
```

In Figma:
Plugins -> Development -> import from manifest

## Lessons Learned

1. I practiced bundling files with webpack. I needed to figure out how to organize my files, place entry point correctly.
   The entry point for UI : `dist/ui.html`, and for figma plugin: `dist/code.js`

2. Figma Plugin works with iframe and sandbox. The sandbox is the Figma plugin side of my application (`code.ts`) which has access to Figma layers. It gets message via `onmessage` from UI. My UI created in React (`ui.tsx`) uses iframe. It has access to browser API's, user input and it communicate with the plugin by `postMessage`.

3. The problem I faced was not able to get by country name the geojson file from `geoBundaries.org` API. They required country ISO. I needed to take user input and get country ISO from other API, then pass that to the geoBundaries API.

4. To convert geoJSON to SVG path, I used npm package: `geojson2svg`. I was able to pass it to Figma and then create node.

5. I had a conflict issuse with @figma/plugin-typings and the other file in index.d.ts. for `fetch` and `console` method. They were defined in two files so I needed to comment the definition in one of the files.

## Future app possibilities

There are possibilities to expand app for more features like:

1. support for more administrative areas, e.g.: states & counties
2. adding a world map for easier area selection
3. selecting multiple regions at once

## Demo

https://github.com/Agata10/figma-plugin-mapSketcher/blob/main/src/assets/map_sketcher.mov

## Screenshots

![App Screenshot](/src/assets/screenshot.png)

## API Reference

#### Country ISO + generating the list of country names

`restcountries.com`

#### GeoJson file access

`geoboundaries.org`

## License

[MIT](/LICENSE)
