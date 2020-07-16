import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "./App.css";

// Attempting to learn and dissect
// https://blog.bitsrc.io/starting-with-react-16-and-three-js-in-5-minutes-3079b8829817
// https://codeburst.io/react-16-three-js-integration-tips-2019-b6afe19c0b83

const style = {
  height: 500, // we can control scene size by setting container dimensions
};

class App extends Component {
  componentDidMount() {
    this.sceneSetup();
    this.addCustomSceneObjects();
    this.startAnimationLoop();
    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    // Cancels the next scheduled requestAnimationFrame() call
    window.cancelAnimationFrame(this.requestID);
    this.controls.dispose();
  }

  // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
  sceneSetup = () => {
    // get container dimensions and use for scene sizing
    // this.el is a way of limiting scope to the element referenced by "this"
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      70, // fov = field of view
      width / height, // aspect ratio
      0.1, // near plane
      10 // far plane
    );

    // Our object is at z=0, so pull the camera back
    this.camera.position.z = 1;

    // OrbitControls allow a camera to orbit around the object
    // https://threejs.org/docs/#examples/controls/OrbitControls
    this.controls = new OrbitControls(this.camera, this.mount);
    //this.controls.minZoom = 0.5;
    this.controls.minDistance = 0.4;
    this.controls.minPolarAngle = 0;
    this.controls.maxPolarAngle = Math.PI / 2; // above "ground"

    // Update needs to be called after any manual changes to the camera's transform
    //this.controls.update();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    this.renderer.setSize(width, height);

    // Attaches the renderer to the component instead of to the root dom
    this.mount.appendChild(this.renderer.domElement);
  };

  // https://threejs.org/docs/#api/en/geometries/
  addCustomSceneObjects = () => {
    // Cube object
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const cubeMaterial = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: false,
    });
    this.cube = new THREE.Mesh(geometry, cubeMaterial);
    this.cube.castShadow = true;
    this.scene.add(this.cube);

    // Ground plane
    const ground = new THREE.BoxGeometry(100, 0.01, 100); //new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: 0xcdcfd0,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: false,
    });
    this.plane = new THREE.Mesh(ground, groundMaterial).translateY(-0.25);
    this.plane.receiveShadow = true;
    this.scene.add(this.plane);

    // Lighting
    const lights = [];
    lights[0] = new THREE.DirectionalLight(0xffffff, 1);
    lights[1] = new THREE.DirectionalLight(0xffffff, 1);

    lights[0].position.set(2, 1, 3);
    lights[1].position.set(-2, 3, 1);

    lights[0].castShadow = true;
    lights[1].castShadow = true;

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
  };

  startAnimationLoop = () => {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.0075;

    this.renderer.render(this.scene, this.camera);

    // By using requestAnimationFrame, the animation pauses when the user navigates to another browser tab, conserving resources
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  handleWindowResize = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;

    // Note that after making changes to most of camera properties you have to call
    // .updateProjectionMatrix for the changes to take effect.
    this.camera.updateProjectionMatrix();
  };

  render() {
    return <div style={style} ref={(ref) => (this.mount = ref)} />;
  }
}

class Container extends React.Component {
  state = { isMounted: true };

  render() {
    const { isMounted = true } = this.state;
    return (
      <>
        <button
          onClick={() =>
            this.setState((state) => ({ isMounted: !state.isMounted }))
          }
        >
          {isMounted ? "Unmount" : "Mount"}
        </button>
        {isMounted && <App />}
        {isMounted && <div>Scroll to zoom, drag to rotate</div>}
      </>
    );
  }
}

export default Container;
