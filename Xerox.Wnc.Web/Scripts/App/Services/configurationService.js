// Copyright © 2019 Xerox Corporation. All Rights Reserved.
angular
    .module('app')
    .factory('configurationService', configurationService);

function configurationService($location, storageService) {
    var service = {};

    var storageProvider = storageService.getLocalStorage(true);

    service.parseUrlParams = function () {
        function fullyDecode(urlParam) {
            var result = urlParam;
            while (result !== decodeURIComponent(result)) {
                result = decodeURIComponent(result);
            }
            return result;
        }

        var qs = window.location.search;

        if (!qs) { return $location.search(); }

        var result = [];
        if (qs[0] === "?") {
            var params = qs.slice(1).split('&');
            for (var i = 0; i < params.length; i++) {
                var param = params[i].split('=');
                result.push(param[0]);
                result[param[0]] = fullyDecode(param[1]);
            }

        }
        return result;
    };

    service.getSetting = function (settingName) {

        var params = service.parseUrlParams();

        var setting = params[settingName];

        if (setting) {
            service.cacheSetting(settingName, setting);
        } else {
            setting = storageProvider.getItem(settingName);
        }

        return setting;
    };

    service.cacheSetting = function (settingName, setting) {
        storageProvider.setItem(settingName, setting);
    };
    
    service.clearQueryString = function () {
        $location.search({});
    };

    return service;
}