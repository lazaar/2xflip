(function () {
    'use strict';

    angular
        .module('xflip')
        //Controleur qui gere les differentes action sur la page principale
        .controller('MainController', function ($scope) {

            $scope.test = 'From Main controller Label';
            
        });

})();
