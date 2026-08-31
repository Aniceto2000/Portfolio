/** @type {THREE.Mesh} */
const scene = new THREE.Scene();
const size = 10; 
const loaderTexture = new THREE.TextureLoader();
const texture = loaderTexture.load('Esther 2026-03-14 at 22.44.55.jpeg');
texture.colorSpace = THREE.SRGBColorSpace;
const aspect = window.innerWidth / window.innerHeight;

const camera = new THREE.OrthographicCamera(
    -size * aspect, 
     size * aspect, 
     size,          
    -size,         
    0.1,           
    1000           
);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//camera.position.set(-30,5,40);
//camera.rotation.y = -Math.PI / 4;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
const waterNormals = new THREE.TextureLoader().load('waternormals.jpg', (tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; // deixa a textura repetir pra cobrir o plano
});

const water = new THREE.Water(
    new THREE.PlaneGeometry(70, 70),
    {
        textureWidth: 512,   // resolução do espelho interno (usa potência de 2)
        textureHeight: 512,
        waterNormals: waterNormals,
        sunDirection: new THREE.Vector3(10, 15, 10).normalize(), // mesma direção da sua DirectionalLight
        sunColor: 0xffffff,
        waterColor: 0x00FFFF,   // cor base da água (esse é um azul-petróleo escuro)
        distortionScale: 2.5,   // o quanto o reflexo entorta perto das "rugas"
        fog: false
    }
);

water.rotation.x = -Math.PI / 2; // o plano nasce em pé (plano XY); giramos -90° pra deitar

scene.add(water);
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(10, 15, 10);
scene.add(sun);
const box = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
);
box.position.set(1, 10, -10);
scene.add(box);