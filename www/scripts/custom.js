'use strict';
var ApplicationConfiguration = (function() {
    var applicationModuleName = 'angularjsapp';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngAnimate', 
        'ngTouch', 
        'ngSanitize', 
        'ui.router',
        'ui.bootstrap',
        'ui.utils'
    ];
    var registerModule = function(moduleName) {
        angular
            .module(moduleName, []);
        angular
            .module(applicationModuleName)
            .requires
            .push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();

'use strict';

angular
    .module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

angular
    .module(ApplicationConfiguration.applicationModuleName)
    .config(['$locationProvider',
        function($locationProvider) {
            $locationProvider.hashPrefix('!');
        }
    ]);
angular
    .element(document)
    .ready(function() {
        if (window.location.hash === '#_=_') {
            window.location.hash = '#!';
        }
        angular
            .bootstrap(document,
                [ApplicationConfiguration.applicationModuleName]);
    });

'use strict';

ApplicationConfiguration.registerModule('core');

'use strict';

angular
    .module('core')
    .config(['$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/');

                        $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'modules/core/views/home.html',
                    controller: 'HomeController as vm'
                })
                .state('simple', {
                    url: '/simple/:mode',
                    templateUrl: 'modules/core/views/play.html',
                    controller: 'PlayController as vm'
                })
                .state('flash', {
                    url: '/flash/:mode',
                    templateUrl: 'modules/core/views/flash.html',
                    controller: 'FlashController as vm'
                });
        }
    ]);
'use strict';

/**
 * @ngdoc object
 * @name core.Services.cardService
 * @description cardService
 */
angular
    .module('core')
    .factory('CardService', [
        function() {
            function generateCard(max){
                var result, random = Math.random();

                if (random <= 0.34) { // 34% --> ramdon number
                  result = Math.pow(2,Math.floor(random * 1/0.34 * (Math.log2(max)-1)));
                }else if (random <= 0.59) { // 25% --> 1
                  result = 1;
                } else if (random <= 0.84) { // 25% --> 2
                  result = 2;
                } else if(random <= 0.92){ // 8% --> Joker
                  result = 'J';
                }
                else{ // 8% --> Shuffle
                  result = 'X';
                }
                return result;
            }
            function shuffleCard(array, index){
                  var currentIndex = array.length, temporaryValue, randomIndex, newIndex=index;

                  // While there remain elements to shuffle...
                  while (0 !== currentIndex) {
                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;

                    // And swap it with the current element.
                    temporaryValue = array[currentIndex].value;
                    array[currentIndex].value = array[randomIndex].value;
                    array[randomIndex].value = temporaryValue;
                    if(currentIndex === newIndex){
                        newIndex = randomIndex;
                    }
                    else if(randomIndex === newIndex){
                        newIndex = currentIndex;
                    } 
                  }
                 return newIndex;
            }
            function hideOne(cards, index){
                if(cards[index].state !== 'hide'){
                    cards[index].state = 'hide';
                }
            }

            function hideAll(cards){
                cards.forEach(function(card){
                    if(card.state !=='none'){
                        card.state = 'hide';
                    }
                });
            }

            function removeOne(cards, index){
                cards[index].state = 'none';
            }

            function showOne(cards, index){
                cards[index].state = 'show';
            }

            function loadOne(cards, index, max){
                cards[index].state = 'load';
                setValue(cards, index, generateCard(max));
            }
            function showAll(cards){
                cards.forEach(function(card){
                    card.state = 'show';
                });
            }
            function removeAll(cards){
                cards.forEach(function(card){
                    card.state = 'none';
                });
            }
            function setValue(cards, index, value){
                cards[index].value = value;
            }

            function compareTwoCards(cards, index1, index2, max){
                if(cards[index1].value === 'J'){
                    if(cards[index2].value === 'J') return 2*max;
                    return 2*cards[index2].value;  
                } 
                else if(cards[index2].value === 'J'){
                  return 2*cards[index1].value;  
                } 
                if(cards[index1].value === cards[index2].value){
                    return 2*cards[index1].value;
                }
                return -1;
            }

            return {
                generateCard   : generateCard,
                shuffleCard   : shuffleCard,
                hideOne   : hideOne,
                hideAll   : hideAll,
                removeOne   : removeOne,
                removeAll   : removeAll,
                showOne   : showOne,
                loadOne   : loadOne,
                showAll   : showAll,
                setValue   : setValue,
                compareTwoCards   : compareTwoCards
            };
        }
    ]);

'use strict';

