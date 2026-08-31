const keys={};
addEventListener("keydown",(e)=>keys[e.key.toLowerCase()]=true);
addEventListener("keyup",(e)=>keys[e.key.toLowerCase()]=false);
const clock = new THREE.Clock();
let speed = 4;
const speedX=2;
const forwardDirection = new THREE.Vector3();
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    if (keys['shift']) speed=8;
    if (keys['a']) robot.rotation.y += 2 * delta;
    if (keys['d']) robot.rotation.y -= 2 * delta;

    robot.getWorldDirection(forwardDirection);
    if (keys['w']) {
        robot.position.addScaledVector(forwardDirection, -speed * delta);
    }
    if (keys['s']) {
        robot.position.addScaledVector(forwardDirection, speed * delta); // Sinal negativo para ir para trás
    }
    const offset = new THREE.Vector3(8, 8, 8);
    const targetPos = robot.position.clone().add(offset);
    camera.position.lerp(targetPos, 0.08);
    camera.lookAt(robot.position);
   // scene.model.rotation.y+=1
    renderer.render(scene, camera);
}