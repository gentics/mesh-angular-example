(function() {
    'use strict';

    /**
     * The main controller for the app. It's sole function is to load the main categories which are
     * used to populate the top navbar items.
     *
     * @param $location
     * @param meshService
     * @constructor
     */
    function AppController($location, meshService) {
        var vm = this;

        meshService.login()
            .then(function() {
                return meshService.getRootNodeChildren();
            })
            .then(function(response) {
                vm.menuItems = response.data.filter(function(node) {
                    return node.schema.name === 'category';
                });
            });

        this.openCategory = function(node) {
            vm.activeCategory = node;
            $location.url('category/' + node.uuid);
        }
    }

    /**
     * The controller for the products list view. It makes 2 calls to the Mesh API: one to populate the
     * child nodes of the current category (i.e. the products list); and another to get the details
     * of the current category.
     *
     * @param $routeParams
     * @param meshService
     * @constructor
     */
    function ProductListController($routeParams, meshService) {
        var vm = this;

        function filterForProducts(response) {
            vm.products = response.data.filter(function(node) {
                return node.schema.name === 'vehicle';
            });
        }

        meshService.getChildren($routeParams.uuid)
            .then(filterForProducts);

        meshService.getNode($routeParams.uuid)
            .then(function(response) {
                vm.category = response;
            });

        vm.getProductImageUrl = function(node) {
            return meshService.getBinaryUrl(node.fields.vehicleImage.uuid, 'image');
        };
    }

    /**
     * The controller for the product detail view. Gets the current product data and also handles putting
     * modified data back to the Mesh API.
     *
     * @param $timeout
     * @param $routeParams
     * @param meshService
     * @constructor
     */
    function ProductDetailController($timeout, $routeParams, meshService) {
        var vm = this;
        vm.status = { error: false, message: '' };

        meshService.getNode($routeParams.uuid)
            .then(function(response) { vm.product = response; });

        vm.updateProduct = function(node) {
            meshService.updateNode(node)
                .then(
                    function(response) {
                        vm.product = response.data;
                        showStatus(response);
                    },
                    showStatus);
        };

        vm.getProductImageUrl = function(node) {
            if(node && node.fields) {
                return meshService.getBinaryUrl(node.fields.vehicleImage.uuid, 'image');
            }
        };

        function showStatus(result) {
            if (400 <= result.status) {
                vm.status.error = true;
                vm.status.message = 'Error: ' + result.statusText;
            } else {
                vm.status.error = false;
                vm.status.message = "Product updated";
            }
            $timeout(function() {
                vm.status.message = '';
            }, 4000);
        }
    }

    /**
     * Define the routes for the app.
     *
     * @param $routeProvider
     */
    function routeConfig($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/components/welcomeScreen.html'
            })
            .when('/category/:uuid', {
                templateUrl: 'app/components/productList.html',
                controller: ProductListController,
                controllerAs: 'vm'
            })
            .when('/product/:uuid', {
                templateUrl: 'app/components/productDetail.html',
                controller: ProductDetailController,
                controllerAs: 'vm'
            })
            .otherwise('/');
    }

    /**
     * Bootstrap the app.
     */
    angular.module('meshDemo', ['ngRoute'])
        .config(routeConfig)
        .controller('AppController', AppController);
})();