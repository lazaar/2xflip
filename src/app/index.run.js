(function () {
    'use strict';

    angular
        .module('xflip')
        .run(runBlock);

    /** @ngInject */
    function runBlock($log) {

        $log.debug('run');
    }
})();
