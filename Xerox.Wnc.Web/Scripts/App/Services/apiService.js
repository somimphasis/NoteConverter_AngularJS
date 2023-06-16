// Copyright © 2019 Xerox Corporation. All Rights Reserved.
angular
    .module('app')
    .factory('apiService', apiService);

function apiService(configurationService) {

    var service = {};

    service.url = configurationService.getSetting('apiUrl');
    service.prefix = configurationService.getSetting('apiPrefix');

    service.apiBaseUrl = function () {
        console.log("Service URL" + service.url + service.getPrefix());
        return service.url + service.getPrefix();
    }

    service.apiUrl = function (fragment) {
        return service.apiBaseUrl() + fragment;
    }

    service.apiHost = function () {
        return service.url.replace('http://', '').replace('https://', '')
    }

    service.getPrefix = function () {
        if (!service.prefix || service.prefix == 'null') {
            return '';
        }
        return service.prefix;
    }

    return service;
}