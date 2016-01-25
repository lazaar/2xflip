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
        function($scope, $rootScope, $state, ProfileService, FlipConstants) {
        	var vm = this;
            function goToState(to, params){
                $state.go(to, params);
            }
            function firstUse(){
                ProfileService.initLocalStorage();
            }
            function showLevels(mode){
                vm.showLevel=mode;
            }
            function startGame(mode, level){
                vm.hideCard = level;
                _.delay(function(){
                    goToState(mode,{mode:level});
                }, 500);
            }
            function gift(){
                var lastDate = ProfileService.getLastDate(), 
                today = new Date().toDateString();
                if(lastDate !== today){
                    var gift = FlipConstants.gift[ProfileService.generateGift()];
                    $rootScope.gift = gift.slug;
                    ProfileService.propertyIncrement(gift.localStorage);
                    ProfileService.setLastDate(today);
                    _.delay(function(){
                        $scope.$apply(function(){
                            $rootScope.giftModal = true;
                        });
                    }, 700);
                }

            }
            function closeGift(){
                $rootScope.giftModal = false;
            }
        	function init(){  
                $rootScope.goToState = goToState;       
                vm.showLevels = showLevels;   
                vm.startGame = startGame;   
                $rootScope.closeGift = closeGift;   
                vm.showLevel = '';    
                _.delay(function(){
                    $scope.$apply(function(){
                        vm.showLogo = true;
                    });
                }, 500);
                if(ProfileService.isFirstUse()){
                    firstUse();
                }
                gift();
                vm.score  = ProfileService.getBestScore();
                vm.scoreFlash  = ProfileService.getBestScoreFlash();
        	}
        	init();
        }
    ]);
