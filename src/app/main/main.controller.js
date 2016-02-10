(function () {
    'use strict';

    angular
        .module('xflip')
        //Controleur qui gere les differentes action sur la page principale
        .controller('MainController', function ($state, ProfileService, FlipConstants, $scope, $rootScope, ngAudio) {

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
                ProfileService.setSoundState($rootScope.sound );
                $rootScope.audios.menu.setMuting(!$rootScope.sound);
            }
            function clickSound(){
                if($rootScope.sound){
                    $rootScope.audios.click.play();
                    $rootScope.audios.click.volume = 0.3;
                }
            }
            function init(){ 
                vm.goToState = goToState;
                vm.closeGift = closeGift;
                vm.keepInGame = keepInGame;
                vm.clickSound = clickSound;
                vm.close = close;
                $rootScope.audios = {
                    menu: ngAudio.load('assets/sounds/menu.mp3'),
                    flip: ngAudio.load('assets/sounds/flap.ogg'),
                    logo: ngAudio.load('assets/sounds/flag.mp3'),
                    click: ngAudio.load('assets/sounds/click.ogg'),
                    game: ngAudio.load('assets/sounds/game.wav'),
                    over: ngAudio.load('assets/sounds/over.wav'),
                    bip: ngAudio.load('assets/sounds/bip.wav')
                };
                $rootScope.toggleSound = toggleSound;
                $rootScope.sound = ProfileService.getSoundState()==='true';
                gift();
        	}
        	init();
            
        });

})();