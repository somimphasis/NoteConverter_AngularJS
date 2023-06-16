angular
    .module('app')
    .component('alertBanner',
        {
            templateUrl: 'Scripts/App/Components/alertBanner.html',
            bindings: {
                resolve: '<',
                close: '&',
                dismiss: '&'
            }
        });