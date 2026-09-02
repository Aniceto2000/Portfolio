const scene = new THREE.Scene();
scene.background = new THREE.Color(0x04120d);
scene.fog = new THREE.Fog(0x04120d, 30, 115);

const size = 7.0;
let aspect = window.innerWidth / window.innerHeight;

const camera = new THREE.OrthographicCamera(
    -size * aspect,
     size * aspect,
     size,
    -size,
     0.1,
     1000
);
camera.position.set(8, 8, 8);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    aspect = window.innerWidth / window.innerHeight;
    camera.left = -size * aspect;
    camera.right = size * aspect;
    camera.top = size;
    camera.bottom = -size;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const FLOOR = 240;
const FLOOR_TILES = 14;

function makePcbTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 1024;
    const g = c.getContext('2d');

    g.fillStyle = '#07231a';
    g.fillRect(0, 0, 1024, 1024);

    const grad = g.createRadialGradient(512, 512, 120, 512, 512, 720);
    grad.addColorStop(0, 'rgba(20,60,44,0.35)');
    grad.addColorStop(1, 'rgba(0,0,0,0.35)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 1024, 1024);

    const step = 64;
    g.lineCap = 'round';
    for (let i = 0; i < 90; i++) {
        const sx = Math.round((Math.random() * 16)) * step;
        const sy = Math.round((Math.random() * 16)) * step;
        const dir = Math.random() < 0.5;
        const len1 = (1 + Math.floor(Math.random() * 6)) * step;
        const len2 = (1 + Math.floor(Math.random() * 6)) * step;
        g.strokeStyle = Math.random() < 0.78 ? '#0f7a45' : '#b8912f';
        g.lineWidth = 3 + Math.floor(Math.random() * 3);
        g.beginPath();
        g.moveTo(sx, sy);
        if (dir) {
            g.lineTo(sx + len1, sy);
            g.lineTo(sx + len1, sy + len2);
        } else {
            g.lineTo(sx, sy + len1);
            g.lineTo(sx + len2, sy + len1);
        }
        g.stroke();
    }

    for (let x = step; x < 1024; x += step) {
        for (let y = step; y < 1024; y += step) {
            if (Math.random() < 0.22) {
                g.fillStyle = '#c9a24a';
                g.beginPath();
                g.arc(x, y, 7, 0, Math.PI * 2);
                g.fill();
                g.fillStyle = '#07231a';
                g.beginPath();
                g.arc(x, y, 3, 0, Math.PI * 2);
                g.fill();
            }
        }
    }

    g.fillStyle = '#d8e4dc';
    g.font = '18px monospace';
    const tags = ['FTC 2026', 'PID', 'CV', '3625-0202', 'Rx', 'Tx', 'GND', '12V'];
    for (let i = 0; i < 26; i++) {
        g.save();
        g.translate(Math.random() * 1024, Math.random() * 1024);
        if (Math.random() < 0.5) g.rotate(Math.PI / 2);
        g.globalAlpha = 0.5;
        g.fillText(tags[i % tags.length], 0, 0);
        g.restore();
    }
    g.globalAlpha = 1;

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(FLOOR_TILES, FLOOR_TILES);
    return tex;
}

function makePcbGlowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 1024;
    const g = c.getContext('2d');
    g.fillStyle = '#000000';
    g.fillRect(0, 0, 1024, 1024);

    const step = 64;
    g.lineCap = 'round';
    g.strokeStyle = '#37f2d6';
    g.shadowColor = '#37f2d6';
    g.shadowBlur = 14;
    for (let i = 0; i < 7; i++) {
        const sx = Math.round((Math.random() * 16)) * step;
        const sy = Math.round((Math.random() * 16)) * step;
        const len1 = (3 + Math.floor(Math.random() * 8)) * step;
        const len2 = (3 + Math.floor(Math.random() * 8)) * step;
        g.lineWidth = 4;
        g.beginPath();
        g.moveTo(sx, sy);
        g.lineTo(sx + len1, sy);
        g.lineTo(sx + len1, sy + len2);
        g.stroke();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(FLOOR_TILES, FLOOR_TILES);
    return tex;
}

const pcbGlow = makePcbGlowTexture();
const pcbMaterial = new THREE.MeshStandardMaterial({
    map: makePcbTexture(),
    emissive: 0x37f2d6,
    emissiveMap: pcbGlow,
    emissiveIntensity: 0.5,
    metalness: 0.3,
    roughness: 0.65
});

const floor = new THREE.Mesh(new THREE.PlaneGeometry(FLOOR, FLOOR), pcbMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

scene.add(new THREE.AmbientLight(0xffffff, 0.35));

const sun = new THREE.DirectionalLight(0xffffff, 0.7);
sun.position.set(10, 15, 10);
scene.add(sun);

const robotLight = new THREE.PointLight(0x37f2d6, 0.7, 40, 2);
robotLight.position.set(0, 4, 0);
scene.add(robotLight);
