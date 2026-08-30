/** @type {THREE.Mesh} */
const scene = new THREE.Scene();
const size = 10; 
const loader = new THREE.TextureLoader();
const texture = loader.load('Esther 2026-03-14 at 22.44.55.jpeg');
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
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 70),
    new THREE.MeshStandardMaterial({ color: 0x1b1440})
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(10, 15, 10);
scene.add(sun);
const box = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
);
box.position.set(1, 1, -10);
scene.add(box);