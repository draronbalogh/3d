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
  scenes: THREE.Scene[];
  renderers?: THREE.WebGLRenderer[];
  cameras?: THREE.PerspectiveCamera[];
}
//////////////////////////////////////////////////////////////////////////////////////    CLASS SETUP
export class ViewRecord extends React.Component<CompProps, CompState> {
  sceneContainerRef = React.createRef<HTMLDivElement>();
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
      scenes: []
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
    window.removeEventListener('resize', this.handleWindowResize);
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
      this.loadImages();
      this.loadVideos();
      this.loadMaterials();
      this.loadModels();
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
        this.loadImages();
        this.loadVideos();
        this.loadMaterials();
        this.loadModels();
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

  loadImages = async () => {
    const { data } = this.state;
    if (data && data.recordImgs) {
      let imageNames = data.recordImgs.split(',');
      let imageBlobs: Blob[] = [];
      for (let imageName of imageNames) {
        imageName = imageName.trim();
        if (imageName) {
          // Üres string esetén átugorjuk a letöltést
          try {
            const response = await axios.get(`${HOST3D}/uploads/${data.recordUuid}/${imageName}`, { responseType: 'blob' });
            const imageBlob = new Blob([response.data], { type: response.headers['content-type'] });
            imageBlobs.push(imageBlob);
          } catch (error) {
            logAxiosError(error, `Error loading image: ${imageName}`);
          }
        }
      }
      this.setState({ imageBlobs });
    }
  };
  loadVideos = async () => {
    const { data } = this.state;
    if (data && data.recordVideos) {
      let videoNames = data.recordVideos.split(',');
      let videoBlobs: Blob[] = [];
      for (let videoName of videoNames) {
        videoName = videoName.trim();
        if (videoName) {
          try {
            const response = await axios.get(`${HOST3D}/uploads/${data.recordUuid}/${videoName}`, { responseType: 'blob' });
            const videoBlob = new Blob([response.data], { type: response.headers['content-type'] });
            videoBlobs.push(videoBlob);
          } catch (error) {
            logAxiosError(error, `Error loading video: ${videoName}`);
          }
        }
      }
      this.setState({ videoBlobs });
    }
  };
  loadMaterials = async () => {
    const { data } = this.state;
    if (data && data.recordMaterialUrl) {
      let materialNames = data.recordMaterialUrl.split(',');
      let materialUrlBlobs: Blob[] = [];
      for (let materialName of materialNames) {
        materialName = materialName.trim();
        if (materialName) {
          try {
            const response = await axios.get(`${HOST3D}/uploads/${data.recordUuid}/${materialName}`, { responseType: 'blob' });
            const materialBlob = new Blob([response.data], { type: response.headers['content-type'] });
            materialUrlBlobs.push(materialBlob);
          } catch (error) {
            logAxiosError(error, `Error loading material: ${materialName}`);
          }
        }
      }
      this.setState({ materialUrlBlobs });
    }
  };
  loadModels = () => {
    console.log('models loads');
    const { data } = this.state;
    if (data && data.recordModels3d) {
      let modelNames = data.recordModels3d.split(',');
      let modelBlobs: Blob[] = [];
      console.log('modelNames', modelNames);
      for (let modelName of modelNames) {
        modelName = modelName.trim();
        if (modelName) {
          axios
            .get(`${HOST3D}/uploads/${data.recordUuid}/${modelName}`, { responseType: 'blob' })
            .then((response) => {
              const modelBlob = new Blob([response.data], { type: response.headers['content-type'] });
              modelBlobs.push(modelBlob);
              this.setState({ modelBlobs }, () => {
                this.loadScene();
              });
            })
            .catch((error) => {
              logAxiosError(error, `Error loading model: ${modelName}`);
            });
        }
      }
    }
  };

  // Load scene
  loadScene = () => {
    const loader = new GLTFLoader();
    const { modelBlobs } = this.state;

    const scenes: THREE.Scene[] = [];
    const renderers: THREE.WebGLRenderer[] = [];
    const cameras: THREE.PerspectiveCamera[] = [];

    if (!modelBlobs) {
      return;
    }

    modelBlobs.forEach((blob, index) => {
      const objectUrl = URL.createObjectURL(blob);

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

          gltf.scene.traverse(function (node) {
            /*  if ((node as THREE.Mesh).isMesh) {
              (node as THREE.Mesh).material = new THREE.MeshStandardMaterial({
                color: 0x808080,
                roughness: 0.8,
                metalness: 0.8
              });
            }*/
          });
          scene.add(gltf.scene);

          const renderer = new THREE.WebGLRenderer({ antialias: true });
          renderers.push(renderer);

          const aspectRatio = window.innerWidth / window.innerHeight;
          const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

          cameras.push(camera);

          // Adding orbit control
          const controls = new OrbitControls(camera, renderer.domElement);
          controls.enableDamping = true;
          controls.dampingFactor = 0.25;
          controls.enableZoom = true;

          camera.position.z = 150;
          renderer.setSize(window.innerWidth, window.innerHeight);

          const animate = function () {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
          };

          animate();
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

    this.setState({ renderers, cameras, scenes }, () => {
      window.addEventListener('resize', this.handleWindowResize);
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

        const animate = function () {
          requestAnimationFrame(animate);
          renderer.render(scene, cameras[index]);
        };

        animate();
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
            // this.renderImages(),
            // this.renderVideos(),
            this.renderModels3D()
            //   this.renderMaterialURLs()
          ]}
        </div>
      </>
    );
  }
}
