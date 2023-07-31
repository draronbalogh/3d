import React, { Component, createRef } from 'react';
import axios from 'axios';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { HOST3D, _CONFIG } from '../../../_config/config-general';
import { recordConfig } from '../../../_config/config-records';
import { logAxiosError } from '../../../assets/gen-methods';
import * as BABYLON from '@babylonjs/core';
import { Engine, Scene } from '@babylonjs/core';
//import * as BABYLONLoaders from '@babylonjs/loaders';
//import 'babylonjs-loaders';

interface CompProps {
  data: any;
}
enum LoaderType {
  ThreeJS,
  BabylonJS
}
interface CompState {
  recordId: number | any;
  data: any;
  imageBlobs: Blob[];
  videoBlobs: Blob[];
  modelBlobs: Blob[];
  materialUrlBlobs: Blob[];
  scenes: THREE.Scene[];
  renderers: THREE.WebGLRenderer[];
  cameras: THREE.PerspectiveCamera[];
  controls: OrbitControls[];
}

export class ViewRecord extends Component<CompProps, CompState> {
  sceneContainerRef = createRef<HTMLDivElement>();
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
    };
  }

  componentDidMount() {
    const { data } = this.state;
    if (data.length >= 1) {
      this.findDataById();
    }
    if (!data.length) {
      this.fetchModelDataById();
    }
  }

  componentWillUnmount() {
    const { renderers, cameras, scenes, controls } = this.state;
    this.animationIds.forEach((id) => {
      if (id !== null) {
        cancelAnimationFrame(id);
      }
    });
    window.removeEventListener('resize', this.handleWindowResize);
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
        if (controls[i]) controls[i].dispose();
      }
    }
  }

  findDataById = () => {
    const { data, recordId } = this.state;
    const obj = data.find((o: { recordId: any }) => o.recordId === recordId);
    this.setState({ data: obj }, () => {
      console.log('most töltöm be');
      this.loadAll();
    });
  };

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

  printModelDesc = () => {
    const { data } = this.state;
    return data
      ? Object.keys(data)?.map((elm: any, i: number) => {
          return <td key={i}>{typeof data[elm] !== 'object' ? data[elm] : ''}</td>;
        })
      : null;
  };

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
            console.log(`Loading ${assetType}: ${assetName}...`);
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
      this.setState({ imageBlobs, videoBlobs, materialUrlBlobs, modelBlobs }, () => {
        console.log('Assets loaded successfully!'); // Kiírás, hogy az assetek betöltődtek
        this.loadScene();
      });
    }
  };
  loadModel = async (url: string, loaderType: LoaderType) => {
    if (loaderType === LoaderType.ThreeJS) {
      // Use the three.js loader
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/draco/');
      loader.setDRACOLoader(dracoLoader);
      return new Promise<any>((resolve, reject) => {
        loader.load(url, (gltf: any) => resolve(gltf), undefined, reject);
      });
    } else if (loaderType === LoaderType.BabylonJS) {
      // Use the babylon.js loader
      const canvas = document.createElement('canvas'); // Create a new canvas element
      const engine = new BABYLON.Engine(canvas, true); // Create a new Babylon.js engine
      const scene = new BABYLON.Scene(engine); // Create a new Babylon.js scene
      const meshes = await BABYLON.SceneLoader.ImportMeshAsync('', '', url, scene);
      return { engine, scene, meshes };
    }
  };
  loadScene = () => {
    // const dracoLoader = new DRACOLoader();
    //  const loader = new GLTFLoader();
    const { modelBlobs } = this.state;
    const scenes: THREE.Scene[] = [];
    const renderers: THREE.WebGLRenderer[] = [];
    const cameras: THREE.PerspectiveCamera[] = [];
    if (!modelBlobs) return;
    // dracoLoader.setDecoderPath('/draco/');
    //  loader.setDRACOLoader(dracoLoader);
    modelBlobs.forEach((blob, index) => {
      const objectUrl = URL.createObjectURL(blob);
      let mixer: THREE.AnimationMixer;
      console.log('objectUrl', objectUrl);
      this.loadModel(objectUrl, LoaderType.BabylonJS /* loaderType *LoaderType.ThreeJS*/).then(
        (result) => {
          if (LoaderType.BabylonJS) {
            const { engine, scene, meshes } = result as { engine: BABYLON.Engine; scene: BABYLON.Scene; meshes: BABYLON.AbstractMesh[] };
            engine.runRenderLoop(() => {
              scene.render();
            });
            // Add canvas to container
            const canvas = engine.getRenderingCanvas();
            if (canvas && this.sceneContainerRef.current) {
              this.sceneContainerRef.current.appendChild(canvas);
            }
          } else if (LoaderType.ThreeJS) {
            const gltf = result as any;

            const scene = new THREE.Scene();
            scenes.push(scene);
            scene.background = new THREE.Color(0x333333);

            const ambientLight = new THREE.AmbientLight(0x404040);
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(1, 1, 1).normalize();
            scene.add(directionalLight);

            let mixer: THREE.AnimationMixer;
            scene.add(gltf.scene);

            // Check if animations exist before trying to play them
            if (gltf.animations && gltf.animations.length > 0) {
              mixer = new THREE.AnimationMixer(gltf.scene);
              let action = mixer.clipAction(gltf.animations[0]);
              action?.play();
            }

            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderers.push(renderer);

            const aspectRatio = 1280 / 720;
            const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

            const clock = new THREE.Clock();
            cameras.push(camera);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.enableZoom = true;

            const box = new THREE.Box3().setFromObject(gltf.scene);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            // Set the camera to look at the center of the model
            camera.lookAt(center);

            // Set the camera position based on the size of the model
            camera.position.z = size.length() / 2; // You can adjust the multiplier as needed

            //camera.position.z = 150;
            renderer.setSize(1280, 720);

            const animateInLoadScene = () => {
              // Check if mixer exists before trying to update ita
              if (mixer) {
                const delta = clock.getDelta();
                mixer.update(delta);
              }
              const id = requestAnimationFrame(animateInLoadScene);
              let updatedAnimationIds = [...this.animationIds];
              updatedAnimationIds[index] = id;
              this.animationIds = updatedAnimationIds;
              controls.update();
              if (renderers[index] !== null && renderers[index] !== undefined) renderers[index].render(scenes[index], cameras[index]);
            };

            let animationIds: (number | null)[] = new Array(modelBlobs.length).fill(null);
            animateInLoadScene();
            this.setState({ renderers, cameras, scenes }, () => {
              window.addEventListener('resize', this.handleWindowResize);
            });
          }
        },
        (progressEvent) => {
          const progress = progressEvent.loaded / progressEvent.total;
          console.log(`Model load progress (${index + 1}/${modelBlobs.length}):`, progress);
        }
        /*   (progress) => {
    console.log('Model load progress:', progress, progress.loaded, progress.total);
  },*/
      );
    });
  };

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
          this.animationIds = updatedAnimationIds;
          renderers[index].render(scenes[index], cameras[index]);
        };

        animateInRenderScene();
      });
    }
  };

  renderImages = () => {
    const { imageBlobs } = this.state;
    return imageBlobs?.map((blob, index) => (
      <div key={index}>
        <img src={URL.createObjectURL(blob)} alt='Kép' />
      </div>
    ));
  };

  renderVideos = () => {
    const { videoBlobs } = this.state;

    return videoBlobs?.map((blob, index) => (
      <div key={index}>
        <video src={URL.createObjectURL(blob)} controls />
      </div>
    ));
  };

  renderModels3D = () => {
    const { scenes } = this.state;
    if (!scenes) {
      return null;
    }
    return (
      <div key='3d-container' ref={this.sceneContainerRef} id='3d-container'>
        <>{this.renderScenes()}</>
      </div>
    );
  };

  renderMaterialURLs = () => {
    const { materialUrlBlobs } = this.state;
    return materialUrlBlobs?.map((blob, index) => (
      <div key={index}>
        <img src={URL.createObjectURL(blob)} alt='Material URL' />
      </div>
    ));
  };

  render() {
    const { recordId, data } = this.state;

    return (
      <>
        <div>3d component ({recordId})</div>
        <br />
        <div>{this.getTitle()}</div>
        <br />
        <div>
          {this.printModelDesc()}
          {[
            // this.renderImages(),
            // this.renderVideos(),
            // this.renderMaterialURLs()]}
            this.renderModels3D()
          ]}
        </div>
      </>
    );
  }
}
