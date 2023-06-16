// Copyright © 2019 Xerox Corporation. All Rights Reserved.
angular
    .module('app')
    .factory('logService', logService);

function logService($http, storageService) {

    var service = {};

    var storageProvider = storageService.getLocalStorage(true);

    service.logMsg = function (message, logType) {

        var config = {
            headers: {
                "Content-Type": "text/json; charset=utf-8",
                "Authorization": "ED803572-7B6B-4E56-8DCB-9F9C22C679FA"
            }
        };

        var deviceID = storageProvider.getItem("deviceId");

        var argParms = {};

        argParms.LogMessage = message;
        argParms.LogType = logType || LogTypes.Information;
        argParms.DeviceID = deviceID;
        
        $http.post("api/log", argParms, config);
    }

    return service;
};

var LogTypes = {
    Information: "information",
    Error: "error",
    Warning: "warning"
};