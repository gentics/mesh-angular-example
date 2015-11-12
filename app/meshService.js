(function() {
    'use strict';

    var DEFAULT_LANGUAGE = 'en';
    var PROJECT_NAME = 'demo';
    var USER_NAME = 'webclient';
    var PASSWORD = 'webclient';

    /**
     * This service makes the REST calls to the Mesh API.
     */
    function MeshService($http) {

        var self = this;

        self.getNode = function(uuid) {
            return meshGet(PROJECT_NAME + '/nodes/' + uuid);
        };

        self.updateNode = function(node) {
            return $http.post(API_URL + PROJECT_NAME + '/nodes/' + node.uuid, node);
        };

        self.getRootNodeChildren = function() {
            return self.getProject()
                .then(function(project) {
                    return self.getChildren(project.rootNodeUuid);
                });
        };

        self.getChildren = function(uuid) {
            return meshGet(PROJECT_NAME + '/nodes/' + uuid + '/children');
        };

        self.getProject = function() {
           return meshGet('projects')
               .then(function(response) {
                   return response.data.filter(function(project) {
                       return project.name === PROJECT_NAME;
                   })[0];
               });
        };

        function meshGet(url) {
            return $http.get(API_URL + url + '?lang=' + DEFAULT_LANGUAGE)
                .then(function(response) {
                    return response.data;
                });
        }

    }

    /**
     * Using the Mesh Basic Auth implementation. Add guest user credentials to the
     * header of each request.
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