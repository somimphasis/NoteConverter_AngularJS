angular
    .module('app')
    .directive('numbersOnly', function () {
        return {
            require: ['ngModel', '^spinBox'],
            link: function (scope, element, attrs, controllers) {
                var modelCtrl = controllers[0];
                var min = controllers[1].min;
                var max = controllers[1].max;

                modelCtrl.$parsers.push(function (inputValue) {
                    if (inputValue === undefined) {
                        return '0';
                    }

                    // Don't allow non-numeric characters
                    var transformedInput = inputValue.replace(/[^0-9]/g, '');

                    // Make sure we have an actual number (default 0) and clamp to min/max bounds
                    transformedInput = parseInt(transformedInput || '0', 10);
                    transformedInput = Math.max(transformedInput, min);
                    transformedInput = Math.min(transformedInput, max);

                    // Set the view to be a string
                    modelCtrl.$setViewValue(transformedInput.toString());
                    modelCtrl.$render();

                    // Return a number for the model
                    return Number(transformedInput);
                });
            }
        };
    });