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
         * This should be called first, as it will get set the auth cookie which is required by all subsequent requests.
         */
        self.login = function() {
            var authString = 'Basic ' + window.btoa(USER_NAME + ':' + PASSWORD);
            return meshGet('auth/login', { headers: { Authorization: authString } });
        };

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
            return meshPost(PROJECT_NAME + '/nodes/' + node.uuid, node);
        };

        /**
         * Returns a list of the immediate children of the root node. The root node is a special
         * node which is the top-level node of a project node tree. Each project in Mesh has a
         * property, `rootNode`, which can be used to query the root node itself.
         *
         * The children of the root node are therefore the top-level nodes in the project.
         * In the case of this demo app, they are the category folders.
         */
        self.getRootNodeChildren = function() {
            return self.getProject()
                .then(function(project) {
                    return self.getChildren(project.rootNode.uuid);
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
         * Returns the url of the binary field of a node.
         *
         * A binary field is a field with the type "binary". Each binary field will expose an endpoint at
         * `<nodeUuid>/binary/<fieldName>` which returns the binary data.
         *
         * @param {string} nodeUuid
         * @param {string} fieldName
         */
        self.getBinaryUrl = function(nodeUuid, fieldName) {
            if (nodeUuid) {
                return API_URL + PROJECT_NAME + '/nodes/' + nodeUuid + '/binary/' + fieldName;
            }
        };

        /**
         * A helper method which simply appends the query string `lang=...` to any GET request.
         * Since a node in Mesh can have multiple language versions, this argument makes it explicit
         * which version we want. If this argument is not set, Mesh will use the default language per
         * its configuration.
         *
         * This method also ensures that the `withCredentials` flag is set to true, so that authentication
         * via the cookie token can take place.
         *
         * @param {string} url
         * @param {Object} config
         */
        function meshGet(url, config) {
            config = config || {};
            config.withCredentials = true;
            return $http.get(API_URL + url + '?lang=' + DEFAULT_LANGUAGE, config)
                .then(function(response) {
                    return response.data;
                });
        }

        /**
         * Performs the same function as meshGet, but for POST requests.
         *
         * @param {string} url
         * @param {Object} payload
         * @param {Object} config
         */
        function meshPost(url, payload, config) {
            config = config || {};
            config.withCredentials = true;
            return $http.post(API_URL + url + '?lang=' + DEFAULT_LANGUAGE, payload, config);
        }

    }

    angular.module('meshDemo').service('meshService', MeshService);

})();

