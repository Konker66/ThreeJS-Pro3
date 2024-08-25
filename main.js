// Import the necessary modules from the Three.js library
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; 

// Create a WebGL renderer with antialiasing enabled
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace; // Set the color space

// Set the size of the renderer to the window's dimensions
renderer.setSize(window.innerWidth, window.innerHeight);
// Set the background color of the renderer to black
renderer.setClearColor(0x000000);
// Set the pixel ratio for the renderer
renderer.setPixelRatio(window.devicePixelRatio);

// Enable shadow mapping in the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows

// Append the renderer's DOM element to the document body
document.body.appendChild(renderer.domElement);

// Create a new scene
const scene = new THREE.Scene();

// Create a perspective camera with a field of view of 45 degrees
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
// ======================================================== //
camera.position.set(4, 5, 10); // Set the camera position
// ======================================================== //
// Create orbit controls for the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable damping (inertia)
controls.enablePan = false; // Disable panning
controls.minDistance = 5; // Set minimum zoom distance
controls.maxDistance = 30; // Set maximum zoom distance
controls.minPolarAngle = 0; // Set minimum polar angle
controls.maxPolarAngle = 3; // Set maximum polar angle
controls.autoRotate = true; // Enable auto-rotation
controls.autoRotateSpeed = 1.0; // Set the auto-rotation speed
controls.target = new THREE.Vector3(0, 1, 0); // Set the target of the controls
controls.update(); // Update the controls

// Create a spotlight to illuminate the scene
const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 0.22, 1);
spotLight.position.set(0, 25, 0); // Set the position of the spotlight
spotLight.castShadow = false; // Enable shadows for the spotlight
spotLight.shadow.bias = -0.0001; // Set shadow bias
scene.add(spotLight); // Add the spotlight to the scene

// Load a GLTF model
const loader = new GLTFLoader().setPath('public/millennium_falcon/');
loader.load('scene.gltf', (gltf) => {
  console.log('loading model');
  const mesh = gltf.scene;

  // Traverse the model and set the material color
  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.material.color.setRGB(16 / 255, 188 / 255, 240 / 255); // Set the color to rgb(16, 188, 240)
    }
  });

  mesh.position.set(0, 0.5, -1); // Set the position of the model
  scene.add(mesh); // Add the model to the scene

  // Hide the progress container once the model is loaded
  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  console.log(`Loading model: ${xhr.loaded / xhr.total * 100}%`); // Log the loading progress
}, (error) => {
  console.error('Error loading model:', error); // Log any errors
});

// Adjust the camera and renderer size when the window is resized
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate); // Request the next frame
  controls.update(); // Update the controls
  renderer.render(scene, camera); // Render the scene from the perspective of the camera
}

animate(); // Start the animation loop