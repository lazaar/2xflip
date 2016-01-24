'use strict';

/**
 * @ngdoc object
 * @name core.config
 * @requires ng.$stateProvider
 * @requires ng.$urlRouterProvider
 * @description Defines the routes and other config within the core module
 */
angular
    .module('core')
    .config(['$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/');

            /**
             * @ngdoc event
             * @name core.config.route
             * @eventOf core.config
             * @description
             *
             * Define routes and the associated paths
             *
             * - When the path is `'/'`, route to home
             * */
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
                })
                .state('howToPlay', {
                    url: '/howToPlay',
                    templateUrl: 'modules/core/views/howToPlay.html'
                });
        }
    ]);
