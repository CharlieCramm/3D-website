
import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Sky } from 'three/addons/objects/Sky.js';



var portfolio = {};

portfolio.clock = new THREE.Clock();
const container = document.getElementById('container');

portfolio.stats = new Stats();
container.appendChild(portfolio.stats.dom);

portfolio.renderer = new THREE.WebGLRenderer({ antialias: true });
portfolio.renderer.setPixelRatio(window.devicePixelRatio);
portfolio.renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(portfolio.renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(portfolio.renderer);

portfolio.scene = new THREE.Scene();
portfolio.scene.background = new THREE.Color(0xbfe3dd);
portfolio.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

portfolio.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 400);
portfolio.camera.position.set(0, 3, -3);

portfolio.controls = new OrbitControls(portfolio.camera, portfolio.renderer.domElement);
portfolio.controls.target.set(0, 0, 4);
portfolio.controls.update();
portfolio.controls.enablePan = false;
portfolio.controls.enableDamping = true;

portfolio.scene.fog = new THREE.Fog( 0xcccccc, 30, 150 );


function initSky() {

    // Add Sky
    portfolio.sky = new Sky();
    portfolio.sky.scale.setScalar(450000);
    portfolio.scene.add(portfolio.sky);

    portfolio.sun = new THREE.Vector3();

    /// GUI

    const effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.00,
        mieDirectionalG: 0.7,
        elevation: 4,
        azimuth: 9,
        exposure: 0.01
    };


    const uniforms = portfolio.sky.material.uniforms;
    uniforms['turbidity'].value = effectController.turbidity;
    uniforms['rayleigh'].value = effectController.rayleigh;
    uniforms['mieCoefficient'].value = effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);

    portfolio.sun.setFromSphericalCoords(1, phi, theta);

    uniforms['sunPosition'].value.copy(portfolio.sun);

    portfolio.renderer.toneMappingExposure = effectController.exposure;
    portfolio.renderer.render(portfolio.scene, portfolio.camera);
}

initSky();

portfolio.mouseDown = 0;
window.onmousedown = () => {
  ++portfolio.mouseDown;
}
window.onmouseup = () => {
  --portfolio.mouseDown;
}


window.portfolio = portfolio;

