(function () {
    'use strict';

    angular
        .module('xflip')
        .config(config)
        .config(routes);

    /**
     * Configuration generale de l'application xflip
     * @param $logProvider
     */
    function config($logProvider, configConstantes, FlipConstants, admobSvcProvider) {

        // Enable configConstantes
        $logProvider.debugEnabled(configConstantes.logDebug);
         var admobid = (/(android)/i.test(navigator.userAgent)) ? FlipConstants.admob.android : FlipConstants.admob.ios;

         admobSvcProvider.setOptions({
            publisherId:          admobid.banner,
            interstitialAdId:     admobid.inter,
            autoShowInterstitial : false
          });

    }

    /**
     * Definition des routes de l'application
     * @param $stateProvider
     * @param $urlRouterProvider
     */
    function routes($stateProvider, $urlRouterProvider) {

        //@TODO : Completer la liste de toutes les routes et assigner les controleurs
        $urlRouterProvider.otherwise('/');


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
                    templateUrl: 'app/modules/core/views/home.html',
                    controller: 'HomeController as vm'
                })
                .state('simple', {
                    url: '/simple/:mode',
                    templateUrl: 'app/modules/core/views/play.html',
                    controller: 'PlayController as vm'
                })
                .state('flash', {
                    url: '/flash/:mode',
                    templateUrl: 'app/modules/core/views/flash.html',
                    controller: 'FlashController as vm'
                })
                .state('howToPlay', {
                    url: '/howToPlay',
                    templateUrl: 'app/modules/core/views/howToPlay.html'
                });
    }
})();
