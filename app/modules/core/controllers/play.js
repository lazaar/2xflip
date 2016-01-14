'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.PlayController
 * @description Play controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('PlayController', ['$scope','$state','CardService','FlipConstants','ProfileService',
        function($scope,$state, CardService, FlipConstants, ProfileService) {
        	var vm = this, opened=-1, triggerEvent = true, max=1, noClick=true, highScore;


            function cardClicked(index){
                if(vm.showOne){
                    CardService.showOne(vm.cards, index);
                    vm.showOne=false;
                    noClick=false;
                    vm.showAll = false;
                    vm.infoWindow.show = false;
                    ProfileService.propertyDecrement('showOne');
                    vm.showOneDiamonds--;
                    _.delay(function(){
                        CardService.hideOne(vm.cards,index);
                        noClick=true;
                        $scope.$apply();
                    },  FlipConstants.delay.showAllDiamonds)
                }
                else{                  
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
                            }, delay)

                            delay += FlipConstants.delay.showAllShuffle;
                            _.delay(function(){
                                newIndex = CardService.shuffleCard(vm.cards, index);
                                $scope.$apply();
                            }, delay)

                            delay += FlipConstants.delay.removeCardOnsuccess;
                            _.delay(function(){
                                CardService.removeOne(vm.cards, newIndex);
                                $scope.$apply();
                            }, delay)

                            delay += FlipConstants.delay.generateCardOnsuccess;
                            _.delay(function(){
                                vm.cards[newIndex].state = 'load'; 
                                if(max > 1){
                                    vm.cards[newIndex].value = max/2;
                                }
                                $scope.$apply();
                            }, delay)

                            delay += FlipConstants.delay.hideAllShuffle;
                            _.delay(function(){
                                CardService.hideAll(vm.cards);
                                noClick = true;
                                triggerEvent = true;
                                opened=-1
                                $scope.$apply();
                            }, delay)

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
            }
        	
            function secondCardClicked(index1, index2){
                var newValue = CardService.compareTwoCards(vm.cards, index1, index2, max), delay;
                if(newValue !== -1){
                    _.delay(function(){
                        CardService.removeOne(vm.cards, index1);
                        vm.score += newValue;
                        if(vm.score > highScore){
                            vm.TitleScore ='A new High score'
                        }
                        CardService.setValue(vm.cards, index2, newValue);
                        $scope.$apply();
                        if(newValue > max){
                            max = newValue;
                        }
                    }, FlipConstants.delay.removeCardOnsuccess)
                    _.delay(function(){
                        CardService.loadOne(vm.cards, index1, max);
                        $scope.$apply();
                    }, FlipConstants.delay.removeCardOnsuccess + FlipConstants.delay.generateCardOnsuccess)
                    delay = FlipConstants.delay.hideOnsuccess + FlipConstants.delay.removeCardOnsuccess + FlipConstants.delay.generateCardOnsuccess;
                } 
                else{
                    vm.hearts--;
                    delay = FlipConstants.delay.hideOnError;
                    if(vm.hearts === 0){
                        vm.lose = true;
                        _.delay(function(){
                            CardService.showAll(vm.cards);
                            $scope.$apply();
                            if(vm.score > highScore){
                                ProfileService.setBestScore(vm.score);
                            }
                        }, 100)
                        delay = 0;
                    }
                }
                _.delay(function(){
                    CardService.hideOne(vm.cards, index2);
                    CardService.hideOne(vm.cards, index1);
                    if(opened === index1){
                        opened=-1;
                    }
                    triggerEvent = true
                    $scope.$apply();
                }, delay);
            }
            function showAllFct(isSure){
                if(vm.showAllDiamonds> 0){                
                    if(!isSure){
                        vm.showAll = true;
                    }
                    else{
                        CardService.showAll(vm.cards);
                        noClick=false;
                        vm.showAll = false;
                        ProfileService.propertyDecrement('showAll');
                        vm.showAllDiamonds--;
                        _.delay(function(){
                            CardService.hideAll(vm.cards);
                            noClick=true;
                            $scope.$apply();
                        },  FlipConstants.delay.showAllDiamonds)
                    }
                }
                else{
                    vm.infoWindow.show = true;
                    vm.infoWindow.content = 'No "Show All Diamonds" enaugh :( ';
                    _.delay(function(){
                        vm.infoWindow.show = false;
                        $scope.$apply();
                    },  2000)
                }
            }
            function showOneFct(){
                if(vm.showOneDiamonds> 0){  
                    vm.showOne = !vm.showOne;
                    vm.infoWindow.show = vm.showOne;
                    if(vm.showOne){
                        vm.infoWindow.content = 'Choose the card or tap the button again to desactivate it';
                    }
                }
                else{
                    vm.infoWindow.show = true;
                    vm.infoWindow.content = 'No "Show One Diamonds" enaugh :( ';
                    _.delay(function(){
                        vm.infoWindow.show = false;
                        $scope.$apply();
                    },  2000)
                }
            }
        	function init(){
                var mode = $state.params.mode;
                vm.mode= {name :mode, cards: _.result(FlipConstants.mode,mode,'')}
                vm.cardClicked = cardClicked;
                vm.showAllFct = showAllFct;
                vm.showOneFct = showOneFct;
                vm.cards = [];
                vm.infoWindow ={};
                vm.hearts = FlipConstants.init.hearts;
                vm.score = 0;
                vm.lose = false;
                vm.showAll = false;
                vm.showOne  = false;
                vm.TitleScore ='score';
                max=1;
                highScore = ProfileService.getBestScore();
                vm.showAllDiamonds = ProfileService.getProperty('showAll');
                vm.showOneDiamonds = ProfileService.getProperty('showOne');
                vm.heartsDiamonds = ProfileService.getProperty('hearts');
                var cardsTotal = Math.pow(vm.mode.cards,2);
                for (var i = 0; i < cardsTotal; i++) {
                    _.delay(function(){
                        vm.cards.push( {value:FlipConstants.init.initValue, state:'show'})
                        $scope.$apply();
                    }, i*FlipConstants.delay.firstShowDelay)
                };

                _.delay(function(){
                    CardService.hideAll(vm.cards);
                    $scope.$apply();
                }, (FlipConstants.delay.firstShowDelay*cardsTotal + FlipConstants.delay.firstHideAll))
        	}
            vm.init = init;
        	init();
        }
    ]);