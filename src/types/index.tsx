export type FileType = {
  data: [];
  name: string;
  addedOn: string;
  updatedOn: string;
  _id: string;
};

export type FolderType = {
  files: FileType[];
  name: string;
  addedOn: string;
  updatedOn: string;
  _id: string;
};

export type DocsType =
  | { type: "file"; file: FileType; from?: string }
  | { type: "folder"; folder: FolderType };
