'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.PlayController
 * @description Play controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('FlashController', ['$scope','$state','FacebookService','$q','CardService','FlipConstants','ProfileService','$rootScope','admobSvc',
        function($scope,$state, FacebookService, $q, CardService, FlipConstants, ProfileService, $rootScope, admobSvc) {
        	var vm = this, opened=-1, triggerEvent = true, max=1, noClick=true, highScore, seconds;
            var postTitle;

            function cardClicked(index){  
                if(seconds===60){
                    initCountDown(true);
                }
                if(triggerEvent && noClick){  
                    CardService.showOne(vm.cards, index);
                    if(vm.cards[index].value === 'X'){
                        noClick = false;
                        triggerEvent = false;
                        var newIndex =0;
                        var delay = FlipConstants.delay.removeCardOnsuccess;
                        _.delay(function(){
                            CardService.showAll(vm.cards);
                            $scope.$apply();
                        }, delay);

                        delay += FlipConstants.delay.showAllShuffle;
                        _.delay(function(){
                            newIndex = CardService.shuffleCard(vm.cards, index);
                            $scope.$apply();
                        }, delay);

                        delay += FlipConstants.delay.removeCardOnsuccess;
                        _.delay(function(){
                            CardService.removeOne(vm.cards, newIndex);
                            $scope.$apply();
                        }, delay);

                        delay += FlipConstants.delay.generateCardOnsuccess;
                        _.delay(function(){
                            vm.cards[newIndex].state = 'load'; 
                            if(max > 1){
                                vm.cards[newIndex].value = max/2;
                            }
                            $scope.$apply();
                        }, delay);

                        delay += FlipConstants.delay.hideAllShuffle;
                        _.delay(function(){
                            CardService.hideAll(vm.cards);
                            noClick = true;
                            triggerEvent = true;
                            opened=-1;
                            $scope.$apply();
                        }, delay);

                    }
                    else if(opened === -1){
                        opened = index;
                    }
                    else if(opened !== index){
                        triggerEvent = false;
                        secondCardClicked(opened, index);
                    } 
                }
                else if(noClick){
                    CardService.hideAll(vm.cards);
                    triggerEvent = true;
                    opened=-1;
                    cardClicked(index);
                }
            }
        	
            function secondCardClicked(index1, index2){
                var newValue = CardService.compareTwoCards(vm.cards, index1, index2, max), delay;
                if(newValue !== -1){
                    _.delay(function(){
                        CardService.removeOne(vm.cards, index1);
                        vm.score += newValue;
                        if(vm.score > highScore){
                            vm.TitleScore ='A new High score';
                        }
                        CardService.setValue(vm.cards, index2, newValue);

                        if(vm.cards[index1].notif !==''){
                            seconds += vm.cards[index1].notif;
                        }
                        if(vm.cards[index2].notif !==''){
                            seconds += vm.cards[index2].notif;
                            vm.cards[index2].notif = '';
                        }
                        if(seconds > 60){
                          seconds=60;  
                        } 
                        $scope.$apply();
                        if(newValue > max){
                            max = newValue;
                        }

                    }, FlipConstants.delay.removeCardOnsuccess);

                    _.delay(function(){
                        CardService.loadOne(vm.cards, index1, max);
                        vm.cards[index1].notif = '';  
                        if(seconds < 50){                        
                            var random = Math.random();
                            if (random <= 0.15) {
                                vm.cards[index1].notif = 2;
                            }
                            else if(random <= 0.25){
                                vm.cards[index1].notif = 5;
                            }
                            else if(random <= 0.30){
                                vm.cards[index1].notif = 10;
                            }
                        }
                        $scope.$apply();
                    }, FlipConstants.delay.removeCardOnsuccess + FlipConstants.delay.generateCardOnsuccess);
                    delay = FlipConstants.delay.hideOnsuccess + FlipConstants.delay.removeCardOnsuccess + FlipConstants.delay.generateCardOnsuccess;
                } 
                else{
                    delay = FlipConstants.delay.hideOnError;
                }
                _.delay(function(){
                    CardService.hideOne(vm.cards, index2);
                    CardService.hideOne(vm.cards, index1);
                    if(opened === index1){
                        opened=-1;
                    }
                    triggerEvent = true;
                    $scope.$apply();
                }, delay);
            }

            function initCountDown(first){
                if($state.current.name!=='flash'){
                    return;
                }
                if(first){
                    vm.count = {min: '00', s:59};
                    seconds=59;
                }
                  seconds--;
                  if(seconds<10){
                    vm.timeLeft = true;
                    $scope.$apply();
                    if(seconds<5){
                        if($rootScope.sound){
                            $rootScope.audios.bip.play();
                            $rootScope.audios.bip.setVolume(0.4);
                        }
                    }
                  }
                  if (seconds < 0) {
                    vm.lose=true;
                    if($rootScope.sound){
                        navigator.vibrate(200);
                    }
                    CardService.showAll(vm.cards);
                    if(Math.random()<FlipConstants.admob.frequence.flashInter){
                        _.delay(function(){
                            admobSvc.showInterstitialAd();
                        }, 500);
                    }
                    $scope.$apply();
                    postTitle = vm.score  + ' it\'s my new Flash score in 2xFlip';
                    if(vm.score > highScore){
                        ProfileService.setBestScoreFlash(vm.score);
                        vm.textShare ='Share your new high score';
                        postTitle = vm.score  + 'Yeah ! it\'s my new high score in Flash Mode';
                    }
                  }
                  else {
                    _.delay(function(){
                        vm.count.s =seconds;
                        vm.timeLeft = false;
                        $scope.$apply();
                        initCountDown(false);
                    }, 1000);
                  }
            }
            
            function shareFacebook(){
                var content={
                      name: postTitle,
                      caption: '2xFlip Available for Android and iOS',
                      description: 'Try to Beat my score :)'
                };
                FacebookService.shareFacebook(content);
            }
            function initAdmob(){
                if(Math.random()<FlipConstants.admob.frequence.flashBanner){
                    admobSvc.createBannerView();
                }
                else{
                    admobSvc.destroyBannerView();
                }
                admobSvc.requestInterstitialAd();
            }
        	function init(){
                initAdmob();
                vm.shareFacebook = shareFacebook;
                var mode = $state.params.mode;
                vm.mode= {name :mode, cards: _.result(FlipConstants.mode,mode,'')};
                vm.cardClicked = cardClicked;
                vm.cards = [];
                vm.score = 0;
                vm.lose = false;
                seconds=60;
                vm.timeLeft = false;
                vm.TitleScore ='score';
                vm.textShare ='Share your score';
                max=1;
                vm.count = {min: '01', s:0};
                highScore = ProfileService.getBestScoreFlash();
                if($rootScope.sound){
                    $rootScope.audios.menu.pause();
                    $rootScope.audios.game.play({ playAudioWhenScreenIsLocked : false });
                    $rootScope.audios.game.setVolume(0.3);
                }

                vm.heartsDiamonds = ProfileService.getProperty('hearts');
                var cardsTotal = Math.pow(vm.mode.cards,2);
                /* jshint ignore:start */
                for (var i = 0; i < cardsTotal; i++) {
                    _.delay(function(){
                        vm.cards.push( {value:FlipConstants.init.initValue, state:'show',  notif:''});
                        $scope.$apply();
                    }, i*FlipConstants.delay.firstShowDelay);
                }
                /* jshint ignore:end */
                _.delay(function(){
                    CardService.hideAll(vm.cards);
                    $scope.$apply();
                }, (FlipConstants.delay.firstShowDelay*cardsTotal + FlipConstants.delay.firstHideAll));
        	}
            vm.init = init;
        	init();
        }
    ]);