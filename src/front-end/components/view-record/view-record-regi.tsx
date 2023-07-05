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

///////////////////////////////////////////////////////////   INTERFACE
interface CompProps {
  data: any;
}
interface CompState {
  data: any;
  recordId: number | any;
  imageBlob?: Blob;
  imageBlobs?: Blob[];
  videoBlobs?: Blob[];
  modelBlobs?: Blob[];
  materialUrlBlobs?: Blob[];
  scenes: THREE.Scene[] | null;
  renderers?: THREE.WebGLRenderer[];
  cameras?: THREE.PerspectiveCamera[] | null;
  controls: OrbitControls[];
  // animationIds: (number | null)[];
}
//////////////////////////////////////////////////////////////////////////////////////    CLASS SETUP
export class ViewRecord extends React.Component<CompProps, CompState> {
  sceneContainerRef = React.createRef<HTMLDivElement>();
  animationIds: (number | null)[] = [];
  constructor(props: CompProps) {
    super(props);
    this.state = {
      recordId: Number(window.location.pathname.split('/').pop()),
      data: this.props.data,
      imageBlobs: [],
      videoBlobs: [],
      modelBlobs: [],
      materialUrlBlobs: [],
      renderers: [],
      cameras: [],
      scenes: [],
      controls: []
      //   animationIds: []
    };
  }

