// Copyright © 2019 Xerox Corporation. All Rights Reserved.

angular
    .module('app')
    .factory('modalService', modalService);

function modalService($uibModal, $uibModalStack, $timeout, device) {
    var service = {};
    service.openComponentModal = function (componentName, data) {
        return $uibModal.open({
            component: componentName,
            resolve: {
                data: function () { return data; }
            }
        });
    };

    service.showPreview = function (title, images) {
        return $uibModal.open({
            component: 'imagePreviewer',
            resolve: {
                title: function () { return title; },
                images: function () { return images; }
            }
        });
    };

    service.showLogoutConfirmation = function () {
        return $uibModal.open({
            component: 'logoutConfirmation'
        });
    }

    service.showPopover = function (feature, event) {
        return $uibModal.open({
            component: 'featurePopover',
            resolve: {
                feature: function () { return feature; },
                event: function () { return event; },
            }
        });
    }

    service.showScanProgressBanner = function (loaderStatus) {
        ToggleProgressBanner = $uibModal.open({
            windowClass: (!device.isThirdGenBrowser) ? 'allow-outside-interaction' : 'allow-outside-banner-interaction',
            backdrop: false,
            component: 'progressBanner'
        });
        return ToggleProgressBanner;
    }

    service.closeScanProgressBanner = function (loaderStatus) {
        ToggleProgressBanner.close();
    }

    service.showProgressAlert = function (title, body) {
        return $uibModal.open({
            component: 'progressAlert',
            resolve: {
                title: function () { return title; },
                body: function () { return body; },
            }
        });
    };

    service.showAlert = function (message) {
        var modal = $uibModal.open({
            component: 'alertBanner',
            windowClass: (!device.isThirdGenBrowser) ? 'allow-outside-interaction' : 'allow-outside-banner-interaction',
            backdrop: false,
            resolve: {
                message: function () { return message; }
            }
        });

        // Automatically close after 3 seconds
        $timeout(function () {
            modal.close();
        }, 3000);

    }

    service.showSimpleAlert = function (title, body, buttonText) {
        return $uibModal.open({
            component: 'basicAlert',
            resolve: {
                title: function () { return title; },
                body: function () { return body; },
                buttonText: function () { return buttonText || 'SDE_CLOSE'; },
            }
        });
    }

    service.closeAllModals = function () {
        $uibModalStack.dismissAll();
    }

    return service;
}

var ToggleProgressBanner;