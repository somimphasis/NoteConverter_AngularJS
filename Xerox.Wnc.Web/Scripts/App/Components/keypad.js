﻿angular
    .module('app')
    .component('keypad',
        {
            templateUrl: 'Scripts/App/Components/keypad.html',
            bindings: {
                resolve: '<',
                close: '&',
                dismiss: '&'
            },
            controller: function (modalService) {
                var $ctrl = this;

                $ctrl.value = "1";
                $ctrl.max = 9999;
                $ctrl.override = true;

                $ctrl.$onInit = function () {
                    $ctrl.value = $ctrl.resolve.data.value.toString();
                    angular.element('#valueBox').focus();
                };

                $ctrl.validate = function () {
                    return parseInt($ctrl.value) <= $ctrl.max;
                };

                $ctrl.keypadPressed = function (value) {
                    if ($ctrl.override) {
                        $ctrl.value = "";
                        $ctrl.override = false;
                    }

                    if ($ctrl.value.length === 4 && parseInt($ctrl.value) === 0) {
                        $ctrl.delete();
                    }

                    $ctrl.value += value;

                    if (!$ctrl.validate()) {
                        $ctrl.showError();
                        $ctrl.value = "9999";
                        $ctrl.override = true;
                    }

                    if ($ctrl.value.length === 5) {
                        $ctrl.delete();
                    }
                };

                $ctrl.delete = function () {
                    $ctrl.value = $ctrl.value.substring(0, $ctrl.value.length - 1);
                    angular.element('#valueBox').focus();
                };

                $ctrl.clear = function () {
                    $ctrl.value = "1";
                    $ctrl.override = true;
                };

                $ctrl.update = function () {
                    if (parseInt($ctrl.value) === 0) {
                        $ctrl.value = "1";
                    }

                    $ctrl.close({ $value: parseInt($ctrl.value) });
                };

                $ctrl.showError = function (message) {
                    if (!message) {
                        message = "SDE_QUANTITY_CANNOT_BE";
                    }

                    modalService.showAlertBanner(message);
                };
            }
        });