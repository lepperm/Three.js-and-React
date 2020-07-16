import React, { Component } from "react";
//import ReactDOM from "react-dom";
import * as THREE from "three";

// Attempting to learn and dissect
// https://blog.bitsrc.io/starting-with-react-16-and-three-js-in-5-minutes-3079b8829817
// https://codeburst.io/react-16-three-js-integration-tips-2019-b6afe19c0b83

class App extends Component {
  componentDidMount() {
    // === THREE.JS CODE START ===
    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      10
    );
    camera.position.z = 1;

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    //document.body.appendChild(renderer.domElement);
    // Attaches the renderer to the component instead of to the root dom
    this.mount.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    var material = new THREE.MeshNormalMaterial();
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    var animate = function () {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.001;
      cube.rotation.y -= 0.0005;
      renderer.render(scene, camera);
    };
    animate();
    // === THREE.JS EXAMPLE CODE END ===
  }
  render() {
    return <div ref={(ref) => (this.mount = ref)} />;
  }
}

export default App;
