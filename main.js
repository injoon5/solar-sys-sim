import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls( camera, renderer.domElement );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set( 0, 20, 100 );
controls.update();

// Create Sun
const sunGeometry = new THREE.SphereGeometry(50, 64, 64); 
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planet data with increased scale
const planets = [
    { name: 'Mercury', size: 2, color: 0xaaaaaa, distance: 390, speed: 0.04 },
    { name: 'Venus', size: 6, color: 0xffa500, distance: 720, speed: 0.015 },
    { name: 'Earth', size: 6.4, color: 0x0000ff, distance: 1000, speed: 0.01 },
    { name: 'Mars', size: 3.4, color: 0xff0000, distance: 1520, speed: 0.008 },
    { name: 'Jupiter', size: 64, color: 0xffe5b4, distance: 5200, speed: 0.002 },
    { name: 'Saturn', size: 54, color: 0xffd700, distance: 9540, speed: 0.001 },
    { name: 'Uranus', size: 22, color: 0x00ffff, distance: 19200, speed: 0.0006 },
    { name: 'Neptune', size: 20, color: 0x0000ff, distance: 30060, speed: 0.0005 },
];

// Create Planets
const planetMeshes = [];
planets.forEach((planetData) => {
    const geometry = new THREE.SphereGeometry(planetData.size, 64, 64); 
    //geometry = THREE.BufferGeometryUtils.mergeVertices(geometry);
    //geometry.computeVertexNormals();
    const material = new THREE.MeshBasicMaterial( {
        map: new THREE.TextureLoader().load(
            'http://localhost:5173/' + planetData.name + '.jpg'
        )
    } );

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(planetData.distance, 0, 0); // Scaled distance
    scene.add(mesh);
    planetMeshes.push({ mesh, speed: planetData.speed, distance: planetData.distance, name: planetData.name }); // Scaled distance
});

// Set camera position
camera.position.z = 5000; 
camera.lookAt(0,0,0)

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate each planet around the sun
    planetMeshes.forEach((planet) => {
        const angle = Date.now() * 0.0001 * planet.speed;
        planet.mesh.position.x = Math.cos(angle) * planet.distance;
        planet.mesh.position.z = Math.sin(angle) * planet.distance;
    });
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Locate planet function
function locatePlanet(name) {
    const planet = planetMeshes.find(p => p.name === name);
    if (planet) {
        camera.position.set(planet.mesh.position.x, planet.mesh.position.y + 200, planet.mesh.position.z + 200);
        camera.lookAt(planet.mesh.position);
    }
}