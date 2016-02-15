'use strict';

/**
 * @ngdoc object
 * @name core.constantes
 * @description Constantes du projet
 */
angular
    .module('core')
    .constant('FlipConstants', {
        FACEBOOK_APP_ID : '710594159019157',
        sharePicture:'https://lh3.googleusercontent.com/-NLrQAWucQKk/VsERBdxKB9I/AAAAAAAABQE/Nuq0kHx9XgU/s346/tmp.png',
        init:{
            hearts : 3,
            initValue : 1,
            showAllHelp : 2,
            showOneHelp : 2,
            heartsHelp : 2,
        },
        contentShare:[
            '2xFlip - I really like this game',
            'Exercise Your Brain with 2xFlip',
            '2xFlip - Test and practice your visual memory skills',
            '2xFlip a game you should play :)'
        ],
        admob:{
            android:{
                banner:'ca-app-pub-3935970661666157/9216170826',
                inter:'ca-app-pub-3935970661666157/8407088821'
            },
            ios:{
                banner:'ca-app-pub-3935970661666157/7145444824',
                inter:'ca-app-pub-3935970661666157/8622178028'
            },
            frequence:{
                homeBanner: 0.8,
                playBanner: 0.5,
                flashBanner: 0.5,
                homeInter: 0.2,
                playInter: 0.66,
                flashInter: 0.66
            }
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
        gift:[
            {
                id:1,
                name:'showAllDiamonds',
                localStorage:'showAll',
                slug:'Show All Diamonds'
            },
            {
                id:2,
                name:'showOneDiamonds',
                localStorage:'showOne',
                slug:'Show One Diamonds'
            },
            {
                id:3,
                name:'HeartsDiamonds',
                localStorage:'hearts',
                slug:'Hearts Diamonds'
            }
        ],
        mode:{
            easy:3,
            medium:4,
            hard:5
        },
        localStorage:{
            facebookUser:'facebookUser',
            facebookModalDate:'facebookModalDate',
            bestScore:'bestScore',
            bestScoreFlash:'bestScoreFlash',
            hearts:'hearts',
            showOne:'showOne',
            showAll:'showAll',
            sound:'sound',
            lastDate:'lastDate'
        }

      
    });