  ///////////////////////////////////////////////////////////   LIFECYCLE METHODS
  componentDidMount() {
    const { data } = this.state;
    if (data.length >= 1) this.findDataById();
    if (!data.length) {
      this.fetchModelDataById();
    }
  }
  componentWillUnmount() {
    const { renderers, cameras, scenes, controls } = this.state;

    // const { animationIds } = this.state;
    this.animationIds.forEach((id) => {
      if (id !== null) {
        cancelAnimationFrame(id);
      }
    });
    window.removeEventListener('resize', this.handleWindowResize);
    // Dispose WebGL context
    if (renderers && cameras && scenes && controls) {
      for (let i = 0; i < renderers.length; i++) {
        scenes[i].traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (object.material instanceof THREE.Material) {
              object.material.dispose();
            } else if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            }
          }
        });
        if (renderers[i]) renderers[i].dispose();
        //if (cameras[i]) cameras[i] = null;
        //if (scenes[i]) scenes[i] = null;
        if (controls[i]) controls[i].dispose();
      }
    }
  }
  ///////////////////////////////////////////////////////////   CLASS METHODS
  /**
   * Find data by recordId
   */
  findDataById = () => {
    const { data, recordId } = this.state;
    const obj = data.find((o: { recordId: any }) => o.recordId === recordId);
    this.setState({ data: obj }, () => {
      console.log('most töltöm be');
      this.loadAll();
    });
  };

  /**
   * Fetch data by recordId
   */
  fetchModelDataById = async () => {
    try {
      const { recordId } = this.state;
      const response = await axios.get(_CONFIG.url.recordApi + recordId);
      this.setState({ data: response.data }, () => {
        console.log('most töltöm be');
        this.loadAll();
      });
    } catch (e: any) {
      logAxiosError(e, _CONFIG.msg.error.fetch.getData);
    }
  };

  ///////////////////////////////////////////////////////////   RENDER METHODS
  /**
   * Print model description
   * @returns data or null
   */
  printModelDesc = () => {
    const { data } = this.state;
    return data
      ? Object.keys(data)?.map((elm: any, i: number) => {
          return <td key={i}>{typeof data[elm] !== 'object' ? data[elm] : ''}</td>;
        })
      : null;
  };

  /**
   * Get title
   * @returns label list of table cells
   */
  getTitle = () => {
    return Object.entries(recordConfig).map(([key, value]) => {
      return <td key={key}>{value.label}</td>;
    });
  };

  loadAssets = async (assetNamesString: string, assetType: 'imageBlobs' | 'videoBlobs' | 'materialUrlBlobs' | 'modelBlobs') => {
    if (assetNamesString) {
      let assetNames = assetNamesString.split(',');
      let assetBlobs: Blob[] = [];
      for (let assetName of assetNames) {
        assetName = assetName.trim();
        if (assetName) {
          try {
            const response = await axios.get(`${HOST3D}/uploads/${this.state.data.recordUuid}/${assetName}`, { responseType: 'blob' });
            const assetBlob = new Blob([response.data], { type: response.headers['content-type'] });
            assetBlobs.push(assetBlob);
          } catch (error) {
            logAxiosError(error, `Error loading ${assetType}: ${assetName}`);
          }
        }
      }
      return assetBlobs;
    }
    return [];
  };
  loadAll = async () => {
    const { data } = this.state;
    if (data) {
      const imageBlobs = await this.loadAssets(data.recordImgs, 'imageBlobs');
      const videoBlobs = await this.loadAssets(data.recordVideos, 'videoBlobs');
      const materialUrlBlobs = await this.loadAssets(data.recordMaterialUrl, 'materialUrlBlobs');
      const modelBlobs = await this.loadAssets(data.recordModels3d, 'modelBlobs');
      this.setState({ imageBlobs, videoBlobs, materialUrlBlobs, modelBlobs }, this.loadScene);
    }
  };
  // Load scene
  loadScene = () => {
    const dracoLoader = new DRACOLoader();
    const loader = new GLTFLoader();
    const { modelBlobs } = this.state;
    const scenes: THREE.Scene[] = [];
    const renderers: THREE.WebGLRenderer[] = [];
    const cameras: THREE.PerspectiveCamera[] = [];
    if (!modelBlobs) return;
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);
    modelBlobs.forEach((blob, index) => {
      const objectUrl = URL.createObjectURL(blob);
      let mixer: THREE.AnimationMixer;
      loader.load(
        objectUrl,
        (gltf) => {
          const scene = new THREE.Scene();
          scenes.push(scene);
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
          renderers.push(renderer);

          // const aspectRatio = window.innerWidth / window.innerHeight;
          const aspectRatio = 1280 / 720;
          const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

          const clock = new THREE.Clock();
          cameras.push(camera);

          // Adding orbit control
          const controls = new OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.dampingFactor = 0.25;
          controls.enableZoom = true;

          camera.position.z = 150;
          // renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setSize(1280, 720);

          const animateInLoadScene = () => {
            const delta = clock.getDelta();
            mixer.update(delta);
            const id = requestAnimationFrame(animateInLoadScene);
            let updatedAnimationIds = [...this.animationIds];
            updatedAnimationIds[index] = id;
            //this.setState({ animationIds: updatedAnimationIds });
            this.animationIds = updatedAnimationIds;
            controls.update();
            if (renderers[index] !== null && renderers[index] !== undefined) renderers[index].render(scenes[index], cameras[index]);
          };

          // kezdeti állapotban null-t adunk az animationIds-hez
          let animationIds: (number | null)[] = new Array(modelBlobs.length).fill(null);
          animateInLoadScene();
          this.setState({ renderers, cameras, scenes }, () => {
            window.addEventListener('resize', this.handleWindowResize);
          });
        },

        (progress) => {
          // A betöltés folyamatban van
          console.log('Model load progress:', progress.loaded / progress.total);
        },
        (error) => {
          // Hiba történt
          console.error('An error occurred while loading the model:', error);
        }
      );
    });
  };
  // Method to handle window resize
  handleWindowResize = () => {
    const { cameras, renderers } = this.state;
    const container = this.sceneContainerRef.current;
    if (container && cameras && renderers) {
      for (let i = 0; i < cameras.length; i++) {
        cameras[i].aspect = container.offsetWidth / container.offsetHeight;
        cameras[i].updateProjectionMatrix();
        renderers[i].setSize(container.offsetWidth, container.offsetHeight);
      }
    }
  };
  // Update scene rendering method
  renderScenes = () => {
    const { renderers, scenes, cameras } = this.state;
    const container = this.sceneContainerRef.current;

    if (container && scenes && renderers && cameras) {
      scenes.forEach((scene, index) => {
        if (container.childNodes[index]) {
          container.removeChild(container.childNodes[index]);
        }

        const renderer = renderers[index];
        const canvas = renderer.domElement;

        container.appendChild(canvas);

        const animateInRenderScene = () => {
          const id = requestAnimationFrame(animateInRenderScene);
          let updatedAnimationIds = [...this.animationIds];
          updatedAnimationIds[index] = id;
          // this.setState({ animationIds: updatedAnimationIds });
          this.animationIds = updatedAnimationIds;
          renderers[index].render(scenes[index], cameras[index]);
        };

        animateInRenderScene();
      });
    }
  };

  renderImages() {
    const { imageBlobs } = this.state;
    return imageBlobs?.map((blob, index) => (
      <div key={index}>
        <img src={URL.createObjectURL(blob)} alt='Kép' />
      </div>
    ));
  }

  renderVideos() {
    const { videoBlobs } = this.state;

    return videoBlobs?.map((blob, index) => (
      <div key={index}>
        <video src={URL.createObjectURL(blob)} controls />
      </div>
    ));
  }

  renderModels3D() {
    const { scenes } = this.state;
    if (!scenes) {
      return null;
    }
    return (
      <div key='3d-container' ref={this.sceneContainerRef} id='3d-container'>
        <>
          {this.renderScenes()} {/* Wrap in a fragment */}
        </>
      </div>
    );
  }
  renderMaterialURLs() {
    const { materialUrlBlobs } = this.state;
    return materialUrlBlobs?.map((blob, index) => (
      <div key={index}>
        <img src={URL.createObjectURL(blob)} alt='Material URL' />
      </div>
    ));
  }
  //////////////////////////////////////////////////////////////////////////////////////    RENDER
  render() {
    const { recordId, data, imageBlobs } = this.state;

    // console.log('data', data);
    return (
      <>
        <div>3d component ({recordId})</div>
        <br />
        <div>{this.getTitle()}</div>
        <br />
        <div>
          {this.printModelDesc()}
          {[
            // Ezt a sor hozzáadtuk
            this.renderImages(),
            this.renderVideos(),
            this.renderModels3D(),
            this.renderMaterialURLs()
          ]}
        </div>
      </>
    );
  }
}
