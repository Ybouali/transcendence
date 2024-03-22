import * as THREE from 'three';

import { setup, Ball, left_player } from './objects';

export function rander_ball(){
    const circle = new THREE.CircleGeometry(Ball.radius, Ball.segment);
    const material = new THREE.MeshBasicMaterial({color : 0xFF00FF,  side: THREE.DoubleSide});
    const ball = new THREE.Mesh(circle, material);
    ball.position.set(Ball.positionX,Ball.positionY,0);
    setup.scene.add(ball);
    return (ball);
};

export function puddles() {
    const rectangle = new THREE.BoxGeometry(left_player.width, left_player.height);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000FF, side: THREE.DoubleSide });
    const puddle = new THREE.Mesh(rectangle, material);
    puddle.position.set(left_player.positionX, left_player.positionY, 0);
    setup.scene.add(puddle);
    return (puddle)
};