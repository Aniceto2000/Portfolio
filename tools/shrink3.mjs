import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { weld, simplify, dedup, prune, join, flatten, getBounds } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import draco3d from 'draco3dgltf';

await MeshoptSimplifier.ready;

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.encoder': await draco3d.createEncoderModule(),
  'draco3d.decoder': await draco3d.createDecoderModule()
});

const doc = await io.read('robot_named.glb');
const root = doc.getRoot();
const scene = root.listScenes()[0];

const wheelInfo = [];
for (const node of root.listNodes()) {
  const n = node.getName() || '';
  if (!n.startsWith('wheel_')) continue;
  const b = getBounds(node);
  wheelInfo.push({
    key: n.replace('wheel_', ''),
    center: [(b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2],
    span: [b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]],
    node
  });
}

for (const w of wheelInfo) {
  [...w.node.listChildren()].forEach((c) => c.traverse((x) => x.dispose()));
  w.node.dispose();
}
prune()(doc);

const cb = getBounds(scene);
const cCenter = [(cb.min[0] + cb.max[0]) / 2, (cb.min[1] + cb.max[1]) / 2, (cb.min[2] + cb.max[2]) / 2];
const cHalf = [(cb.max[0] - cb.min[0]) / 2, (cb.max[1] - cb.min[1]) / 2, (cb.max[2] - cb.min[2]) / 2];

const frac = {};
for (const w of wheelInfo) {
  frac[w.key] = [
    +((w.center[0] - cCenter[0]) / cHalf[0]).toFixed(4),
    +((w.center[1] - cCenter[1]) / cHalf[1]).toFixed(4),
    +((w.center[2] - cCenter[2]) / cHalf[2]).toFixed(4)
  ];
}
const wheelDiam = wheelInfo.reduce((m, w) => Math.max(m, w.span[1], w.span[2]), 0);
console.log('chassis-only bounds:', JSON.stringify({ min: cb.min, max: cb.max }));
console.log('WHEEL_FRAC =', JSON.stringify(frac));
console.log('wheel diameter / chassis min-half =', (wheelDiam / 2 / Math.min(cHalf[0], cHalf[2])).toFixed(4));

await doc.transform(
  dedup(),
  flatten(),
  join(),
  weld({ tolerance: 0.0001 }),
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.5, error: 0.004 }),
  prune()
);

const fb = getBounds(root.listScenes()[0]);
let prims = 0;
for (const m of root.listMeshes()) prims += m.listPrimitives().length;
console.log('final bounds:', JSON.stringify({ min: fb.min.map((v) => +v.toFixed(4)), max: fb.max.map((v) => +v.toFixed(4)) }));
console.log('meshes:', root.listMeshes().length, 'primitives:', prims);

doc.createExtension(KHRDracoMeshCompression).setRequired(true);
await io.write('robot.glb', doc);
console.log('done');
