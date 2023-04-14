export interface ModelProps {
  data: any;
}
export interface UploadFiles {
  recordModels3d: [];
  recordImgs: [];
  recordMaterialUrl: [];
  recordVideos: [];
}
export interface RecordState {
  data: any;
  imgData: imgDataType[];
  uploadingData: any;
  files: UploadFiles | any;
  isUploading: boolean;
  isSaved: boolean;
  isThankYou: boolean;
  oldFilesToDel: any;
  recordUuid: string;
  folderId: string;
  folderName: string;
  joinFromInput: string[];
  recordId: any;
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
export interface DataObject {
  recordImgs?: string;
  recordModels3d?: string;
  recordMaterialUrl?: string;
  recordVideos?: string;
}

export interface Data {
  recordImgs?: DataObject[];
  recordModels3d?: DataObject[];
  recordMaterialUrl?: DataObject[];
  recordVideos?: DataObject[];
}
