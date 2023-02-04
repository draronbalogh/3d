export const _CONFIG = {
  url: {
    getModel: 'http://127.0.0.1:5000/api/3dmodels/',
    createModel: 'http://127.0.0.1:5000/api/3dmodels/create',
    getLastId: 'http://127.0.0.1:5000/api/3dmodels/getLastId',
    uploadFiles: 'http://127.0.0.1:5000/upload',
    deleteFiles: 'http://127.0.0.1:5000/deleteFiles',
    uploadFolder: 'c:/node/3d_uploads/'
  },
  validTypes: ['jpg', 'jpeg', 'png', 'bmp', 'svg', 'gif', 'webp', 'gltf', 'glb', 'fbx', 'obj', 'max', 'ma', 'blend', 'aep', 'aep', 'mp4', 'mpeg', 'webm', 'mov', 'mxf', 'mp3', 'weba', 'aac', 'wav', 'mid', 'tga', 'tif', 'tiff', 'json', 'txt', 'rtf', 'pdf', 'ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx', 'zip', '7z', 'rar', 'ttf', 'otf', 'woff', 'woff2'],
  forntendValildTypes: '.jpg, .jpeg, .png, .bmp, .svg, .gif, .webp, .gltf, .glb, .mp4, .mpeg, .webm, .mp3, .weba, .aac, .wav, .pdf, .zip, .7z, .rar'
};
