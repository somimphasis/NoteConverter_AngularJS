/* Copyright © 2020 Xerox Corporation. All Rights Reserved. Copyright protection claimed includes all forms and */
/* matters of copyrightable material and information now allowed by statutory or judicial law or hereinafter granted, */
/* including without limitation, material generated from the software programs which are displayed on the screen such */
/* as icons, screen display looks, etc. */

angular
    .module('app')
    .component('privacyPolicy', {
        templateUrl: 'Scripts/App/Components/privacyPolicy.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: function ($scope, $http, modalService, strings, $timeout) {

            var $ctrl = this;
            $ctrl.privacyPolicy = "";

            $ctrl.$onInit = function () {
                var progress = modalService.showProgressAlert();
                $http.get('https://appgallery.services.xerox.com/api/apps/template-privacy-policy', { timeout: parseInt(strings.TIMEOUT) }
                ).then(function (response) {
                    $ctrl.privacyPolicy = response.data;
                    $ctrl.showVersion = strings.VERSION;
                    progress.close();
                    $timeout(disableLinks, 250);
                }).catch(function (error) {
                    $ctrl.showVersion = strings.VERSION;
                    progress.close();
                    modalService.showGeneralError(error);
                 });
            };

            var disableLinks = function () {
                $("a").css('pointer-events', 'none');
            };
        }

    });
