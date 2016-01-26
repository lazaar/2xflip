'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('HomeController', ['$scope','$rootScope', '$state','ProfileService',
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
                if($rootScope.sound){
                    $rootScope.audios.flip.play();
                }
                _.delay(function(){
                    $state.go(mode,{mode:level});
                }, 500);
            }
        	function init(){      
                vm.showLevels = showLevels;   
                vm.startGame = startGame;
                vm.showLevel = ''; 
                $rootScope.audios.game.stop();
                $rootScope.audios.menu.play();
                $rootScope.audios.menu.setMuting(!$rootScope.sound);
                $rootScope.audios.menu.loop = true;
                _.delay(function(){
                    $scope.$apply(function(){
                        vm.showLogo = true;
                    });
                    if($rootScope.sound){
                        $rootScope.audios.logo.play();
                        $rootScope.audios.logo.volume = 0.4;
                    }
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
