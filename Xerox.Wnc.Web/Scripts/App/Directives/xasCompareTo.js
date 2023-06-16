// Copyright © 2019 Xerox Corporation. All Rights Reserved.

angular
    .module('app')
    .directive('xasCompareTo', function () {
        return {
            restrict: "A",
            require: "ngModel",
            scope: {
                otherModelValue: "=xasCompareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    });
