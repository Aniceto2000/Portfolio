const robot = new THREE.Group();
scene.add(robot);

const wheels = {};

const wheelTireMat = new THREE.MeshStandardMaterial({ color: 0x0c0c0c, roughness: 0.85, metalness: 0.1 });
const wheelRollerMat = new THREE.MeshStandardMaterial({ color: 0xb9c2c0, roughness: 0.5, metalness: 0.2 });

function makeWheel(radius, width) {
    const hub = new THREE.Group();
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, width, 24), wheelTireMat);
    tire.rotation.z = Math.PI / 2;
    hub.add(tire);
    for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        const roller = new THREE.Mesh(
            new THREE.BoxGeometry(width * 1.05, radius * 0.9, width * 0.55),
            wheelRollerMat
        );
        roller.position.set(0, Math.cos(a) * radius * 0.82, Math.sin(a) * radius * 0.82);
        roller.rotation.set(Math.PI / 4, 0, a + Math.PI / 2);
        hub.add(roller);
    }
    return hub;
}

function buildFallbackRobot() {
    const r = new THREE.Group();
    const chassis = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.5, 2.2),
        new THREE.MeshStandardMaterial({ color: 0x8a1c3a, metalness: 0.3, roughness: 0.5 })
    );
    chassis.position.y = 0.55;
    r.add(chassis);
    const plate = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.16, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x161616, metalness: 0.4, roughness: 0.6 })
    );
    plate.position.y = 0.9;
    r.add(plate);
    const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.8, 12),
        new THREE.MeshStandardMaterial({ color: 0x37f2d6, emissive: 0x1c7f70, emissiveIntensity: 0.6 })
    );
    mast.position.set(0, 1.3, 0);
    r.add(mast);
    const layout = { FL: [-0.92, -0.82], FR: [0.92, -0.82], BL: [-0.92, 0.82], BR: [0.92, 0.82] };
    for (const key in layout) {
        const hub = makeWheel(0.42, 0.34);
        hub.position.set(layout[key][0], 0.42, layout[key][1]);
        r.add(hub);
        wheels[key] = hub;
    }
    robot.add(r);
}

const WHEEL_LOCAL = {
    FL: [-0.118, -0.081, -0.117],
    FR: [0.118, -0.081, -0.117],
    BL: [-0.118, -0.081, 0.12],
    BR: [0.118, -0.081, 0.12]
};
const WHEEL_CAD_RADIUS = 0.052;

function setupRealRobot(model) {
    const pre = new THREE.Box3().setFromObject(model);
    const dims = pre.getSize(new THREE.Vector3());
    const s = 3.6 / Math.max(dims.x, dims.z);
    model.scale.setScalar(s);
    robot.add(model);
    robot.updateMatrixWorld(true);

    const drop = new THREE.Box3().setFromObject(model).min.y;
    model.position.y -= drop;

    const wheelR = WHEEL_CAD_RADIUS * s;
    for (const key in WHEEL_LOCAL) {
        const hub = makeWheel(wheelR, wheelR * 0.8);
        hub.position.set(
            WHEEL_LOCAL[key][0] * s,
            WHEEL_LOCAL[key][1] * s - drop,
            WHEEL_LOCAL[key][2] * s
        );
        robot.add(hub);
        wheels[key] = hub;
    }
}

const robotLoader = new THREE.GLTFLoader();
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('https://unpkg.com/three@0.128.0/examples/js/libs/draco/');
robotLoader.setDRACOLoader(dracoLoader);
robotLoader.load(
    './robot.glb',
    (gltf) => {
        try {
            setupRealRobot(gltf.scene);
        } catch (e) {
            while (robot.children.length) robot.remove(robot.children[0]);
            for (const k of Object.keys(wheels)) delete wheels[k];
            buildFallbackRobot();
        }
    },
    undefined,
    buildFallbackRobot
);
