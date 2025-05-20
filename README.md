# Tauri + Solid + Typescript

This is a side project to reimplement the NYT game Connections, but with a feature to pin words so they are unaffected by Shuffle. I also wanted to make some UI improvements over the connections archive app I have been using on my phone.

I made this hoping to get some exposure to Tauri and SolidJS.

## Dev setup

`npm i` should install everything you need.
`npm run` will list the possible commands:
- `start` / `dev`: live development
- `build`: bundle web assets to `/dist`
- `serve`: serve web assets locally
- `tauri`: send commands to tauri CLI ([reference](https://v2.tauri.app/reference/cli/))

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Connections data
Data from https://github.com/Eyefyre/NYT-Connections-Answers/blob/main/connections.json
