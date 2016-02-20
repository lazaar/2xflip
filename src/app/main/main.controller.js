(function () {
    'use strict';

    angular
        .module('xflip')
        //Controleur qui gere les differentes action sur la page principale
        .controller('MainController', function ($state, ProfileService, FlipConstants, $scope, $rootScope) {

            var vm = this;

            function goToState(to, params){
                $state.go(to, params); 
            }
            function gift(){
                var lastDate = ProfileService.getLastDate(), 
                today = new Date().toDateString();
                if(lastDate !== today){
                    var giftGen = FlipConstants.gift[ProfileService.generateGift()];
                    vm.gift = giftGen.slug;
                    ProfileService.propertyIncrement(giftGen.localStorage);
                    ProfileService.setLastDate(today);
                    _.delay(function(){
                        $scope.$apply(function(){
                            vm.giftModal = true;
                        });
                    }, 700);
                }

            }
            function closeGift(){
                vm.giftModal = false;
            }
			function close(notSure) {
                if(notSure){
                     navigator.app.exitApp();
                }
                else{
                    $rootScope.exit =true;
                }
			}
            function keepInGame(){
                $rootScope.exit =false;
            }
            function toggleSound(){
                $rootScope.sound = !$rootScope.sound;
                ProfileService.setSoundState($rootScope.sound);
                if(!$rootScope.sound){
                    $rootScope.audios.menu.setVolume(0.0);
                }else{
                    $rootScope.audios.menu.setVolume(1.0);
                }
            }
            function clickSound(){
                if($rootScope.sound){
                    $rootScope.audios.click.play();
                    $rootScope.audios.click.setVolume(0.3);
                }
            }
            function init(){ 
                vm.goToState = goToState;
                vm.closeGift = closeGift;
                vm.keepInGame = keepInGame;
                vm.clickSound = clickSound;
                vm.close = close;
                $rootScope.isOldVersion =false;
                $rootScope.userName = 'Log in'; 
                $rootScope.userImg = ''; 
                $rootScope.giftFacebook = ''; 
                /* jshint ignore:start */
                var path='';
                    if(!!window.cordova && device.platform ==='Android'){
                        path='/android_asset/www/';
                    }
                    $rootScope.audios = {
                        menu: new Media(path + 'assets/sounds/menu.mp3', function(){}, function () {}, function(status){
                             if( status==Media.MEDIA_STOPPED && !$rootScope.isPaused)  {
                               $rootScope.audios.menu.play();
                            }
                        }),
                        flip: new Media(path + 'assets/sounds/flap.mp3'),
                        logo: new Media(path + 'assets/sounds/flag.mp3'),
                        click: new Media(path + 'assets/sounds/click.mp3'),
                        game: new Media(path + 'assets/sounds/game.wav', function(){}, function(){}, function(status){
                             if( status==Media.MEDIA_STOPPED && !$rootScope.isPaused) {
                                $rootScope.audios.game.play();
                            }
                        }),
                        over: new Media(path + 'assets/sounds/over.wav'),
                        bip: new Media(path + 'assets/sounds/bip.wav')
                    };
                /* jshint ignore:end */
                $rootScope.toggleSound = toggleSound;
                $rootScope.sound = ProfileService.getSoundState()==='true';
                gift();
                if(!!window.cordova && device.platform ==='Android'){//jshint ignore:line
                    $rootScope.platformSlug ='Android';
                }               
                else if(!!window.cordova && device.platform ==='iOS'){//jshint ignore:line
                    $rootScope.platformSlug ='ios';
                }
                navigator.splashscreen.hide();

                if (typeof window.cordova === 'object') {
                    document.addEventListener('pause', function () {
                        $rootScope.audios.menu.pause();
                        $rootScope.audios.game.pause();
                        $rootScope.isPaused = true;
                    }, false);
                    document.addEventListener('resume', function () {
                        $rootScope.isPaused = false;
                        if($state.current.name === 'home' || $state.current.name === 'howToPlay'){
                            $rootScope.audios.menu.play();
                            if(!$rootScope.sound){
                                $rootScope.audios.menu.setVolume(0.0);
                            }else{
                                $rootScope.audios.menu.setVolume(1.0);
                            }
                        }
                        else if($state.current.name === 'simple' || $state.current.name === 'flash'){
                            $rootScope.audios.game.play();
                            if(!$rootScope.sound){
                                $rootScope.audios.game.setVolume(0.0);
                            }else{
                                $rootScope.audios.game.setVolume(1.0);
                            }
                        }
                    }, false);
                }
        	}
        	init();
            
        });

})();