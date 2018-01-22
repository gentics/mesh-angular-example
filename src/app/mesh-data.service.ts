import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';

import { ListRequest, MeshNode, Project } from './mesh-models';

const API_URL = '/api/v1/';

/**
 * This service makes the REST calls to the Mesh API. Since this is a very basic demo, only a few of the Mesh
 * API endpoints are used. In reality, every function of Mesh is exposed via the REST API. For a full overview
 * of the endpoints available, see https://getmesh.io/docs/beta/raml/.
 */
@Injectable()
export class MeshDataService {

  username = 'webclient';
  password = 'webclient';
  projectName = 'demo';
  language = 'de';

  constructor(private http: HttpClient) { }

  /** This should be called first, as it will get set the auth cookie which is required by all subsequent requests. */
  login() {
    return this.post('auth/login', {
      username: this.username,
      password: this.password
    });
  }

  /** Get a single node by the node's uuid. */
  getNode(uuid: string) {
    return this.get<MeshNode>(this.projectName + '/nodes/' + uuid);
  }

  /** Returns a list of children of a node. */
  getChildren(parentNodeUuid: string) {
    return this.get<ListRequest<MeshNode>>(`${this.projectName}/nodes/${parentNodeUuid}/children`)
      .pipe(map(response => response.data));
  }

  /** Returns the demo project object. */
  getProject(projectName = this.projectName) {
    return this.get<ListRequest<Project>>('projects')
      .pipe(map(response =>
        response.data.find(project => project.name === projectName)
      ));
  }

  /**
   * Returns the url of the binary field of a node. A binary field is a field
   * with the type "binary", for example an image or video file.
   * The contents of anay binary field can be received via `<nodeUuid>/binary/<fieldName>`.
   */
  getBinaryUrl(nodeUuid: string, fieldName: string) {
    if (nodeUuid) {
      return `${API_URL}${this.projectName}/nodes/${nodeUuid}/binary/${fieldName}`;
    }

    return undefined;
  }

  /**
   * Returns a list of the immediate children of the root node. The root node is a special
   * node which is the top-level node of a project node tree. Each project in Mesh has a
   * property `rootNode` which can be used to query the root node itself.
   */
  getRootNodeChildren(projectName = this.projectName) {
    return this.getProject(projectName)
      .pipe(switchMap(project =>
        project ? this.getChildren(project.rootNode.uuid) : [undefined]
      ));
  }

  /** Update the fields of an existing node. */
  updateNode(node: MeshNode) {
    return this.post<MeshNode>(this.projectName + '/nodes/' + node.uuid, node);
  }

  /** Convenience helper for GET requests that ensures cookies are sent. */
  private get<T>(url: string) {
    return this.http.get<T>(`${API_URL}${url}`, { withCredentials: true });
  }

  /** Convenience helper for POST requests that ensures cookies are sent. */
  private post<T>(url: string, body: any) {
    return this.http.post<T>(`${API_URL}${url}`, body, { withCredentials: true });
  }

}
