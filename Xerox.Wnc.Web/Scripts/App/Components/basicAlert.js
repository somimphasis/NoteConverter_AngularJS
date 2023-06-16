(function () {
    'use strict';

    angular
        .module('app')
        .component('basicAlert',
            {
                bindings: {
                    resolve: '<',
                    close: '&',
                    dismiss: '&'
                },
                templateUrl: 'Scripts/App/Components/basicAlert.html'
            });
})();