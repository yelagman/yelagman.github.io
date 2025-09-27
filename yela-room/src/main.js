import './style.scss'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.querySelector("#experience-canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// loaders
const textureLoader = new THREE.TextureLoader();


// model loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader( dracoLoader );

const textureMap = {
  First : {
    day: '/textures/room/first_texture_set.webp'
  },
  Second : {
    day: '/textures/room/second_texture_set.webp'
  },
  Third : {
    day: '/textures/room/third_texture_set.webp'
  },
  Fourth : {
    day: '/textures/room/fourth_texture_set.webp'
  },
  Fifth : {
    day: '/textures/room/fifth_texture_set.webp'
  },
  Sixth : {
    day: '/textures/room/sixth_texture_set.webp'
  },
};

const loadedTextures = {
  day: {}

};

Object.entries(textureMap).forEach(([key, paths]) => {

  const dayTexture = textureLoader.load(paths.day);
  dayTexture.flipY = false;
  dayTexture.colorSpace = THREE.SRGBColorSpace;
  loadedTextures.day[key] = dayTexture;

});

const videoElement = document.createElement('video');
videoElement.src = '/textures/video/oned.mp4';
videoElement.loop = true;
videoElement.autoplay = true;
videoElement.muted = true;
videoElement.playsInline = true;
videoElement.play(); 

const videoTexture = new THREE.VideoTexture(videoElement);
videoTexture.colorSpace = THREE.SRGBColorSpace;
videoTexture.flipY = false;

// replace your loader.load with this
loader.load('/models/Room_Portfolio_V1.glb', (glb) => {

  glb.scene.traverse((child) => {
    if (child.isMesh) {

      if (child.name.includes('Computer_Screen')){
        child.material = new THREE.MeshBasicMaterial({
          map: videoTexture,
        })
      }

      // Your existing textureMap logic
      Object.keys(textureMap).forEach(key => {
        if (child.name.includes(key)) {
          const material = new THREE.MeshBasicMaterial({
            map: loadedTextures.day[key],
          });

          child.material = material;

          if (child.material.map) {
            child.material.map.minFilter = THREE.LinearFilter;
          }
        }
      });
    }
  });

  scene.add(glb.scene);
});




const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 35, sizes.width / sizes.height, 0.1, 1000 );

camera.position.set(-14.355538957599244, 7.587980314427474, -13.852507407565144);

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();
controls.target.set(0.388457517849818, 3.8286788515553223, 0.3272214536010744);

// event listeners
window.addEventListener('resize', ()=> {

  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // updating camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // updating renderer
  renderer.setSize( sizes.width, sizes.height );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

})

// White background
scene.background = new THREE.Color(0xffffff);

// Basic lighting
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7.5);
dirLight.castShadow = true;
scene.add(dirLight);



// function animate() {}

const render = () =>{

  controls.update();

  // console.log(camera.position);
  // console.log("000000000");
  // console.log(controls.target);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );

  window.requestAnimationFrame(render);
};

render()