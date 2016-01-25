'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('HomeController', ['$scope','$rootScope', '$state','ProfileService','FlipConstants',
        function($scope, $rootScope, $state, ProfileService) {
        	var vm = this;
            function firstUse(){
                ProfileService.initLocalStorage();
            }
            function showLevels(mode){
                vm.showLevel=mode;
            }
            function startGame(mode, level){
                vm.hideCard = level;
                _.delay(function(){
                    $state.go(mode,{mode:level});
                }, 500);
            }
        	function init(){      
                vm.showLevels = showLevels;   
                vm.startGame = startGame;
                vm.showLevel = '';    
                _.delay(function(){
                    $scope.$apply(function(){
                        vm.showLogo = true;
                    });
                }, 500);
                if(ProfileService.isFirstUse()){
                    firstUse();
                }
                vm.score  = ProfileService.getBestScore();
                vm.scoreFlash  = ProfileService.getBestScoreFlash();
        	}
        	init();
        }
    ]);
