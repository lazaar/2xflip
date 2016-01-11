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