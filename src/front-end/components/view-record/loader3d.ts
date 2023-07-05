//////////////////////////////////////////////////////////////////////////////////////   IMPORT
///////////////////////////////////////////////////////////   REACT
import React from 'react';
///////////////////////////////////////////////////////////   CONFIG
import { HOST3D, _CONFIG } from '../../../_config/config-general';
import { recordConfig } from '../../../_config/config-records';
///////////////////////////////////////////////////////////   LIBS
import axios from 'axios';
import { logAxiosError } from '../../../assets/gen-methods';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export async function loadScene(
  modelBlob: Blob,
  handleProgress: (progress: number) => void,
  handleRender: (renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, scene: THREE.Scene) => void,
  handleAnimation: (animate: () => void) => void
): Promise<{
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  animate: () => void;
}> {
  const dracoLoader = new DRACOLoader();
  const loader = new GLTFLoader();
  const objectUrl = URL.createObjectURL(modelBlob);
  let mixer: THREE.AnimationMixer;

  dracoLoader.setDecoderPath('/draco/');
  loader.setDRACOLoader(dracoLoader);

  const gltf = await new Promise<any>((resolve, reject) => loader.load(objectUrl, resolve, (progress) => handleProgress(progress.loaded / progress.total), reject));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333333);
  // Adding lights
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);
  // Animation
  mixer = new THREE.AnimationMixer(gltf.scene);
  let action = mixer.clipAction(gltf.animations[0]);
  action.play();
  scene.add(gltf.scene);

  const renderer = new THREE.WebGLRenderer({ antialias: true });

  const aspectRatio = 1280 / 720; // hardcoded aspect ratio
  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

  const clock = new THREE.Clock();

  // Adding orbit control
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;

  camera.position.z = 150;
  renderer.setSize(1280, 720); // hardcoded size

  const animate = () => {
    const delta = clock.getDelta();
    mixer.update(delta);
    controls.update();
    renderer.render(scene, camera);
  };

  handleRender(renderer, camera, scene);
  handleAnimation(animate);

  return { renderer, camera, scene, animate };
}
