import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let portfolio = window.portfolio;

let speed = 0;
let max_speed = 20;
let acceleration = 0.5;

let pause = true;
let elapsed = 0;

let max_wobble = 0.02;


function wobble(delta) {
    let wobble_fraction = 10;

    portfolio.car.rotation.z += (((Math.random() - 0.5) * 2) / wobble_fraction) * delta;
    portfolio.car.rotation.x += (((Math.random() - 0.5) * 2) / wobble_fraction) * delta;

    if (portfolio.car.rotation.z > max_wobble) {
        portfolio.car.rotation.z = max_wobble - ((Math.random()) / wobble_fraction) * delta;
    }

    if (portfolio.car.rotation.z < -max_wobble) {
        portfolio.car.rotation.z = -max_wobble + ((Math.random()) / wobble_fraction) * delta;
    }

    if (portfolio.car.rotation.x > max_wobble) {
        portfolio.car.rotation.x = max_wobble + ((Math.random()) / wobble_fraction) * delta;
    }

    if (portfolio.car.rotation.x < -max_wobble) {
        portfolio.car.rotation.x = -max_wobble + ((Math.random()) / wobble_fraction) * delta;
    }


}

function updateCar(delta) {
    portfolio.car.position.z += speed * delta;
    portfolio.camera.position.x = portfolio.car.position.x;
    portfolio.camera.position.y = portfolio.car.position.y + 3;
    portfolio.camera.position.z = portfolio.car.position.z - 10;

    portfolio.controls.target.set(
        portfolio.car.position.x,
        portfolio.car.position.y,
        portfolio.car.position.z + 15

    );

}

function updateTrees() {
    let car_pos_z = portfolio.car.position.z;
    portfolio.tree.forEach(tree => {
        if (tree.position.z < car_pos_z) {
            tree.position.z = car_pos_z + (Math.random() * 50) + 170;

            if (Math.random() < 0.5) {
                tree.position.x = portfolio.car.position.x - 15 - Math.random() * 30;
            } else {
                tree.position.x = portfolio.car.position.x + 15 + Math.random() * 30;
            }
        }
    });
}

function updateRoad() {
    let car_pos_z = portfolio.car.position.z;
    portfolio.road.forEach(road => {
        if (road.position.z < car_pos_z - portfolio.road_segment_length) {
            road.position.z = road.position.z + (portfolio.road_segment_length * portfolio.road_segments);
        }
    });
}

function updateGround() {
    let car_pos_z = portfolio.car.position.z;
    portfolio.ground.forEach(ground => {
        if (ground.position.z < car_pos_z - portfolio.ground_size) {
            ground.position.z = ground.position.z + (portfolio.ground_size * portfolio.ground_segments);
        }
    });
}

function clickEvent() {
    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera(pointer, portfolio.camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(portfolio.scene.children);
    
    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name == "ray" && portfolio.mouseDown) {
            pause = false;
        }
    }
}

portfolio.update = (delta) => {
    elapsed += delta;
    if (!pause && speed <= max_speed) {
        speed += acceleration;
    }
    if(!pause)
        wobble(delta);
    updateCar(delta);

    updateTrees();
    updateRoad();
    updateGround();

}


portfolio.onPointerMove = (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

portfolio.onClick = (event) => {
    clickEvent();
}

window.addEventListener('pointermove', portfolio.onPointerMove);

window.addEventListener('mouseclick', portfolio.onClick);

