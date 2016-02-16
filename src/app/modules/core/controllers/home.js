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
            function inviteFriendsFacebook(){
                $log.debug('inviteFriendsFacebook');
                FacebookService.inviteFriendsFacebook();
            }
            function shareFacebook(){
                var content={
                    name: FlipConstants.contentShare[Math.floor(Math.random()*FlipConstants.contentShare.length)],
                    caption: '2xFlip Available for Android and iOS',
                    description: 'Are you ready for a challenge ?'
                };
                FacebookService.shareFacebook(content);
            }
        	function init(){
                vm.showLevels = showLevels;   
                vm.startGame = startGame;
                vm.showLevel = ''; 
                $rootScope.audios.game.pause();
                $rootScope.audios.menu.play({ playAudioWhenScreenIsLocked : false });
                if(!$rootScope.sound){
                    $rootScope.audios.menu.setVolume(0.0);
                }else{
                    $rootScope.audios.menu.setVolume(1.0);
                }
                _.delay(function(){
                    $scope.$apply(function(){
                        vm.showLogo = true;
                    });
                    if($rootScope.sound){
                        $rootScope.audios.logo.play();
                        $rootScope.audios.menu.setVolume(0.4);
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
                vm.inviteFriendsFacebook  = inviteFriendsFacebook;
                vm.shareFacebook  = shareFacebook;
                vm.scoreFlash  = ProfileService.getBestScoreFlash();
        	}
        	init();
        }
    ]);
