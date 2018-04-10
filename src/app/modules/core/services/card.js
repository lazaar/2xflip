'use strict';

/**
 * @ngdoc object
 * @name core.Services.cardService
 * @description cardService
 */
angular
    .module('core')
    .factory('CardService', ['$rootScope',
        function($rootScope) {
            function generateCard(max){
                var result, random = Math.random();

                if (random <= 0.34) { // 34% --> ramdon number
                  result = Math.pow(2,Math.floor(random * 1/0.34 * (Math.log(max)/Math.log(2)-1)));
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
                if(cards[index].state !== 'hide' && cards[index].state !=='showAll'){
                    cards[index].state = 'hide';
                }
            }

            function hideAll(cards){
                cards.forEach(function(card){
                    if(card.state !=='none'){
                        card.state = 'hide';
                    }
                });
                if($rootScope.sound){
                    $rootScope.audios.flip.play();
                     $rootScope.audios.flip.volume = 0.4;
                }
            }

            function removeOne(cards, index){
                cards[index].state = 'none';
            }

            function showOne(cards, index){
                cards[index].state = 'show';
                if($rootScope.sound){
                    $rootScope.audios.flip.play();
                    $rootScope.audios.flip.volume = 0.4;
                }
            }

            function validNumber(values, newValue){
                var result = values.indexOf(newValue) === -1 && newValue !== 'X' && newValue !== 'J';
                if(result){
                    for (var i = 0; i < values.length; i++) {
                        if(result[i] ==='J'){
                            return false;
                        }
                        for (var j = i+1; j < values.length; j++) {
                            if(values[i] === values[j]){
                                return false;
                            }
                        }
                    }
                }

                return result;
            }

            function loadOne(cards, index, max){
                cards[index].value = -1;
                if(cards[index+1 % cards.length-1].state === 'showAll'){
                    cards[index].state = 'showAll';
                }
                else{
                    cards[index].state = 'load';
                }
                var newValue;
                var values = _.map(cards, 'value');
                do{
                    newValue = generateCard(max);
                }while(validNumber(values, newValue));
                setValue(cards, index, newValue);
            }
            function showAll(cards){
                cards.forEach(function(card){
                    card.state = 'showAll';
                });
                if($rootScope.sound){
                    $rootScope.audios.flip.play();
                    $rootScope.audios.flip.volume = 0.4;
                }
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
                    if(cards[index2].value === 'J'){
                      return 2*max;  
                    } 
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
                validNumber   : validNumber,
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
