(function() {
    'use strict';

    function AppController($location, meshService) {
        var vm = this;

        meshService.getRootNodeChildren()
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

    function ProductListController($routeParams, meshService) {
        var vm = this;

        function filterForProducts(response) {
            vm.products = response.data.filter(function(node) {
                return node.schema.name === 'product';
            });
        }

        meshService.getChildren($routeParams.uuid)
            .then(filterForProducts);

        meshService.getNode($routeParams.uuid)
            .then(function(response) {
                vm.category = response;
            });

        vm.getProductImageUrl = function(node) {
            return meshService.getBinaryUrl(node.fields.productImage.uuid);
        };
    }

    function ProductDetailController($timeout, $routeParams, meshService) {
        var vm = this;
        vm.status = { error: false, message: '' };

        meshService.getNode($routeParams.uuid)
            .then(function(response) { vm.product = response; });

        vm.updateProduct = function(node) {
            meshService.updateNode(node)
                .then(showStatus, showStatus)
                .catch(showStatus);
        };

        vm.getProductImageUrl = function(node) {
            if(node && node.fields) {
                return meshService.getBinaryUrl(node.fields.productImage.uuid);
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

    angular.module('meshDemo', ['ngRoute'])
        .config(routeConfig)
        .controller('AppController', AppController);
})();