const keys = {};
addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

const clock = new THREE.Clock();
const HALF = 33;
const moveVec = new THREE.Vector3();
const camOffset = new THREE.Vector3(8, 8, 8);
const camTarget = new THREE.Vector3();

function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    const speed = keys['shift'] ? 14 : 6;
    const turnSpeed = 2.4;
    const spinScale = 14;

    const ax = (keys['a'] ? 1 : 0) - (keys['d'] ? 1 : 0);
    const az = (keys['w'] ? 1 : 0) - (keys['s'] ? 1 : 0);
    const turn = (keys['q'] ? 1 : 0) - (keys['e'] ? 1 : 0);

    robot.rotation.y += turn * turnSpeed * delta;

    moveVec.set(ax, 0, az);
    if (moveVec.lengthSq() > 0) {
        moveVec.normalize().multiplyScalar(speed * delta).applyQuaternion(robot.quaternion);
        robot.position.add(moveVec);
        robot.position.x = Math.max(-HALF, Math.min(HALF, robot.position.x));
        robot.position.z = Math.max(-HALF, Math.min(HALF, robot.position.z));
    }

    const vy = -az;
    const vx = ax;
    const w = turn;
    const spin = {
        FL: (vy + vx + w) * spinScale * delta,
        FR: (vy - vx - w) * spinScale * delta,
        BL: (vy - vx + w) * spinScale * delta,
        BR: (vy + vx - w) * spinScale * delta
    };
    for (const k in spin) {
        if (wheels[k]) wheels[k].rotation.x += spin[k];
    }

    camTarget.copy(robot.position).add(camOffset);
    camera.position.lerp(camTarget, 0.08);
    camera.lookAt(robot.position);

    robotLight.position.set(robot.position.x, robot.position.y + 4, robot.position.z);

    pcbMaterial.emissiveIntensity = 0.35 + 0.22 * Math.sin(t * 2);
    pcbGlow.offset.x = (t * 0.03) % 1;

    renderer.render(scene, camera);
}

animate();
