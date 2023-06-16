// Copyright © 2019 Xerox Corporation. All Rights Reserved.
angular
    .module('app')
    .component('generalAlert',
        {
            bindings: {
                resolve: '<',
                close: '&',
                dismiss: '&'
            },
            templateUrl: 'Scripts/App/Components/generalAlert.html',
            controller: function ($scope, $element, $attrs, errorHandlerService) {

                var $ctrl = this;
                $ctrl.$onInit = function () {
                    $ctrl.title = $ctrl.resolve.data.title;
                    $ctrl.additionalInfo = $ctrl.resolve.data.additionalInfo;
                    $ctrl.additionalInfo2 = $ctrl.resolve.data.additionalInfo2;
                    $ctrl.button1Callback = $ctrl.resolve.data.button1Callback;
                    $ctrl.button2Callback = $ctrl.resolve.data.button2Callback;
                    $ctrl.button1Text = $ctrl.resolve.data.button1Text ? $ctrl.resolve.data.button1Text : 'SDE_CLOSE';
                    $ctrl.button2Text = $ctrl.resolve.data.button2Text ? $ctrl.resolve.data.button2Text : 'SDE_CANCEL';

                    if ($ctrl.resolve.data.button1Glyph) {
                        $ctrl.button1Classes = 'btn btn-medium btn-glyph-label btn-secondary-alert ' + $ctrl.resolve.data.button1Glyph;
                    } else {
                        $ctrl.button1Classes = 'btn btn-medium btn-glyph-label btn-secondary-alert xrx-close';
                    }

                    if ($ctrl.resolve.data.button2Glyph) {
                        $ctrl.button2Classes = 'btn btn-medium btn-glyph-label btn-secondary-alert ' + $ctrl.resolve.data.button2Glyph;
                    } else {
                        $ctrl.button2Classes = 'btn btn-medium btn-glyph-label btn-secondary-alert xrx-cancel';
                    }
                }

                $ctrl.button1 = function () {
                    if ($ctrl.button1Callback != null) {
                        $ctrl.button1Callback();
                    }

                    $ctrl.close();
                }

                $ctrl.button2 = function () {
                    if ($ctrl.button2Callback != null) {
                        $ctrl.button2Callback();
                    }

                    $ctrl.close();
                }
            }
        });