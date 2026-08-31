const loader = new THREE.GLTFLoader();

loader.load(
  './Py.glb',
  (gltf) => {

    const model = gltf.scene;
    
    model.scale.set(50.1, 50.1, 50.1);
    model.position.set(-1, 0.9, -11);
    model.rotation.y+=0.4;
    scene.add(model);}
);

loader.load(
  './HTML.glb',
  (gltf) => {

    const model = gltf.scene;
    
    model.scale.set(50.1, 50.1, 50.1);
    model.position.set(-5, 0.9, -9);
    model.rotation.y+=0.7;

    scene.add(model);}
);

loader.load(
  './CSS.glb',
  (gltf) => {

    const model = gltf.scene;
    
    model.scale.set(50.1, 50.1, 50.1);
    model.position.set(-8, 0.9, -6);
    model.rotation.y+=0.9;

    scene.add(model);}
);
const stations = [
{ position: [-1,0,-11], title: "Campeão Mundial FTC 2026", text: "Inspire Award, Houston..." },
{ position: [-5,0,-9], title: "Controle PID", text: "Torre rotativa de precisão..." },
{ position: [-8,0,-6], title: "Visão Computacional", text: "Câmera Limelight + rede neural..." },
];
stations.forEach(data => {
const marker = new THREE.Mesh(
new THREE.CylinderGeometry(2.5,2.5,5.5,32),
new THREE.MeshStandardMaterial({ color: 0x7fd8b0, emissive: 0x1a7f4e, opacity: 0.2, transparent: true })
);
marker.position.set(...data.position);
marker.userData = data;
scene.add(marker);
});