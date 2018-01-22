export interface ListRequest<T> {
  data: T[];
  _metainfo: {
    currentPage: number;
    perPage: number;
    pageCount: number;
    totalCount: number;
  };
}

export interface MeshError {
  type: string;
  i18nParameters: Array<string | number>;
  message: string;
  properties: {
    [propertyName: string]: string | number;
  };
}

export interface MeshNodeReference {
  projectName: string;
  schema: {
    name: string;
    uuid: string;
  };
  uuid: string;
}

export interface MeshNode extends MeshNodeReference {
  creator: UserReference;
  created: string;
  editor: UserReference;
  edited: string;
  language: string;
  availableLanguages: {
    [language: string]: {
      published: boolean;
      version: string;
      publisher: UserReference;
      publishDate: string;
    };
  };
  parentNode: MeshNodeReference;
  tags: any[];
  project: {
    name: string;
    uuid: string;
  };
  childrenInfo: {
    [schemaName: string]: {
      schemaUuid: string;
      count: number;
    };
  };
  schema: {
    name: string;
    uuid: string;
    version: string;
  };
  container: boolean;
  displayField: string;
  displayName: string;
  fields: {
    [fieldName: string]: any;
  };
  breadcrumb: any[];
  version: string;
  permissions: Permissions;
}

export interface Permissions {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  publish: boolean;
  readPublished: boolean;
}

export interface Project {
  uuid: string;
  creator: UserReference;
  created: string;
  editor: UserReference;
  edited: string;
  name: string;
  rootNode: MeshNodeReference;
  permissions: Permissions;
}

export interface UserReference {
  uuid: string;
}
