// TODO:: add zip files and mixed types recordAudio, recordMix. Check every model type in config-controller-data-types.ts
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
    name: 'recordId',
    label: 'recordId',
    control: 'number',
    inputType: 'input',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 100
  },
  {
    name: 'recordTitle',
    label: 'Cím',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: true,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'recordUuid',
    label: 'Egyedi azonosító',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 100
  },
  {
    name: 'recordUploaderUid',
    label: 'Feltöltő aznosítója',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 50
  },

  {
    name: 'recordDescription',
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
    name: 'recordMeta',
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
    name: 'recordChannel',
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
    name: 'recordCategory',
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
    name: 'recordRenderEngine',
    label: 'Render engine',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'recordPolyCategory',
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
    name: 'recordPolyCount',
    label: 'Polygon szám',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'recordFormat',
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
    name: 'recordTags',
    label: 'Tag-ek',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'recordUrl',
    label: '3D modellek',
    control: 'file',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 255
  },
  {
    name: 'recordFileName',
    label: 'Fájl név',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'recordVideos',
    label: 'Videók',
    control: 'file',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'recordImgs',
    label: 'Képek',
    control: 'file',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'recordSourceUrl',
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
    name: 'recordIframeUrl',
    label: 'Iframe url',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 30000
  },
  {
    name: 'recordExtraLinks',
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
    name: 'recordMaterialUrl',
    label: 'Material-ok',
    control: 'file',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'recordState',
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
    name: 'recordVisibility',
    label: 'Láthatóság',
    control: 'switch',
    inputType: 'FormCheckType ',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1
  },
  {
    name: 'recordRigged',
    label: 'Riggelve',
    control: 'switch',
    inputType: 'FormCheckType ',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1
  },
  {
    name: 'recordAnimated',
    label: 'Animálva',
    control: 'switch',
    inputType: 'FormCheckType ',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 1
  },
  {
    name: 'recordUv',
    label: 'UV',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: true,
    isRequired: false,
    visibility: true,
    maxLength: 3000
  },
  {
    name: 'recordLegality',
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
    name: 'recordScript',
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
    name: 'recordViewerUid',
    label: 'Viewed by',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 50
  },
  {
    name: 'recordViewCount',
    label: 'Viewed count',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 1024
  },
  {
    name: 'recordDownloaderUid',
    label: 'Downloaded by',
    control: 'input',
    inputType: 'text',
    enableForAddEdit: false,
    isRequired: false,
    visibility: true,
    maxLength: 50
  },
  {
    name: 'recordDownloadCount',
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
