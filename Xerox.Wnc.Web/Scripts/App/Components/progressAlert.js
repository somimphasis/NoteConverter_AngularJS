(function () {
    'use strict';

    angular
        .module('app')
        .component('progressAlert',
            {
                bindings: {
                    resolve: '<',
                    close: '&',
                    dismiss: '&'
                },
                templateUrl: 'Scripts/App/Components/progressAlert.html'
            });
})();