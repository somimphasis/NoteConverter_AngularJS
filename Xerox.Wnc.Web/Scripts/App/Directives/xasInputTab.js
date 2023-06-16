// Copyright © 2019 Xerox Corporation. All Rights Reserved.
angular
        .module('app')
        .directive('xasInputTab', xasInputTab);

    function xasInputTab() {
        // Usage:
        //     <element xasInputTab><\element>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A',
            //transclude: true,
            scope: {
                preventSubmit : '<'
            }
        };
        return directive;

        function link(scope, element, attrs) {

            var onKeyPress = function (e) {
                if (e.keyCode == '13') //user pressed enter key
                {
                    var focusedIndex = -1;
                    var textInputs = element.find("input[type=text], input[type=email], input[type=password]");
                    var focusedInput = document.activeElement;
                    if (focusedInput) {
                        focusedIndex = _.findIndex(textInputs, function (textInput) {
                            return textInput.id === focusedInput.id;
                        });

                        //element in focus is an input field
                        if (focusedIndex > -1) {
                            // If Focused Input is invalid and touched, then dont navigate, but blur to and reselect to display error
                            if ($(focusedInput).hasClass("ng-invalid") && $(focusedInput).hasClass("ng-not-empty")) {
                                focusedInput.blur();
                                $(focusedInput).closest('text-field').trigger('tap');
                                e.preventDefault();
                            } //else
                            if (focusedIndex < textInputs.length - 1) {
                                $(textInputs[focusedIndex + 1]).closest('text-field').trigger('tap'); //set next input element to focus
                                e.preventDefault(); //prevent submission
                            }
                            else {
                                //last element was in focus, dismiss the keyboard
                                textInputs[focusedIndex].blur();
                                if (typeof EIP_CloseEmbeddedKeyboard == 'function') {
                                    EIP_CloseEmbeddedKeyboard();
                                }

                                if (scope.preventSubmit)
                                    e.preventDefault();
                            }
                        }
                    }
                }
            }

            angular.element(element).on("keypress", onKeyPress);

            scope.$on('$destroy', function () {
                angular.element(element).off('keypress', onKeyPress);
            });
        }
    }

