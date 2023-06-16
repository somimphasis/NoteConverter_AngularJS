
    angular
        .module('app')
        .directive('ngTap', ngTap)
        .directive('ngTapClick', function ($rootScope, $window, $parse, device) {

            return {
                restrict: 'A',
                scope: {
                    ngTapClick: '&'
                },
                link: function (scope, element, attrs) {
                                        
                    if (!device.isThirdGenBrowser && device.generation >= 9.0) {
                        element.on('tap', function (e) {
                            scope.ngTapClick({ $event: e });
                        });
                    }
                    else {
                        element.on('click', function (e) {
                            scope.$apply(scope.ngTapClick({ $event: e }));
                        });
                    }
                }
            };
        });

    function ngTap($rootScope, $window, $parse) {
        var directive = {
            link: link,
            restrict: 'A',
            priority: 1
        };

        return directive;

        function link(scope, element, attrs) {
            var vmAction = $parse(attrs.ngTap);

            element[0].addEventListener('tap', function (e) {
                if (!element.hasClass("disabled")) {
                    if (!scope.$$phase) {
                        scope.$apply(function (s) {
                            vmAction(s, { $event: e });
                        });
                    }
                    else {
                        scope.$applyAsync(function (s) {
                            vmAction(s, { $event: e });
                        });
                    }
                }
            }, false);
        }
    }