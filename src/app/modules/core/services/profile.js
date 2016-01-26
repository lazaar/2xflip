
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
            function generateGift(){
                return Math.floor(Math.random() * (FlipConstants.gift.length));
            }
            function initLocalStorage(){
                localStorage.setItem(FlipConstants.localStorage.showAll, FlipConstants.init.showAllHelp);
                localStorage.setItem(FlipConstants.localStorage.hearts, FlipConstants.init.heartsHelp);
                localStorage.setItem(FlipConstants.localStorage.showOne, FlipConstants.init.showOneHelp);
                localStorage.setItem(FlipConstants.localStorage.bestScore, 0);
                localStorage.setItem(FlipConstants.localStorage.bestScoreFlash, 0);
                localStorage.setItem(FlipConstants.localStorage.lastDate, new Date().toDateString());
            }
            function propertyDecrement(name){
                localStorage.setItem(_.result(FlipConstants.localStorage, name, ''), getProperty(name)-1);
            }
            function propertyIncrement(name){
                localStorage.setItem(_.result(FlipConstants.localStorage, name, ''), getProperty(name)+1);
            }
            function getProperty(name){
                return parseInt(localStorage.getItem(_.result(FlipConstants.localStorage, name, '')));
            }
           function setBestScore(newScore){
                localStorage.setItem(FlipConstants.localStorage.bestScore, newScore);
           }
           function getBestScore(){
                return parseInt(localStorage.getItem(FlipConstants.localStorage.bestScore)) || 0;
           }
           function setBestScoreFlash(newScore){
                localStorage.setItem(FlipConstants.localStorage.bestScoreFlash, newScore);
           }
           function getBestScoreFlash(){
                return parseInt(localStorage.getItem(FlipConstants.localStorage.bestScoreFlash)) || 0;
           }

           function setLastDate(newDate){
                localStorage.setItem(FlipConstants.localStorage.lastDate, newDate);
           }
           function getLastDate(){
                return localStorage.getItem(FlipConstants.localStorage.lastDate) || new Date().toDateString();
           }
           function getSoundState(){
                return localStorage.getItem(FlipConstants.localStorage.sound) || true;
           }
            function setSoundState(value){
                localStorage.setItem(FlipConstants.localStorage.sound, value);
           }
            return {
                isFirstUse   : isFirstUse,
                initLocalStorage   : initLocalStorage,
                setBestScore   : setBestScore,
                setBestScoreFlash   : setBestScoreFlash,
                getBestScore          : getBestScore,
                getBestScoreFlash          : getBestScoreFlash,
                getProperty          : getProperty,
                getLastDate          : getLastDate,
                setLastDate          : setLastDate,
                propertyDecrement          : propertyDecrement,
                propertyIncrement          : propertyIncrement,
                getSoundState          : getSoundState,
                setSoundState          : setSoundState,
                generateGift          : generateGift
            };
        }
    ]);

 