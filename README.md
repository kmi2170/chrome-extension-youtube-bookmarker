# YouTube Video Timestamp Bookmarker


This is a chrome extension.

## Features
- manfest v3
- React.js
- Webpack 5
- TailwindCSS

## Build
development
```bash
npm install 
npm run dev
```
production (optimized version)
```bash
npm install 
npm run build
```
All files are generated in /build folder.

## Install
Go to [chrome://extensions](chrome://extensions).
Switch to development mode, select unpacked, choose the folder (build, in this case)

## How to use 
Just click the icon appeared in YouTube control bar, where you want to save the timestamp.
From the extension popup, click Play icon in the current video section to play the video. The video will start from the time. Also saved videos are shown. Clicking one will open the video in a new tab. You can delete timestamps and videos by clicking delete icon.

