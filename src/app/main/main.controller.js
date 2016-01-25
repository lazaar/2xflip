(function () {
    'use strict';

    angular
        .module('xflip')
        //Controleur qui gere les differentes action sur la page principale
        .controller('MainController', function ($state, ProfileService, FlipConstants, $scope) {

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
			function close() {
			    navigator.app.exitApp();
			}

            function init(){  
                vm.goToState = goToState;
                vm.closeGift = closeGift;
                vm.close = close;
                gift();
        	}
        	init();
            
        });

})();