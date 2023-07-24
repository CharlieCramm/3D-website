
import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const clock = new THREE.Clock();
const container = document.getElementById('container');

const stats = new Stats();
container.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfe3dd);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(0, 3, -3);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 4);
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

let model = undefined;

const loader = new GLTFLoader();
loader.load('models/car.glb', function (gltf) {

    model = gltf.scene;
    model.position.set(1, 1, 0);
    model.scale.set(0.1, 0.1, 0.1);
    //model.rotation.set(0,3.6,0);
    scene.add(model);

    //mixer = new THREE.AnimationMixer(model);
    //mixer.clipAction(gltf.animations[0]).play();

    animate();

}, undefined, function (e) {

    console.error(e);

});


window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

};

function move() {
    let speed = 0.01;

    //model.position.z += speed;
}

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    //mixer.update(delta);

    controls.update();

    stats.update();

    move();

    renderer.render(scene, camera);

}
