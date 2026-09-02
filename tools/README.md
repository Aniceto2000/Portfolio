# tools/ — robot.glb regeneration pipeline

Turns a raw Onshape CAD export of the robot into the web-ready `../robot.glb`.

## Input

Export the assembly from Onshape as **binary glTF (.glb)** and save it as
`../Assembly 1.glb` (gitignored). Coarser tessellation = smaller output.

## Steps

```
npm install @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer draco3dgltf

node rename_wheels.mjs   # Assembly 1.glb  -> robot_named.glb   (finds + names the 4 mecanum wheels)
node shrink3.mjs         # robot_named.glb -> ../robot.glb       (deletes wheels, flattens chassis, Draco)
```

Run both from this directory. Add `NODE_OPTIONS=--max-old-space-size=12288` for large exports.
ESM `import` ignores `NODE_PATH`, so keep `node_modules` in this directory (or run from wherever it is).

## Wheels

`rename_wheels.mjs` prints each mecanum wheel's world-space `center=[x,y,z]` (metres, CAD frame).
Those four points go into `WHEEL_LOCAL` in `../robot.js`. `shrink3.mjs` **deletes** the wheel
geometry and `flatten` + `join` collapse the ~56k CAD primitives to ~60 — `flatten` is what makes
`join` effective but it erases the wheel node hierarchy, so `robot.js` rebuilds the four wheels
procedurally (`makeWheel`) at the `WHEEL_LOCAL` positions and spins them for the mecanum drive.

`shrink3.mjs` prints `final bounds`; it must match the `chassis-only bounds` it prints earlier —
that confirms `flatten` didn't shift the coordinate frame, so `WHEEL_LOCAL` stays valid.
