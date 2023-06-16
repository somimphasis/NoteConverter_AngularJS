angular
    .module('app')
    .factory('jobService', jobService);

function jobService($http, apiService, configurationService, logService) {
    var service = {};

    service.registerJob = function (featureValues) {

        var config = { headers: { "Content-Type": "text/json; charset=utf-8" } };

        var parsedFilename = featureValues.fileName + '.pdf';

        var job = {};

        job.jobId = featureValues.jobid;
        job.emailAddress = featureValues.email;
        job.timeZoneOffsetMinutes = new Date().getTimezoneOffset();
        job.filename = parsedFilename;
        job.localizedLanguage = localizedLanguage;
        job.appId = configurationService.getSetting('appId');
        job.deviceId = configurationService.getSetting('deviceId');
        job.orientation = featureValues.orientation;
        job.format = featureValues.fileFormat.toUpperCase();

        if (featureValues.fileFormat == "pdf") {
            job.archivalFormat = (featureValues.archivalFormat ? 'PDF/A-1b' : 'PDF');
        }

        var request = {
            job: job
        };

        return $http.post(apiService.apiUrl("/api/v1/job"), request, config).then(function (result) {
            logService.logMsg('jobService -> registerJob -> success -> result.data:' + result.data, 'information');
            return result.data;
        },
        function (error) {
            logService.logMsg('jobService -> registerJob -> ERROR...', 'error');

            if (error != null && error.data != null && error.data.ExceptionMessage != null) {
                logService.logMsg('jobService -> registerJob -> ERROR:' + error.data.ExceptionMessage, 'error');
            }

            if (error && error.status == 401) {
                $rootScope.$broadcast("globalAppMessage", "unauthorized");
            }
        });
    };

    return service;
}