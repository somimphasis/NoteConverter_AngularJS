// Copyright © 2019 Xerox Corporation. All Rights Reserved.
angular
    .module('app')
    .factory('errorHandlerService', errorHandlerService);

function errorHandlerService($rootScope, modalService, strings) {
    var service = {};

    service.parseError = function (errorSDEName) {
        var localizedString = locStrings[errorSDEName];
        if (localizedString == null || localizedString.length == 0) {
            localizedString = errorSDEName;
        }
        return modalService.showAlert(localizedString);
    }

    service.showErrorAlert = function (sdeTitle, sdeAdditionalInfo, button1Callback, button2Callback) {
        service.closeAllModals();

        var data = {};
        data.title = sdeTitle;
        data.additionalInfo = sdeAdditionalInfo;
        data.button1Callback = button1Callback;
        data.button2Callback = button2Callback;
        return modalService.openComponentModal('generalAlert', data);
    }

    // FMEA Methods
    service.DEVICE_EIP_SCANV2_SERVICES_DISABLED = function () {
        service.showErrorAlert('SDE_TO_USE_APP', 'SDE_SCAN_EXTENSION_SCAN1', null, null);
    }

    service.DEVICE_NETWORK_ERROR = function () {
        service.showErrorAlert('SDE_WRITTEN_NOTE_CONVERSION7', 'SDE_CHECK_DEVICES_NETWORK', null, null);
    }

    // TODO: Update this with a real string
    service.XBB_DEVICE_EIP_INTERNAL_ERROR_SCAN = function () {
        service.showErrorAlert('SDE_XBB_DEVICE_EIP_INTERNAL_ERROR_SCAN', '', null, null);
    }

    service.DEVICE_EIP_INTERNAL_ERROR_TIMEOUT = function () {
        service.showErrorAlert('SDE_JOB_TIMED_OUT', 'SDE_PLEASE_TRY_AGAIN1', null, null);
    }

    service.CLOUD_APP_GENERAL_ERROR = function () {
        service.showErrorAlert('SDE_WRITTEN_NOTE_CONVERSION6', 'SDE_PLEASE_TRY_AGAIN1', null, null);
    }

    service.INPUT_SCAN_SIZE_NOT_DETERMINED = function () {
        service.showErrorAlert('SDE_INPUT_SCAN_SIZE', 'SDE_PLEASE_TRY_AGAIN1', null, null);
    }


    function exitApp() {
        $rootScope.$broadcast("globalAppMessage", "Exit");
    }

    service.SDE_JOB_CANCELED1 = function () {
        service.showErrorAlert('SDE_JOB_CANCELED1', 'SDE_PLEASE_TRY_AGAIN1', null, null);
    }

    service.wncWasReset = function () {
        service.showErrorAlert('SDE_WRITTEN_NOTE_CONVERSION5', '', null, null);
    }

    service.MP3_OUT_OF_CREDIT = function () {
        service.showErrorAlert('SDE_HAVE_USED_ALL', 'SDE_GO_XEROX_APP', null, null).result.then(function () {
            if (typeof ExitCUIMode === "function") {
                ExitCUIMode();
            } else {
                window.location.reload();
                //window.close();
            }
        });
    }

    service.APP_UNAVAILABLE_AT_THIS_TIME = function () {
        var data = {};
        data.title = 'SDE_WRITTEN_NOTE_CONVERSION8';
        data.additionalInfo = 'SDE_PLEASE_TRY_AGAIN2';
        data.additionalInfo2 = 'SDE_IF_PROBLEM_PERSISTS3';

        modalService.openComponentModal('generalAlert', data).result.then(function () {
            window.location.reload();
        });
    };

    service.ADMIN_ACCOUNT_ALREADY_EXISTS = function () {
        service.showErrorAlert('SDE_WRITTEN_NOTE_CONVERSION8', 'SDE_PLEASE_USE_DIFFERENT', null, null)
    }

    service.ADMIN_ACCOUNT_CREATED = function (emailAddress, callback) {
        var data = {};

        data.title = 'SDE_ADMINISTRATOR_ACCOUNT_CREATED';
        data.additionalInfo = 'SDE_EMAIL_SENT_FOLLOWING';
        data.additionalInfo2 = emailAddress;
        data.button1Callback = callback;

        return modalService.openComponentModal('generalAlert', data);
    }

    service.PASSWORD_RESET = function (callback) {
        var data = {};

        data.title = 'SDE_PASSWORD_RESET_INSTRUCTIONS1';
        data.additionalInfo = 'SDE_IF_DO_NOT8';
        data.button1Callback = callback;

        return modalService.openComponentModal('generalAlert', data);
    }

    service.CONFIRM_LOGOUT = function (confirmCallback, cancelCallback) {
        var data = {};
        data.title = 'SDE_CONFIRM_LOG_OUT3';
        data.button1Callback = cancelCallback;
        data.button2Callback = confirmCallback;
        data.button1Text = 'SDE_CANCEL';
        data.button2Text = 'SDE_LOG_OUT';
        data.button1Glyph = 'xrx-close';
        data.button2Glyph = 'xrx-exit';
        return modalService.openComponentModal('generalAlert', data);
    }
    // End of FMEA Methods

    service.closeAllModals = function () {
        modalService.closeAllModals();
    }

    return service;
}