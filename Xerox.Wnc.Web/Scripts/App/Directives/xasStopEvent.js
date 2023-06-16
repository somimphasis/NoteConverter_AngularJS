
    angular
        .module('app')
        .directive('xasStopEvent', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    element.bind('tap', function (e) {
                        if(e.target === this)
                            e.stopPropagation();
                    });
                    element.bind('click', function (e) {
                        if (e.target === this)
                            e.stopPropagation();
                    });
                }
            };
        });