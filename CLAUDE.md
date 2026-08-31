# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A learning project (Portuguese-language: commit messages, code comments, and `Estudo_ThreeJS_Portfolio_3D.pdf` are all in PT-BR) for building a 3D portfolio scene with Three.js. There is **no build system, no package manager, no tests, and no linter** — it is a static site of hand-written scripts loaded from CDN.

## Running it

Serve the directory over HTTP (do not open `index.html` via `file://` — `GLTFLoader` fetches `./*.glb` and will hit CORS errors):

```
python3 -m http.server 8000
# then open http://localhost:8000
```

Controls once running: `W`/`S` move the robot forward/back along its facing, `A`/`D` rotate it, `Shift` sprints. The camera lerps to follow the robot.

## Architecture

Three.js `r128` and `GLTFLoader` load from CDN in `index.html`. All four local scripts run in the **global scope and share globals** (`scene`, `camera`, `renderer`, `robot`) — there are no modules, imports, or exports. **Script order in `index.html` is load-bearing:**

1. `main.js` — creates `scene`, the `OrthographicCamera`, the `WebGLRenderer` (appended to `document.body`), lights, floor plane, and a placeholder green box.
2. `robot.js` — builds the player `robot` as a `THREE.Group` (body + two wheels) and adds it to `scene`. Depends on `scene` from main.js.
3. `moviment.js` — keyboard state, the follow-camera math, and the render loop. Depends on `robot` and `camera`.
4. `languages.js` — async-loads `Py.glb`, `HTML.glb`, `CSS.glb` and positions them in the scene.

### Gotcha: duplicate `animate()`

Both `main.js` (line ~23) and `moviment.js` (line ~8) declare a global function named `animate` and call it. Because `moviment.js` loads later it redefines `window.animate`, and since `requestAnimationFrame(animate)` re-resolves the name each frame, the running loop switches from main.js's to moviment.js's version after moviment.js loads. If you edit the render loop, edit the one in `moviment.js` — the one in `main.js` is dead once the page finishes loading.

### Unused assets

Only `Py.glb`, `HTML.glb`, `CSS.glb` are loaded. `Chair.glb`, `Untitled.glb`, `Sem título.glb`, `python_logo.3mf.glb` are present but unreferenced. `index.html` also has a stray `<script src="https://unpkg.com"></script>` tag that does nothing.
