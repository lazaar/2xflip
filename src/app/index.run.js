(function () {
    'use strict';

    angular
        .module('xflip')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log, $state) {

        $log.debug('run');
		  document.addEventListener('backbutton', function(e){
		  	e.preventDefault();
		  	goBack($state);
		  }, false);
    }
	function goBack($state) {
	    if($state.current.name==='home'){
	    	navigator.app.exitApp();
	    }
	    else{
	    	$state.go('home');
	    }
	}
})();