/**
 * @ngdoc object
 * @name core.Services.cardService
 * @description cardService
 */
angular
    .module('core')
    .factory('ProfileService', ['FlipConstants',
        function(FlipConstants) {
            function isFirstUse(){
                return !localStorage.getItem(FlipConstants.localStorage.showAll);
            }
            function initLocalStorage(){
                localStorage.setItem(FlipConstants.localStorage.showAll, FlipConstants.init.showAllHelp);
                localStorage.setItem(FlipConstants.localStorage.hearts, FlipConstants.init.heartsHelp);
                localStorage.setItem(FlipConstants.localStorage.showOne, FlipConstants.init.showOneHelp);
                localStorage.setItem(FlipConstants.localStorage.bestScore, 0);
            }
            function propertyDecrement(name){
                localStorage.setItem(_.result(FlipConstants.localStorage, name, ''), getProperty(name)-1);
            }
            function getProperty(name){
                return parseInt(localStorage.getItem(_.result(FlipConstants.localStorage, name, '')));
            }
           function setBestScore(newScore){
                localStorage.setItem(FlipConstants.localStorage.bestScore, newScore);
           }
           function getBestScore(){
                return parseInt(localStorage.getItem(FlipConstants.localStorage.bestScore));
           }
            return {
                isFirstUse   : isFirstUse,
                initLocalStorage   : initLocalStorage,
                setBestScore   : setBestScore,
                getBestScore          : getBestScore,
                getProperty          : getProperty,
                propertyDecrement          : propertyDecrement
            };
        }
    ]);

'use strict';

/**
 * @ngdoc object
 * @name core.constantes
 * @description Constantes du projet
 */
angular
    .module('core')
    .constant('FlipConstants', {
        init:{
            hearts : 3,
            initValue : 1,
            showAllHelp : 2,
            showOneHelp : 2,
            heartsHelp : 2,
        },
        delay:{
            firstShowDelay : 60,
            firstHideAll : 300,
            removeCardOnsuccess : 400,
            generateCardOnsuccess : 400,
            hideOnsuccess : 400,
            hideOnError : 800,
            showAllShuffle : 800,
            hideAllShuffle : 1200,
            showAllDiamonds:2000
        },
        mode:{
            easy:3,
            medium:4,
            hard:5
        },
        localStorage:{
            bestScore:'bestScore',
            hearts:'hearts',
            showOne:'showOne',
            showAll:'showAll',
        }

      
    });
 
'use strict';

angular
    .module('core')
    .controller('HomeController', ['$scope','$rootScope', '$state','ProfileService',
        function($scope, $rootScope, $state, ProfileService) {
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
                }, 500)
            }
        	function init(){  
                $rootScope.goToState = goToState;       
                vm.showLevels = showLevels;   
                vm.startGame = startGame;   
                vm.showLevel = '';    
                _.delay(function(){
                    $scope.$apply(function(){
                        vm.showLogo = true;
                    })
                }, 500);
                if(ProfileService.isFirstUse()){
                    firstUse();
                }

                vm.score  = ProfileService.getBestScore();
        	}
        	init();
        }
    ]);

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
                            ProfileService.setBestScore(vm.score);
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
'use strict';

/**
 * @ngdoc object
 * @name core.Controllers.PlayController
 * @description Play controller
 * @requires ng.$scope
 */
angular
    .module('core')
    .controller('FlashController', ['$scope','$state','CardService','FlipConstants','ProfileService',
        function($scope,$state, CardService, FlipConstants, ProfileService) {
            var vm = this, opened=-1, triggerEvent = true, max=1, noClick=true, highScore, seconds;


            function cardClicked(index){  
                if(seconds===60)             {
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
                    delay = FlipConstants.delay.hideOnError;
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

            function initCountDown(first){
                if(first){
                    vm.count = {min: '00', s:59};
                    seconds=59;
                }
                  seconds--;
                  if(seconds<10){
                    vm.timeLeft = true;
                    $scope.$apply();
                  }
                  if (seconds < 0) {
                    vm.lose=true;
                    $scope.$apply();
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
            function init(){
                var mode = $state.params.mode;
                vm.mode= {name :mode, cards: _.result(FlipConstants.mode,mode,'')}
                vm.cardClicked = cardClicked;
                vm.cards = [];
                vm.score = 0;
                vm.lose = false;
                seconds=60;
                vm.timeLeft = false;
                vm.TitleScore ='score';
                max=1;
                vm.count = {min: '01', s:0};
                highScore = ProfileService.getBestScore();

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