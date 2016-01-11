
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

 