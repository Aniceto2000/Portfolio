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
