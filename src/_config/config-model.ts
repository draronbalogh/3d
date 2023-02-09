export const modelConfig = [
  {
    name: 'id',
    label: 'Id',
    control: 'number',
    inputType: 'input',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'createdAt',
    label: 'Létrehozva',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'updatedAt',
    label: 'Frissítve',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelUuid',
    label: 'Egyedi azonosító',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelUploaderUid',
    label: 'Feltöltő aznosítója',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelTitle',
    label: 'Cím',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: true,
    visibility: true,
    maxLength: 1000
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
    maxLength: 1000
  },
  {
    name: 'modelChannel',
    label: 'Csatorna',
    control: 'select',
    categories: ['1', '2', '3'],
    inputType: 'select',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelCategory',
    label: 'Kategória',
    control: 'select',
    categories: ['Ember', 'Állat', 'Gép', 'Egyéb'],
    inputType: 'select',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelRenderEngine',
    label: 'Render engine',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelPolyCategory',
    label: 'Polygon kategória',
    categories: ['Alacsony', 'Közepes', 'Magas'],
    control: 'select',
    inputType: 'select',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelPolyCount',
    label: 'Polygon szám',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelFormat',
    label: 'Formátum',
    control: 'input',
    categories: ['obj', 'fbx'],
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelTags',
    label: 'Tag-ek',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelUrl',
    label: 'Modell url',
    control: 'file',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelFileName',
    label: 'Fájl név',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelImgs',
    label: 'Képek',
    control: 'file',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
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
    maxLength: 1000
  },
  {
    name: 'modelIframeUrl',
    label: 'Iframe url',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
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
    maxLength: 1000
  },
  {
    name: 'modelMaterialUrl',
    label: 'Material urls',
    control: 'file',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelState',
    label: 'Állapot',
    categories: ['Elérhető', 'Nem elérhető'],
    control: 'select',
    inputType: 'select',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelVisibility',
    label: 'Láthatóság',
    control: 'switch',
    inputType: 'FormCheckType ',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelRigged',
    label: 'Riggelve',
    control: 'switch',
    inputType: 'FormCheckType ',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelAnimated',
    label: 'Animálva',
    control: 'switch',
    inputType: 'FormCheckType ',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelUv',
    label: 'UV',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelLegality',
    label: 'Jogállás',
    categories: ['Jogtiszta modell', 'Ingyenes modell', 'Nem ismert forrás'],
    control: 'select',
    inputType: 'select',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1000
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
    maxLength: 1000
  },
  {
    name: 'modelViewerUid',
    label: 'Viewed by',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelViewCount',
    label: 'Viewed count',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelDownloaderUid',
    label: 'Downloaded by',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 1000
  },
  {
    name: 'modelDownloadCount',
    label: 'Download count',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    maxLength: 1000
  }
];
