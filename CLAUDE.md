# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A learning project (Portuguese-language: commit messages and `Estudo_ThreeJS_Portfolio_3D.pdf` are PT-BR) — a 3D portfolio scene with Three.js themed around robotics / FIRST. There is **no build system, no package manager, no tests, and no linter** — it is a static site of hand-written scripts loaded from CDN.

The user has asked for **no comments in the code**. Keep all `.js` / `.html` comment-free.

## Running it

Serve the directory over HTTP (do not open `index.html` via `file://` — `GLTFLoader` fetches `./*.glb` and will hit CORS errors):

```
python3 -m http.server 8000
# then open http://localhost:8000
```

Note: `requestAnimationFrame` is throttled/paused when the tab is in the background, so the render loop only advances while the tab is focused. Verify motion logic by driving `animate()` manually from the devtools console (temporarily stub `clock.getDelta` to a fixed value) rather than trusting a backgrounded tab.

Controls: `W`/`A`/`S`/`D` move the robot holonomically (including sideways strafe), `Q`/`E` rotate it in place, `Shift` sprints. The camera lerps to follow the robot.

## Architecture

Three.js `r128`, `GLTFLoader`, and `DRACOLoader` load from CDN in `index.html`. All local scripts run in the **global scope and share globals** — no modules, imports, or exports. **Script order in `index.html` is load-bearing:**

1. `main.js` — `scene`, `OrthographicCamera`, `WebGLRenderer`, lights (`robotLight` is a point light moved to follow the robot each frame), and the PCB floor. The floor's base and glow textures are drawn procedurally on a `<canvas>` (`makePcbTexture` / `makePcbGlowTexture`). Exposes `pcbMaterial` and `pcbGlow` for the loop to animate. Has **no render loop**.
2. `robot.js` — creates `robot` as an empty `THREE.Group` **synchronously** (so the loop can reference it immediately), then `robotLoader.load('./robot.glb', ...)`. `setupRealRobot` scales the model so its footprint is ~3.6 units, drops the chassis onto the floor, then adds four procedural mecanum wheel groups (`makeWheel`, radius `WHEEL_CAD_RADIUS`) at `WHEEL_LOCAL` (the real CAD wheel centres, in the model's own metre-scale frame, ×scale). The wheels are true CAD-size so they tuck up inside the chassis — visible spinning only from underneath. `buildFallbackRobot` (primitive chassis + 4 wheels) runs on load error so the scene always works. `robotLoader` is a separate `GLTFLoader` from `languages.js`'s `loader`, with a `DRACOLoader` attached (decoder from the unpkg three r128 `libs/draco/` path).
3. `moviment.js` — keyboard state, the single render loop (`animate()`, called once at the bottom). Holonomic movement in the robot's local frame, position clamped to `±HALF` (floor edge), mecanum wheel-spin kinematics applied to `wheels` (each wheel group spun on local X), follow-camera, and the PCB glow animation (`pcbMaterial.emissiveIntensity` pulse + `pcbGlow.offset.x` scroll). `delta` is clamped to `0.05` to survive tab refocus.
4. `languages.js` — async-loads `Py.glb`, `HTML.glb`, `CSS.glb`, positions them, and builds the `stations` marker cylinders (`userData` carries `title` / `text`). The proximity/panel interaction for stations is **not built yet**.

### The robot model

`robot.glb` (~7.5 MB, Draco-compressed) is a heavily reduced version of the team's Onshape CAD assembly, needed for the site to run — commit it (it is not gitignored). It renders as a single static chassis with **no wheels**; `robot.js` adds procedural mecanum wheels on top at the real CAD wheel positions.

To regenerate it from a fresh CAD export, see `tools/README.md` — `tools/rename_wheels.mjs` then `tools/shrink3.mjs`. `flatten` is what lets `join` collapse the ~56k CAD primitives down to ~60, at the cost of erasing the wheel node hierarchy — hence the procedural wheels. `WHEEL_LOCAL` in `robot.js` is the wheel-centre list `rename_wheels.mjs` prints (`shrink3.mjs`'s `final bounds` must equal its `chassis-only bounds` for those coordinates to stay valid).

Chrome aggressively caches the CDN and local scripts here; when testing edits, serve on a **fresh port** each time rather than trusting a reload.

### Unused assets

`Chair.glb`, `Untitled.glb`, `Sem título.glb`, `python_logo.3mf.glb`, and the leftover experiment images (`waternormals.jpg`, `download.jpeg`, `waterclean.webp`, `Esther ...jpeg`) are present but unreferenced.
