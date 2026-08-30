const robot = new THREE.Group();
const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.6, 1.6),
    new THREE.MeshStandardMaterial({ color: 0x8a1c3a })
    
);
body.rotation.x = Math.PI / 19;
body.position.y = 0.5;
robot.add(body);
const wheel = new THREE.CylinderGeometry(0.3,0.3,0.2,16);
[[-0.6,0.3,0], [0.6,0.3,0]].forEach(([x,y,z]) => {
    const w = new THREE.Mesh(wheel, new THREE.MeshStandardMaterial({ color: 0x111111 }));
    w.rotation.z = Math.PI / 2;
    w.position.set(x,y,z);
    robot.add(w);
})
scene.add(robot);
