// TODO:: add zip files and mixed types model3dAudio, model3dMix. Check every model type in config-controller-data-types.ts
export const model3dConfig = [
  {
    name: 'model3dId',
    label: 'model3dId',
    control: 'number',
    inputType: 'input',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 100
  },
  {
    name: 'model3dTitle',
    label: 'Cím',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: true,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'model3dUuid',
    label: 'Egyedi azonosító',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 100
  },
  {
    name: 'model3dUploaderUid',
    label: 'Feltöltő aznosítója',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 50
  },

  {
    name: 'model3dDescription',
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
    name: 'model3dMeta',
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
    name: 'model3dChannel',
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
    name: 'model3dCategory',
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
    name: 'model3dRenderEngine',
    label: 'Render engine',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'model3dGeometryType',
    label: 'Geometria típusa',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'model3dUvMapping',
    label: 'UV mappek',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'model3dTextureMaps',
    label: 'Textúra mappek',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'model3dPolyCategory',
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
    name: 'model3dPolyCount',
    label: 'Polygon szám',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'model3dFormat',
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
    name: 'model3dTags',
    label: 'Tag-ek',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'model3dUrl',
    label: '3D modellek',
    control: 'file',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'model3dDownloadUrl',
    label: 'Letöltési link',
    control: 'file',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'model3dFileName',
    label: 'Fájl név',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'model3dVideos',
    label: 'Videók',
    control: 'file',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'model3dImgs',
    label: 'Képek',
    control: 'file',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'model3dSourceUrl',
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
    name: 'model3dIframeUrl',
    label: 'Iframe url',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 30000
  },
  {
    name: 'model3dViewerEmbedCode',
    label: 'Viewer embed code',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 30000
  },
  {
    name: 'model3dExtraLinks',
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
    name: 'model3dMaterialUrl',
    label: 'Material-ok',
    control: 'file',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'model3dState',
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
    name: 'model3dVisibility',
    label: 'Láthatóság',
    control: 'switch',
    inputType: 'FormCheckType ',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1
  },
  {
    name: 'model3dRigged',
    label: 'Riggelve',
    control: 'switch',
    inputType: 'FormCheckType ',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1
  },
  {
    name: 'model3dRigging',
    label: 'Riggelés',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'model3dAnimated',
    label: 'Animálva',
    control: 'switch',
    inputType: 'FormCheckType ',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1
  },
  {
    name: 'model3dUv',
    label: 'UV',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'model3dLightingSetup',
    label: 'Animáció típusa',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'model3dLegality',
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
    name: 'model3dScript',
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
    name: 'model3dWebLib',
    label: 'Web library',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'model3dViewerUid',
    label: 'Viewed by',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 50
  },
  {
    name: 'model3dViewCount',
    label: 'Viewed count',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 1024
  },
  {
    name: 'model3dDownloaderUid',
    label: 'Downloaded by',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 50
  },
  {
    name: 'model3dDownloadCount',
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
