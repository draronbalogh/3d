export interface RecordState {
  data: any;
  imgData: imgDataType[];
  isUploading: boolean;
  isSaved: boolean;
  isThankYou: boolean;
  uploadingData: any;
  folderName: string;
  recordUuid: string;
  files: UploadFiles | any;
  folderId: string;
}
export interface UploadFiles {
  recordModels3d: [];
  recordImgs: [];
  recordMaterialUrl: [];
  recordVideos: [];
}
export interface imgDataType {
  imgFileType: string;
  imgFileSize: number;
  imgOriginalFileName: string;
  imgFileNameWithoutExtension: string;
  imgFileExtension: any;
  imgFileUuid: string;
  imgFileMimeType: string;
  imgFileLastModified: string;
  imgFileLastModifiedDate: string;
  recordTitle: string;
  recordUuid: string;
}

export interface ModelMethods {
  saveRecod: (e: any) => Promise<void>;
  formBuilder: (i: number, elm: any) => JSX.Element;
}
