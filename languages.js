const loaderGlb = new THREE.GLTFLoader();

// Carrega o arquivo .glb
loaderGlb.load(
  '/Sem título.glb',
  (gltf) => {

    const model = gltf.scene;
    
    model.scale.set(50.1, 50.1, 50.1);
    model.position.set(0, 10, 10);
    model.rotation.y+=1;
    scene.add(model);}
);

const loaderJava = new THREE.GLTFLoader();
loaderGlb.load(
  '/HTML.glb',
  (gltf) => {

    const model = gltf.scene;
    
    model.scale.set(50.1, 50.1, 50.1);
    model.position.set(0, 10, 7);
    model.rotation.y+=0.7;
    scene.add(model);}
);
