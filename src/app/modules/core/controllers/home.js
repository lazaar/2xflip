'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.HomeController
 * @description Home controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('HomeController', ['$scope','$rootScope', '$state','$log','$q','FacebookService','ProfileService','admobSvc','FlipConstants',
        function($scope, $rootScope, $state,$log,$q,FacebookService, ProfileService, admobSvc, FlipConstants) {
        	var vm = this;
            function firstUse(){
                ProfileService.initLocalStorage();
            }
            function showLevels(mode){
                vm.showLevel=mode;
            }
            function startGame(mode, level){
                vm.hideCard = level;
                if(!!window.cordova && device.platform ==='Android' && parseFloat(device.version)<4.4){//jshint ignore:line
                    $rootScope.isOldVersion =true;
                }
                if($rootScope.sound){
                    $rootScope.audios.flip.play();
                }
                _.delay(function(){
                    $state.go(mode,{mode:level});
                }, 500);
            }
            function initAdmob(){
                if(Math.random()<FlipConstants.admob.frequence.homeBanner){
                    admobSvc.createBannerView();
                }
                else{
                    admobSvc.destroyBannerView();
                }
                admobSvc.requestInterstitialAd();
                if(Math.random()<FlipConstants.admob.frequence.homeInter){
                    _.delay(function(){
                        admobSvc.showInterstitialAd();
                    }, 500);
                }
            }

            function loginFacebook(){
                $log.debug('login');
                FacebookService.loginFacebook();
            }
            function shareFacebook(){
                var content={
                    name: FlipConstants.contentShare[Math.floor(Math.random()*FlipConstants.contentShare.length)],
                    caption: '2xFlip Available for Android and iOS',
                    description: 'Are you ready for a challenge ?'
                };
                FacebookService.shareFacebook(content);
                    /*facebookConnectPlugin.showDialog(
                    {
                      method: 'apprequests',
                      message:'hey you'
                    },function(response){
                        console.log(response);
                    },function(response){
                        console.log(response);
                    }); */
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
                    FacebookService.isConnectedFacebook();
                }, 500);
                if(ProfileService.isFirstUse()){
                    firstUse();
                    $rootScope.showFacebookLogin = true;
                    FacebookService.setFacebookModal(new Date().toDateString());
                }
                else{
                    initAdmob();
                }
                vm.score  = ProfileService.getBestScore();
                $rootScope.loginFacebook  = loginFacebook;
                vm.shareFacebook  = shareFacebook;
                vm.scoreFlash  = ProfileService.getBestScoreFlash();
        	}
        	init();
        }
    ]);
