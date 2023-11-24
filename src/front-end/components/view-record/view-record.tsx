import React, { Component, createRef } from 'react';
import axios from 'axios';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { HOST3D, PORT3D, _CONFIG } from '../../../_config/config-general';
import { recordConfig } from '../../../_config/config-records';
import { logAxiosError } from '../../../assets/gen-methods';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import { Engine, Scene } from '@babylonjs/core';

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
  modelUrls: any;
  materialUrlBlobs: Blob[];
  scenes: THREE.Scene[];
  renderers: THREE.WebGLRenderer[];
  cameras: THREE.PerspectiveCamera[];
  controls: OrbitControls[];
  numberOfObjects: number;
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
      modelUrls: [],
      materialUrlBlobs: [],
      renderers: [],
      cameras: [],
      scenes: [],
      controls: [],
      numberOfObjects: 1
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
      return <td key={key}>{value?.label}</td>;
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
      const modelUrls = data.recordModels3d?.split(',');
      this.setState({ imageBlobs, videoBlobs, materialUrlBlobs, modelBlobs, modelUrls }, () => {
        console.log('Assets loaded successfully!'); // Kiírás, hogy az assetek betöltődtek
        this.loadScene();
      });
    }
  };

  loadModel = async (url: string, modelUrls: string, index: number, loaderType: LoaderType) => {
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
      return new Promise<any>((resolve, reject) => {
        console.log('modelUrls', modelUrls[index]);
        const container = this.sceneContainerRef.current;
        let canvas = container?.childNodes[0] as HTMLCanvasElement;
        if (!canvas) {
          canvas = document.createElement('canvas');
          container?.appendChild(canvas);
        }
        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);
        let linkx = `${HOST3D}:${PORT3D}/uploads/${this.state.data.recordUuid}/${modelUrls[index]}`;
        BABYLON.SceneLoader.ImportMeshAsync(null, '', linkx, scene)
          .then((result) => {
            const { meshes } = result;

            scene.registerBeforeRender(function () {
              meshes.forEach((mesh) => {
                mesh.rotation.x += 0.01;
                mesh.rotation.y += 0.01;
              });
            });

            resolve({ engine, scene, canvas, meshes });
          })
          .catch((error) => {
            console.error(error);
            reject(error);
          });
      });
    }
  };
  handleBabylonJS = async (result: any) => {
    const { engine, scene, canvas, meshes } = result as { engine: BABYLON.Engine; scene: BABYLON.Scene; canvas: any; meshes: any };
    const { numberOfObjects } = this.state;

    // Set canvas size
    engine.setSize(window.innerWidth, window.innerHeight);

    // Set camera
    const camera = new BABYLON.ArcRotateCamera('camera1', 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);

    let clones: BABYLON.Mesh[] = [];
    let minPoint = new BABYLON.Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    let maxPoint = new BABYLON.Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    let boundingBoxes: any = [];
    const originalMeshes = meshes.slice(); // Copy the original meshes

    meshes.forEach((mesh: BABYLON.Mesh, index: number) => {
      // Create clones of each mesh and position them
      for (let i = 1; i <= numberOfObjects; i++) {
        const boundingInfo = mesh.getBoundingInfo();
        const wi = boundingInfo.maximum.x - boundingInfo.minimum.x;
        const he = boundingInfo.maximum.y - boundingInfo.minimum.y;
        const ze = boundingInfo.maximum.z - boundingInfo.minimum.z;
        const clone = mesh.clone(`clone${index}-${i}`);
        //
        if (mesh.material && mesh.material instanceof BABYLON.StandardMaterial) {
          const originalMaterial = mesh.material as BABYLON.StandardMaterial;
          const clonedMaterial = originalMaterial.clone(`clonedMat${index}-${i}`);
          if (originalMaterial.diffuseTexture) {
            clonedMaterial.diffuseTexture = originalMaterial.diffuseTexture.clone();
          }
          clone.material = clonedMaterial;
        }

        // Position the clone at a random position
        let x: number, y: number, z: number;
        let overlaps;
        do {
          var min = 20;
          var max = 500;

          x = Math.random() * (max - min) + min * 10 * (numberOfObjects / 100); // random x
          y = Math.random() * (max - min) + min; // random y
          z = Math.random() * (max - min) + max; // random z

          // Check if the new position overlaps with any existing bounding boxes
          overlaps = boundingBoxes.some((box: BABYLON.BoundingBox) => box.intersectsPoint(new BABYLON.Vector3(x, y, z)));
        } while (overlaps);

        clone.position.addInPlace(new BABYLON.Vector3(x, y, z));
        clone.computeWorldMatrix(true);
        // Add the clone's bounding box to the list
        boundingBoxes.push(clone.getBoundingInfo().boundingBox);

        // Add the clone to the list
        clones.push(clone);

        // Calculate the bounds of the scene
        minPoint = BABYLON.Vector3.Minimize(minPoint, clone.getBoundingInfo().boundingBox.minimumWorld);
        maxPoint = BABYLON.Vector3.Maximize(maxPoint, clone.getBoundingInfo().boundingBox.maximumWorld);
      }
    });
    console.log('clones', clones);
    // Calculate the center of the clones
    let cloneCenter = new BABYLON.Vector3();
    console.log('cloneCenter', cloneCenter);
    clones.forEach((clone: BABYLON.Mesh) => {
      cloneCenter.addInPlace(clone.position);
    });
    cloneCenter = cloneCenter.scale(1 / clones.length);
    originalMeshes.forEach((mesh: BABYLON.Mesh) => mesh.dispose());
    // Calculate the size of the scene
    let sceneSize = BABYLON.Vector3.Distance(minPoint, maxPoint);

    // Set the camera to a consistent distance from the center of the scene
    camera.target = cloneCenter;
    camera.setPosition(cloneCenter.add(new BABYLON.Vector3(0, 0, sceneSize)));

    camera.attachControl(canvas, true);
    // Adjust the camera settings based on the size of the scene
    camera.lowerRadiusLimit = sceneSize * 0.5; // minimum zoom distance
    camera.upperRadiusLimit = sceneSize * 10; // maximum zoom distance
    camera.wheelPrecision = 50 / sceneSize; // zoom sensitivity
    camera.inertia = 0.5; // damping, the smaller the faster

    // Create Lights
    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.5;
    light.diffuse = BABYLON.Color3.FromHexString('#404040');

    const directionalLight = new BABYLON.DirectionalLight('DirectionalLight', new BABYLON.Vector3(0, -1, 0), scene);
    directionalLight.diffuse = BABYLON.Color3.FromHexString('#ffffff');
    directionalLight.intensity = 0.5;

    // Loop animation
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Canvas resiser
    window.addEventListener('resize', () => {
      engine.setSize(window.innerWidth, window.innerHeight);
      engine.resize();

      camera.setPosition(cloneCenter.add(new BABYLON.Vector3(0, 0, sceneSize)));
      camera.target = cloneCenter;
    });
  };

  handleThreeJS = async (result: any, index: number, modelBlobs: Blob[], renderers: THREE.WebGLRenderer[], cameras: THREE.PerspectiveCamera[], scenes: THREE.Scene[]) => {
    const gltf = result as any;

    // Set scence
    const scene = new THREE.Scene();
    scene.add(gltf.scene);
    scenes.push(scene);
    scene.background = new THREE.Color(0x333333);

    // Set lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Check if animations exist before trying to play them
    let mixer: THREE.AnimationMixer;
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(gltf.scene);
      let action = mixer.clipAction(gltf.animations[0]);
      action?.play();
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderers.push(renderer);

    // Set camera
    const aspectRatio = 1280 / 720;
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    const clock = new THREE.Clock();
    cameras.push(camera);

    // Set controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Add new object
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Focus camera on trg
    camera.lookAt(center);
    camera.position.z = size.length() / 2;
    renderer.setSize(1280, 720);

    const animateInLoadScene = () => {
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
  };

  loadScene = async () => {
    const { modelBlobs, modelUrls } = this.state;
    const scenes: THREE.Scene[] = [];
    const renderers: THREE.WebGLRenderer[] = [];
    const cameras: THREE.PerspectiveCamera[] = [];
    if (!modelBlobs) return;
    modelBlobs.forEach((blob, index) => {
      const blobUrl = URL.createObjectURL(blob);
      let lType = LoaderType.BabylonJS; /* loaderType *LoaderType.ThreeJS*/
      this.loadModel(blobUrl, modelUrls, index, lType).then(
        (result) => {
          console.log('result', result);
          if (lType === LoaderType.BabylonJS) {
            this.handleBabylonJS(result);
          } else if (lType === LoaderType.ThreeJS) {
            this.handleThreeJS(result, index, modelBlobs, renderers, cameras, scenes);
          }
        },
        (progressEvent) => {
          const progress = progressEvent.loaded / progressEvent.total;
          console.log(`Model load progress (${index + 1}/${modelBlobs.length}):`, progress);
        }
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
  handleChangeNumberOfObjects = (e: any) => {
    // get input value from the input field
    let numberOfObjects = e.target?.value;
    console.log('numberObjects', numberOfObjects);

    this.setState({ numberOfObjects: numberOfObjects });
  };

  handleBlurNumberOfObjects = () => {
    this.loadScene();
  };

  render() {
    const { recordId, data, numberOfObjects } = this.state;

    return (
      <>
        <div>3d component ({recordId})</div>
        <br />

        <input type='text' onChange={this.handleChangeNumberOfObjects} onBlur={this.handleBlurNumberOfObjects} />

        <table>
          <thead>
            <tr>
              <td>1</td>
            </tr>
          </thead>
          <tbody>
            <tr>{this.getTitle()}</tr>
          </tbody>
          <tfoot>
            <tr>
              <td>1</td>
            </tr>
          </tfoot>
        </table>
        <br />
        <table>
          <thead>
            <tr>
              <td>1</td>
            </tr>
          </thead>
          <tbody>
            <tr>{this.printModelDesc()}</tr>
          </tbody>
          <tfoot>
            <tr>
              <td>1</td>
            </tr>
          </tfoot>
        </table>
        <div>
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
