'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('HomeController', ['$scope',
        function($scope) {
        	var vm = this;

        	function init(){    		
	        	_.delay(function(){
	        		$scope.$apply(function(){
	        			vm.showLogo = true;
	        		})
	        		console.log(vm.showLogo);
	        	}, 500);
        	}
        	init();
        }
    ]);
