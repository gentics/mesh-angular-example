(function() {
    'use strict';

    var DEFAULT_LANGUAGE = 'en';
    var PROJECT_NAME = 'demo';
    var USER_NAME = 'webclient';
    var PASSWORD = 'webclient';

    /**
     * This service makes the REST calls to the Mesh API. Since this is a very basic demo, only a few of the Mesh
     * API endpoints are used. In reality, every function of Mesh is exposed via the REST API. For a full overview
     * of the endpoints available, see http://getmesh.io/docs/beta/raml/
     *
     */
    function MeshService($http) {

        var self = this;

        /**
         * Get a single node as specified by the node's uuid.
         * @param {string} uuid
         */
        self.getNode = function(uuid) {
            return meshGet(PROJECT_NAME + '/nodes/' + uuid);
        };

        /**
         * Update the node's fields. Expects an existing Mesh node object with a uuid property.
         * @param {Object} node
         */
        self.updateNode = function(node) {
            return $http.put(API_URL + PROJECT_NAME + '/nodes/' + node.uuid, node);
        };

        /**
         * Returns a list of the immediate children of the root node. The root node is a special
         * node which is the top-level node of a project node tree. Each project in Mesh has a
         * property, `rootNodeUuid`, which can be used to query the root node itself.
         *
         * The children of the root node are therefore the top-level nodes in the project.
         * In the case of this demo app, they are the category folders.
         */
        self.getRootNodeChildren = function() {
            return self.getProject()
                .then(function(project) {
                    return self.getChildren(project.rootNodeUuid);
                });
        };

        /**
         * Returns a list of children of a node as specified by uuid.
         * @param {string} uuid
         */
        self.getChildren = function(uuid) {
            return meshGet(PROJECT_NAME + '/nodes/' + uuid + '/children');
        };

        /**
         * Returns the demo project object. This is done here by querying the Mesh `projects` endpoint,
         * which gives a list of all projects, and then filtering out the one that we want.
         */
        self.getProject = function() {
           return meshGet('projects')
               .then(function(response) {
                   return response.data.filter(function(project) {
                       return project.name === PROJECT_NAME;
                   })[0];
               });
        };

        /**
         * Returns the url of the binary file associated with a binary node.
         *
         * A node is defined as a binary node if it's schema has the `binary` flag set to true. When this is the
         * case, any nodes with this schema will expose a `/bin` endpoint, which will return the binary file.
         *
         * @param {string} nodeUuid
         */
        self.getBinaryUrl = function(nodeUuid) {
            if (nodeUuid) {
                return API_URL + PROJECT_NAME + '/nodes/' + nodeUuid + '/languages/en/fields/image';
            }
        };

        /**
         * A helper method which simply appends the query string `lang=...` to any GET request.
         * Since a node in Mesh can have multiple language versions, this argument makes it explicit
         * which version we want. If this argument is not set, Mesh will use the default language per
         * its configuration.
         *
         * @param {string} url
         */
        function meshGet(url) {
            return $http.get(API_URL + url + '?lang=' + DEFAULT_LANGUAGE)
                .then(function(response) {
                    return response.data;
                });
        }

    }

    /**
     * One of the authentication strategies supported by Mesh is basic access authentication. In this example, we
     * have a hard-coded "webclient" user, and we pass this user's credentials with each request to Mesh.
     */
    function authInterceptorConfig($httpProvider) {

        var authString = 'Basic ' + window.btoa(USER_NAME + ':' + PASSWORD);

        var interceptor = function(){
            return {
                request: function (config) {
                    if (config.url.indexOf('api/v1') > -1) {
                        config.headers['Authorization'] = authString;
                    }
                    return config;
                }
            };
        };

        $httpProvider.interceptors.push(interceptor);
    }

    angular.module('meshDemo')
        .service('meshService', MeshService)
        .config(authInterceptorConfig);

})();

