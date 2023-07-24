import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let portfolio = window.portfolio;

const TREES = 4;
const ROAD_SEGMENT = 15;
const GROUND = 3;
const BOARDS = 8;


let total_assets = 1 + TREES + ROAD_SEGMENT + GROUND + BOARDS;

let loaded = 0;

const loader = new GLTFLoader();
loader.load('models/car.glb', function (gltf) {

    window.portfolio.car = gltf.scene;
    window.portfolio.car.position.set(1, 1, 0);
    window.portfolio.car.scale.set(0.1, 0.1, 0.1);
    //model.rotation.set(0,3.6,0);
    window.portfolio.scene.add(portfolio.car);

    //mixer = new THREE.AnimationMixer(model);
    //mixer.clipAction(gltf.animations[0]).play();
    loaded++;

    start();
}, undefined, function (e) {
    console.error(e);
});


window.portfolio.tree = [];
window.portfolio.road = [];
window.portfolio.ground = [];
window.portfolio.board = [];

function createTree(mesh) {
    window.portfolio.tree.push(mesh);

    let x = 0;
    
    if (Math.random() < 0.5) {
        x = -15 - Math.random() * 30;
    } else {
        x = 15 + Math.random() * 30;
    }
    
    mesh.position.set(x, 0, (Math.random() * 200) + 20);


    mesh.scale.set(20, 20, 20);
    window.portfolio.scene.add(mesh);

    loaded++;

    start();
}

function createRoad(mesh, index) {
    window.portfolio.road.push(mesh);
    mesh.position.set(1, 0, index * portfolio.road_segment_length);
    mesh.scale.set(0.2, 0.1, 0.1);

    mesh.castShadow = true;
	mesh.receiveShadow = true;

    window.portfolio.scene.add(mesh);

    loaded++;

    start();
}


function createBoard(mesh, index) {
    window.portfolio.board.push(mesh);

    mesh.position.set(index % 2 == 0 ? -10 : 10, 0, 60 + index * 60);


    mesh.scale.set(1, 1, index % 2 == 0 ? 1 : -1);

    mesh.castShadow = true;
	mesh.receiveShadow = true;

    window.portfolio.scene.add(mesh);

    loaded++;

    start();
}

function createGround(size, texture, index) {
        const ground = new THREE.Mesh( new THREE.BoxGeometry( size, size, size ), new THREE.MeshBasicMaterial( { color: 0xFFFFFF, map: texture } ) );
        //ground.castShadow = true;
		//ground.receiveShadow = true;
        ground.position.set(0, -50.1, index * size);
        ground.rotation.x = Math.PI;

        window.portfolio.ground.push(ground);



        window.portfolio.scene.add(ground);

        loaded++;
        start();
}



portfolio.textureLoader = new THREE.TextureLoader();

portfolio.textureLoader.load( 'textures/grid.jpg', function ( texture ) {
    let size = 100;
    portfolio.ground_size = 100;
    portfolio.ground_segments = GROUND;


    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 16, 16 );

    for(let i = 0; i < GROUND; i++) {
        createGround(size, texture, i);
    }
} );


loader.load('models/pine_tree.glb', function (gltf) {
    let tree = gltf.scene;

    for(let i = 0; i < TREES; i++) {
        createTree(tree.clone());
    }
   
}, undefined, function (e) {
    console.error(e);
});

for(let i = 0; i < Math.floor(BOARDS/2); i++) {
    loader.load('models/boards/bill' + i + '.glb', function (gltf) {
        let board = gltf.scene;

        createBoard(board.clone(), i*2);
        createBoard(board.clone(), i*2 + 1);

    
    }, undefined, function (e) {
        console.error(e);
    });
}

loader.load('models/road.glb', function (gltf) {
    let road = gltf.scene;
    portfolio.road_segment_length = 10;
    portfolio.road_segments = ROAD_SEGMENT;

    for(let i = 0; i < ROAD_SEGMENT; i++) {
        createRoad(road.clone(), i);
    }
   
}, undefined, function (e) {
    console.error(e);
});


function start() {
    if(loaded >= total_assets) {
        animate();
    }
}


function loadFont() {

    const loader = new FontLoader();
    loader.load( 'fonts/droidface_regular.json', function ( response ) {

        portfolio.font = response;
        createText(response);

    } );

}

function createText(font) {
    let textGeo = new TextGeometry( "Start", {

        font: portfolio.font,

        size: 3,
        height: 1.5,
        curveSegments: 4,

        bevelThickness: 0.5,
        bevelSize: 0.3,
        bevelEnabled: false

    } );

    textGeo.computeBoundingBox();

    const centerOffset = 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    const centerOffsetY = 0.5 * ( textGeo.boundingBox.max.y - textGeo.boundingBox.min.y );

    let materials = [
        new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
        new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
    ];

    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent: true} ); 


    let textMesh1 = new THREE.Mesh( textGeo, materials );

    textMesh1.position.x = centerOffset + 1;
    textMesh1.position.y = 5;
    textMesh1.position.z = 20;

    textMesh1.rotation.y = Math.PI;

    portfolio.text = textMesh1;
    window.portfolio.scene.add(textMesh1);

    const geometry = new THREE.BoxGeometry( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x, textGeo.boundingBox.max.y - textGeo.boundingBox.min.y, textGeo.boundingBox.max.z - textGeo.boundingBox.min.z ); 
    const cube = new THREE.Mesh( geometry, material );

    cube.name = "ray";

    cube.position.x = textMesh1.position.x - centerOffset;
    cube.position.y = textMesh1.position.y + centerOffsetY;
    cube.position.z = textMesh1.position.z;

    cube.rotation.x = textMesh1.rotation.x;
    cube.rotation.y = textMesh1.rotation.y;
    cube.rotation.z = textMesh1.rotation.z;
    cube.transparent = true;

    window.portfolio.scene.add(cube);


}

loadFont();

window.onresize = function () {

    portfolio.camera.aspect = window.innerWidth / window.innerHeight;
    portfolio.camera.updateProjectionMatrix();

    portfolio.renderer.setSize(window.innerWidth, window.innerHeight);

};

function animate() {

    requestAnimationFrame(animate);

    const delta = portfolio.clock.getDelta();

    //mixer.update(delta);

    portfolio.controls.update();

    portfolio.stats.update();

    if (portfolio.update)
        portfolio.update(delta);

    portfolio.renderer.render(portfolio.scene, portfolio.camera);

}
