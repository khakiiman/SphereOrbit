import './index.css';
import WebGL from 'three/addons/capabilities/WebGL.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

if (WebGL.isWebGLAvailable()) {
  // scene
  const scene = new THREE.Scene();

  // shape
  const geometry = new THREE.SphereGeometry(3, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    color: '#f1830c',
    roughness: 0.5,
  });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  //sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // light
  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(0, 10, 10);
  light.intensity = 2;
  scene.add(light);

  // camera
  const camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.z = 20;
  scene.add(camera);

  // renderer
  const canvas = document.querySelector('.webgl');
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(2);
  renderer.render(scene, camera);

  // controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 5;

  // Resize
  window.addEventListener('resize', () => {
    // update the sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerWidth;
    // update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
  });

  const loop = () => {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
  };
  loop();

  // Timeline magic!
  const t1 = gsap.timeline({ defaults: { duration: 0.8 } });
  t1.fromTo(sphere.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
  t1.fromTo('nav', { y: '-100%' }, { y: '0%' });
  t1.fromTo('.title', { x: '-700%' }, { x: '0%' });
  t1.fromTo('.footer', { x: '-700%' }, { x: '0%' });

  // Mouse animation color
  let mouseDwon = false;
  let rgb = [];
  window.addEventListener('mousedown', () => (mouseDwon = true));
  window.addEventListener('mouseup', () => (mouseDwon = false));
  window.addEventListener('mousemove', (e) => {
    if (mouseDwon) {
      rgb = [
        Math.round((e.pageX / sizes.width) * 255),
        Math.round((e.pageY / sizes.width) * 255),
        150,
      ];
      // let's animate
      let newColor = new THREE.Color(`rgb(${rgb.join(',')})`);
      gsap.to(sphere.material.color, {
        r: newColor.r,
        g: newColor.g,
        b: newColor.b,
      });
    }
  });
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById('container').appendChild(warning);
}
