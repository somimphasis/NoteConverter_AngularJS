// Try to center the header title without occluding the floating buttons

angular
    .module('app')
    .directive('actionBar', function ($timeout, $window) {

        return {
            restrict: 'A',           
            link: function (scope, element, attrs) {
                var calc = function () {
                    $timeout(function () {
                        var headerDiv = element;
                        var leftDiv = headerDiv.find('.header-left');
                        var rightDiv = headerDiv.find('.header-right');
                        var middleDiv = headerDiv.find('.header-middle');

                        var totalWidth = headerDiv.width();
                        var mid = totalWidth / 2;

                        var leftSpace = mid - leftDiv.width();
                        var rightSpace = mid - rightDiv.width();

                        var min = Math.min(leftSpace, rightSpace);
                        var w = min * 2;
                        middleDiv.css('width', w + 'px');
                    }, 100);
                }

                calc();

                angular.element($window).on('resize', calc);
                scope.$on('$destroy', function () {
                    angular.element($window).off('resize', calc);
                });
            }
        }
    });
