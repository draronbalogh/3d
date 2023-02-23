export const PORT3D = 5000;
export const HOST3D = 'http://127.0.0.1'; // TODO: Change proxy in package.json to this
export const _CONFIG = {
  url: {
    getModel: `${HOST3D}:${PORT3D}/api/3dmodels/`,
    createModel: `${HOST3D}:${PORT3D}/api/3dmodels/createModel`,
    createImage: `${HOST3D}:${PORT3D}/api/3dmodels/createImage`,
    getLastModelId: `${HOST3D}:${PORT3D}/api/3dmodels/getLastModelId`,
    uploadFiles: `${HOST3D}:${PORT3D}/uploadModel`,
    deleteModelFiles: `${HOST3D}:${PORT3D}/deleteModelFiles`,
    deleteImage: `${HOST3D}:${PORT3D}/api/images/`,
    uploadFolder: 'c:/node/3d_uploads/'
  },
  routes: {
    uploadModel: '/uploadModel',
    createImage: '/createImage',
    deleteModelFiles: '/deleteModelFiles',
    routes3d: '/api/3dmodels',
    routesImages: '/api/images',
    error: 'Hibás URL cím, vagy nem létező oldal!'
  },
  theme: {
    domTrg: 'data-bs-theme',
    light: 'light',
    dark: '3dDark',
    storedBg: 'storedBgStyle'
  },
  validation: {
    file: {
      numberOfFiles: 10,
      minFileSize: 1,
      maxFileSize: 2000 * 1000 * 1000, // 2 GB per file
      maxTotalFileSize: 20000 * 1000 * 1000, // 20 GB total
      maxFiles: 20,
      maxFields: 0, // 0 = unlimited
      maxFieldsSize: 1000 * 1024 * 1024,
      keepExtensions: true,
      allowEmptyFiles: false,
      types: ['jpg', 'jpeg', 'png', 'bmp', 'svg', 'gif', 'webp', 'gltf', 'glb', 'fbx', 'obj', 'max', 'ma', 'blend', 'aep', 'aep', 'mp4', 'mpeg', 'webm', 'mov', 'mxf', 'mp3', 'weba', 'aac', 'wav', 'mid', 'tga', 'tif', 'tiff', 'json', 'txt', 'rtf', 'pdf', 'ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx', 'zip', '7z', 'rar', 'ttf', 'otf', 'woff', 'woff2'],
      forntendTypes: '.jpg, .jpeg, .png, .bmp, .svg, .gif, .webp, .gltf, .glb, .mp4, .mpeg, .webm, .mp3, .weba, .aac, .wav, .pdf, .zip, .7z, .rar'
    },
    text: {
      maxTextLength: 1000
    }
  },
  msg: {
    txt: {
      db: {
        startDb: 'Start database connection!',
        success: 'Success connecting to database!'
      },
      server: {
        started: `Server started on port ${PORT3D}`,
        uploadSuccess: 'File uploaded successfully',
        dataUploaded: 'Data uploaded successfully',
        imgDataUploaded: 'Image data uploaded successfully',
        postOk: 'POST recieved successfully'
      },
      file: {
        removed: 'File removed successfully',
        deleteOk: 'Delete request received successfully'
      }
    },
    error: {
      db: {
        connection: 'Unable to connect to the database!',
        noDataFromDb: 'No data received from database'
      },
      server: {
        noConnection: 'Server is not responding',
        noResponse: 'Server is not responding',
        noData: 'No data received from server',
        noDataFromServer: 'No data received from server'
      },
      form: {
        general: 'General error with formidable',
        aborted: 'Aborted formidable error',
        parse: 'Parse error with formidable',
        notValid: 'Non valid file types in formidable parse method'
      },
      file: {
        unlink: 'Error unlinking file',
        folder: 'Error while deleting the folder',
        uploading: 'Error while uploading files',
        deleting: 'Error while deleting files',
        tooBig: 'File too Big, please select a file less than...',
        tooSmall: 'File too small, please select a file bigger than...',
        maxFileLimit: 'Maximum allowed file is lower (20)',
        notValid: 'Non valid file types while adding / editing a record'
      },
      fetch: {
        fetchById: 'Fetch by id error',
        axios: 'Axios Error',
        getData: 'Error while getting data from database',
        postingData: 'Error while posting / storing data to database',
        saving: 'Error while saving data to database / uploading files',
        updating: 'Error while posting / storing data to database'
      }
    }
  }
};
