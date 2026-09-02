import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { getBounds } from '@gltf-transform/functions';

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read('Assembly 1.glb');
const root = doc.getRoot();

const wheels = [];
for (const node of root.listNodes()) {
  const n = node.getName() || '';
  const m = n.match(/Mecanum Wheel Set.*3625-0202-0104\s*<([1-4])>/);
  if (m) wheels.push({ node, idx: +m[1] });
}
if (wheels.length !== 4) throw new Error('expected 4 mecanum wheels, got ' + wheels.length);

for (const w of wheels) {
  const b = getBounds(w.node);
  const cx = (b.min[0] + b.max[0]) / 2;
  const cz = (b.min[2] + b.max[2]) / 2;
  const key = (cz < 0 ? 'F' : 'B') + (cx < 0 ? 'L' : 'R');
  w.key = key;
  w.center = [cx, (b.min[1] + b.max[1]) / 2, cz];
}
const keys = new Set(wheels.map((w) => w.key));
if (keys.size !== 4) throw new Error('corner assignment not unique: ' + [...keys]);

for (const w of wheels) {
  w.node.setName('wheel_' + w.key);
  console.log(`<${w.idx}> -> wheel_${w.key}  center=[${w.center.map((v) => v.toFixed(4)).join(', ')}]`);
}

await io.write('robot_named.glb', doc);
console.log('wrote robot_named.glb');
