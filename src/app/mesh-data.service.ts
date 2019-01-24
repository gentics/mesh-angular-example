import { Injectable, OnDestroy } from '@angular/core';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/operators/switchMap';
import { takeUntil } from 'rxjs/operators/takeUntil';

import { ListRequest, MeshNode, Project } from './mesh-models';

const API_URL = '/api/v1/';

/**
* This service makes the REST calls to the Mesh API. Since this is a very basic demo, only a few of the Mesh
* API endpoints are used. In reality, every function of Mesh is exposed via the REST API. For a full overview
* of the endpoints available, see https://getmesh.io/docs/beta/raml/.
*/
@Injectable()
export class MeshDataService implements OnDestroy {

    username = 'webclient';
    password = 'webclient';
    projectName = 'demo';
    language = 'de';
    isPreview = new BehaviorSubject<boolean>(false);
    nodeStatus = ENodeStatus.PUBLISHED;

    private destroy$ = new Subject<void>();

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute
    ) {
        // Watch URL parameter to check if in preview mode
        this.route.queryParamMap
            .pipe(
                map((paramMap: ParamMap) => {
                    if (paramMap.get('preview')) {
                        return true;
                    } else {
                        return false;
                    }
                }),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(urlParamPreview => this.isPreview.next(urlParamPreview));

        // Listen if preview mode gets enabled
        this.isPreview
            .pipe(takeUntil(this.destroy$))
            .subscribe((isPreview: boolean) => {
                if (isPreview === true) {
                    this.nodeStatus = ENodeStatus.DRAFT;
                } else {
                    this.nodeStatus = ENodeStatus.PUBLISHED;
                }
            });
    }

    // On service instance destroy lifecycle hook
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /** This should be called first, as it will get set the auth cookie which is required by all subsequent requests. */
    login() {
        return this.post('auth/login', {
            username: this.username,
            password: this.password
        });
    }

    /** Get a single node by the node's uuid. */
    getNode(uuid: string) {
        return this.get<MeshNode>(
            `${this.projectName}/nodes/${uuid}`,
            { version: this.nodeStatus }
        );
    }

    /** Returns a list of children of a node. */
    getChildren(parentNodeUuid: string) {
        return this.get<ListRequest<MeshNode>>(
            `${this.projectName}/nodes/${parentNodeUuid}/children`,
            { version: this.nodeStatus }
        )
            .pipe(map(response => response.data));
    }

    /** Returns the demo project object. */
    getProject(projectName = this.projectName) {
        return this.get<ListRequest<Project>>('projects')
            .pipe(map(response => response.data.find(project => project.name === projectName)));
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
            .pipe(switchMap(project => project ? this.getChildren(project.rootNode.uuid) : [undefined]));
    }

    /** Update the fields of an existing node. */
    updateNode(node: MeshNode) {
        return this.post<MeshNode>(this.projectName + '/nodes/' + node.uuid, node);
    }

    /**
     * Convenience helper for GET requests that ensures cookies are sent.
     * @param url destination URL of request
     * @param params URL query parameter
     * */
    private get<T>(
        url: string,
        params?: { [param: string]: string | string[]; }
    ) {
        const options = { withCredentials: true };
        // if params provided assign them
        if (params) {
            Object.assign(options, {params});
        }
        return this.http.get<T>(`${API_URL}${url}`, options);
    }

    /**
     * Convenience helper for POST requests that ensures cookies are sent.
     * @param url destination URL of request
     * @param body request body
     * */
    private post<T>(url: string, body: any) {
        return this.http.post<T>(`${API_URL}${url}`, body, { withCredentials: true });
    }

}

/** Node states */
export enum ENodeStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published'
}
