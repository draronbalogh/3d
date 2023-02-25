export const modelConfig = [
  {
    name: 'editBtns',
    label: 'Btns',
    control: '',
    inputType: '',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 100
  },
  {
    name: 'modelId',
    label: 'modelId',
    control: 'number',
    inputType: 'input',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 100
  },
  {
    name: 'modelCreatedAt',
    label: 'Létrehozva',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 500
  },
  {
    name: 'modelUpdatedAt',
    label: 'Frissítve',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 500
  },
  {
    name: 'modelTitle',
    label: 'Cím',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: true,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'modelUuid',
    label: 'Egyedi azonosító',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 100
  },
  {
    name: 'modelUploaderUid',
    label: 'Feltöltő aznosítója',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 50
  },

  {
    name: 'modelDescription',
    label: 'Leírás',
    control: 'textarea',
    inputType: 'text',
    value: '',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'modelMeta',
    label: 'Meta',
    control: 'textarea',
    inputType: 'text',
    value: '',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'modelChannel',
    label: 'Csatorna',
    control: 'select',
    categories: ['Válassz kategóriát', '1', '2', '3'],
    inputType: 'select',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 50
  },
  {
    name: 'modelCategory',
    label: 'Kategória',
    control: 'select',
    categories: ['Válassz kategóriát', 'Ember', 'Állat', 'Gép', 'Egyéb'],
    inputType: 'select',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 50
  },
  {
    name: 'modelRenderEngine',
    label: 'Render engine',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'modelPolyCategory',
    label: 'Polygon kategória',
    categories: ['Válassz kategóriát', 'Alacsony', 'Közepes', 'Magas'],
    control: 'select',
    inputType: 'select',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 50
  },
  {
    name: 'modelPolyCount',
    label: 'Polygon szám',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'modelFormat',
    label: 'Formátum',
    control: 'input',
    categories: ['Válassz kategóriát', 'obj', 'fbx'],
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'modelTags',
    label: 'Tag-ek',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'modelUrl',
    label: 'Modell url',
    control: 'file',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'modelFileName',
    label: 'Fájl név',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'modelImgs',
    label: 'Képek',
    control: 'file',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'modelSourceUrl',
    label: 'Modell forrása',
    control: 'textarea',
    inputType: 'text',
    value: '',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'modelIframeUrl',
    label: 'Iframe url',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 30000
  },
  {
    name: 'modelExtraLinks',
    label: 'Extra linkek',
    control: 'textarea',
    inputType: 'text',
    value: '',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'modelMaterialUrl',
    label: 'Material urls',
    control: 'file',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'modelState',
    label: 'Állapot',
    categories: ['Válassz kategóriát', 'Elérhető', 'Nem elérhető'],
    control: 'select',
    inputType: 'select',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'modelVisibility',
    label: 'Láthatóság',
    control: 'switch',
    inputType: 'FormCheckType ',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1
  },
  {
    name: 'modelRigged',
    label: 'Riggelve',
    control: 'switch',
    inputType: 'FormCheckType ',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1
  },
  {
    name: 'modelAnimated',
    label: 'Animálva',
    control: 'switch',
    inputType: 'FormCheckType ',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1
  },
  {
    name: 'modelUv',
    label: 'UV',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'modelLegality',
    label: 'Jogállás',
    categories: ['Válassz kategóriát', 'Jogtiszta modell', 'Ingyenes modell', 'Nem ismert forrás'],
    control: 'select',
    inputType: 'select',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'modelScript',
    label: 'Script',
    control: 'textarea',
    inputType: 'text',
    value: '',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 30000
  },
  {
    name: 'modelViewerUid',
    label: 'Viewed by',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 50
  },
  {
    name: 'modelViewCount',
    label: 'Viewed count',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 1024
  },
  {
    name: 'modelDownloaderUid',
    label: 'Downloaded by',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 50
  },
  {
    name: 'modelDownloadCount',
    label: 'Download count',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    maxLength: 1024
  },
  {
    name: 'joinFromTable',
    label: 'Forrás tábla',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    maxLength: 255
  },
  {
    name: 'joinFromInput',
    label: 'Forrás input mező',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    maxLength: 255
  },
  {
    name: 'joinId',
    label: 'Join Id',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    maxLength: 1024
  },
  {
    name: 'joinUuid',
    label: 'Join Uuid',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    maxLength: 1024
  }
];
