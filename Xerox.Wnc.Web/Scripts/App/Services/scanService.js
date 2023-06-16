// Copyright © 2019 Xerox Corporation. All Rights Reserved.
angular
    .module('app')
    .factory('scanService', scanService);

function scanService($http, $rootScope, $timeout, $q, modalService, scanTemplate, logService, errorHandlerService,  scanOptionsService, jobService, strings) {

    var service = {};

    var printerUrl = 'http://127.0.0.1';
    var sessionUrl = 'http://localhost';


    service.scanOptionsService = scanOptionsService;


    // Standard set of callbacks.
    service.callbacks = {
        handleScanException: function (message) {
            //modalService.closeScanProgressBanner();
            service
                .callbacks
                .completeScan({ error: true, message: message });
        },
        handleJobCanceled: function () {
            //modalService.closeScanProgressBanner();
            service
                .callbacks
                .completeScan({ error: true, message: 'canceled' }); // TODO: Does this message need to be localized? It's not currently displayed to the user
        },
        handleJobAbortedBySystem: function () {
            //modalService.closeScanProgressBanner();
            service
                .callbacks
                .completeScan({ message: 'Scan Job Aborted By System' }); // TODO: Does this message need to be localized? It's not currently displayed to the user
        },
        handleInputSizeNotDetermined: function () {
            //modalService.closeScanProgressBanner();
            service
                .callbacks
                .completeScan({ error: true, message: 'Input size not determined' }); // TODO: Does this message need to be localized? It's not currently displayed to the user
        },
        handleJobComplete: function () {
            //modalService.closeScanProgressBanner();
            service
                .callbacks
                .completeScan({ message: 'complete' }); // TODO: Does this message need to be localized? It's not currently displayed to the user
        },
        handleFinishPutTemplateError: function () {
            //modalService.closeScanProgressBanner();
            service
                .callbacks
                .completeScan({ error: true, message: 'Error sending template to device' }); // TODO: Does this message need to be localized? It's not currently displayed to the user
        },
        handleBeginCheckFailure: function (request, response) {
            //modalService.closeScanProgressBanner();
            service
                .callbacks
                .completeScan({ error: true, deviceDetails: response });
        },
        handlePutTemplateFailure: function (message) {
            //modalService.closeScanProgressBanner();
            service
                .callbacks
                .completeScan({ error: true, deviceDetails: message });
        },
        completeScan: function (detail) {
            //modalService.closeScanProgressBanner();
            //console.log("complete scan callback: " + JSON.stringify(detail));
            service.isScanning = false;
            service.isComplete = true;
            if (detail.error) {
                completeScanPromise
                    .reject(detail);
            }
            else {
                completeScanPromise
                    .resolve(detail);
            }
        }
    };

    service.isComplete = false;
    service.isScanning = false;

    var template;
    var completeScanPromise = null;
    //var progressBanner;
    var jobid = null;

    service.isExistingEmail = function (email) {
        var config = {
            headers: {
                "Content-Type": "text/json; charset=utf-8",
                "Authorization": "ED803572-7B6B-4E56-8DCB-9F9C22C679FA"
            }
        };

        return $http.get("api/IsExistingEmail?email=" + email, config);
    }

    service.scan = function (model) {

        logService.logMsg('service.scan', 'information');

        if (service.isScanning) {
            logService.logMsg('service.scan -> service.isScanning : Please wait!!!!', 'information');
            throw strings['SDE_PLEASE_WAIT_UNTIL'];
        }

        jobid = generateNewJobID();

        logService.logMsg('scanService => scan => jobID:' + jobid, 'information');

        model.jobid = jobid;

        template = new scanTemplate(model);

        modalService.showProgressAlert(strings.SDE_SCANNING1);

        return jobService.registerJob(model).then(function (result) {
            // ToString will validate the template. Let's try that now before anything else
            // There's no user feedback for this type of error, it's more for dev testing
            var tStr = template.toString();

            logService.logMsg('scanService => scan => template:' + tStr, 'information');

            service.isScanning = true;
            service.isComplete = false;

            // Not that we currently do anything with this promise but the various callbacks
            // in the scan process will either resolve or reject it
            completeScanPromise = $q.defer();

            logService.logMsg('service.scan -> calling putTemplate()', 'information');

            putTemplate();

            return completeScanPromise.promise;

        });
    }

    // Helper functions
    function putTemplate() {
        
        logService.logMsg('putTemplate()...', 'information');

        xrxTemplatePutTemplate(printerUrl, template.name, template.toString(),
            function finish(callId, response) {
                logService.logMsg('scanService => putTemplate => callId:' + callId + ' response:' + response, 'information');
                finishPutTemplate(callId, response);
            },
            function fail(env, message) {
                //modalService.closeScanProgressBanner();
                modalService.closeAllModals();
                errorHandlerService.APP_UNAVAILABLE_AT_THIS_TIME();
            });
    }


    // Finished putting the template. Start checking the status of the job.
    function finishPutTemplate(callId, response) {

        logService.logMsg('finishPutTemplate(callId,response) -> callId:' + callId + ' response:' + response, 'information');

        var xmlDoc = xrxStringToDom(response);

        logService.logMsg('finishPutTemplate(callId,response) -> xmlDoc:' + xmlDoc, 'information');

        template.checkSum = xrxGetElementValue(xmlDoc, 'TemplateChecksum');

        xrxScanV2InitiateScanJobWithTemplate(printerUrl, template.name,
            false, null,
            function finish(callId, response) {

                logService.logMsg('function finish(callId, response) -> callId:' + callId + ' response:' + response, 'information');

                template.jobId = xrxScanV2ParseInitiateScanJobWithTemplate(response);
                // Let everyone know the job has been submitted.
                //$rootScope.$broadcast('scanJobSubmitted', { jobId: template.jobId, template: template });
                // Begin the check loop.
                startScanTime = new Date();
                stopScanTime = new Date();
                stopScanTime.setMinutes(stopScanTime.getMinutes() + timeoutInMinutes);
                beginCheckLoop(template.jobId);
            },
            function fail(env, message) {
                logService.logMsg('function fail(env, message) {  -> env:' + env + ' message:' + message, 'information');

                service.callbacks.handleFinishPutTemplateError();
                errorHandlerService.CLOUD_APP_GENERAL_ERROR();
            });
    }

    // Mechanism to make sure we can inform the user that the scan job has been in processing for too long (timeout)
    var startScanTime = null;
    var stopScanTime = null;
    var timeoutInMinutes = 1;

    // This function allows us to check if the job in PROCESSING status has been running longer than expected.
    function checkScanTimeout() {
        if (startScanTime != null) {
            return ((stopScanTime.getMinutes() >= startScanTime.getMinutes())
                && (stopScanTime.getSeconds() > startScanTime.getSeconds()));
        }
        return false;
    }

    // Start the get status loop.
    function beginCheckLoop() {
        if (service.isComplete) { return; }
        logService.logMsg('beginCheckLoop()...', 'information');
        xrxJobMgmtGetJobDetails(sessionUrl, "WorkflowScanning", 
            template.jobId,
            checkLoop,
            service.callbacks.handleBeginCheckFailure,
            5000);
    }


    // Check the printer for the status of the job.
    function checkLoop(request, response) {
        logService.logMsg('checkLoop(request, response) -> request:' + request + ' response:' + response, 'information');
        // Any job state?
        var jobStateReason = "";
        var info = xrxJobMgmtParseGetJobDetails(response);
        var jobState = xrxGetElementValue(info, 'JobState');
        var dummy = xrxJobMgmtParseJobStateReasons(response);

        logService.logMsg('checkLoop(request, response) -> jobState:' + jobState + ' dummy:' + dummy, 'information');

        console.log(jobState + ' ' + dummy);

        if (jobState === null || jobState === 'Completed') {
            logService.logMsg('if (jobState === null || jobState === Completed)', 'information');

            jobStateReason = xrxParseJobStateReasons(response);

            logService.logMsg('jobStateReason:' + jobStateReason, 'information');
        }

        $rootScope.$broadcast('jobStatusCheckSuccess',
            { jobId: template.jobId, state: jobState, reason: jobStateReason });

        // Update the status of the template.
        template.status = {
            lastJobState: jobState,
            lastJobStateReason: jobStateReason
        };

        // Checking if the job should be flagged as timeout
        if (checkScanTimeout()) {
            logService.logMsg('if (checkScanTimeout()) { ', 'information');
            jobState = 'Completed';
            jobStateReason = 'JobAborted';
            service.callbacks.handleJobAbortedBySystem();
            $timeout(deleteScanTemplate(), 500);
            errorHandlerService.DEVICE_EIP_INTERNAL_ERROR_TIMEOUT();
            return;
        }

        if (jobState === 'Completed' && jobStateReason === 'JobCompletedSuccessfully') {
            modalService.closeAllModals();

            var title = strings.SDE_DOCUMENT_SUCCESSFULLY_SCANNED;

            var msg = strings.SDE_WILL_RECEIVE_EMAIL2.replace("{0}", "Xerox Note Converter");
            modalService.showSimpleAlert(title, msg);

            logService.logMsg('if (jobState === Completed && jobStateReason == JobCompletedSuccessfully) { ', 'information');
            $rootScope.$broadcast('jobProgress', 'JOB_COMPLETED_SUCCESSFULLY');
        }

        if (jobState === 'Completed' && jobStateReason === 'InputScanSizeNotDetermined') {
            logService.logMsg('if (jobState === Completed && jobStateReason === InputScanSizeNotDetermined) {  jobState:' + jobState + ' jobStateReason:' + jobStateReason, 'information');
            errorHandlerService.INPUT_SCAN_SIZE_NOT_DETERMINED();
            service.callbacks.handleInputSizeNotDetermined();
            $timeout(deleteScanTemplate(), 500);
            return;
        }

        if (jobState === 'Completed' && jobStateReason === "None") {
            // do nothing
        } else if (jobState === 'Completed' && jobStateReason && jobStateReason != 'JobCompletedSuccessfully') {

            logService.logMsg('if (jobState === Completed && jobStateReason && jobStateReason != JobCompletedSuccessfully) {', 'information');
           // $rootScope.$broadcast('jobProgress', jobStateReason);
            modalService.closeAllModals();
            errorHandlerService.APP_UNAVAILABLE_AT_THIS_TIME();
            return;
        }
        else {
            logService.logMsg('jobProgress:' + jobState, 'information');
            //$rootScope.$broadcast('jobProgress', jobState);
        }

        if (jobState === 'Completed' && jobStateReason == 'JobCompletedSuccessfully') {
            $timeout(service.callbacks.handleJobComplete(), 500);
            $timeout(deleteScanTemplate(), 500);
            return;
        }

        
        else if (jobState === 'Completed' && (jobStateReason === 'JobAborted' || jobStateReason === 'AbortBySystem')) {
            logService.logMsg('else if (jobState === Completed && (jobStateReason === JobAborted || jobStateReason === AbortBySystem)) {', 'information');
            errorHandlerService.SDE_JOB_CANCELED1();
            service.callbacks.handleJobAbortedBySystem();
            $timeout(deleteScanTemplate(), 500);
        }
        else if (jobState === 'Completed' && (jobStateReason === 'JobCanceledByUser' || jobStateReason === 'CancelByUser')) {
            logService.logMsg('else if (jobState === Completed && (jobStateReason === JobCanceledByUser || jobStateReason === CancelByUser)) {', 'information');
            errorHandlerService.SDE_JOB_CANCELED1();
            service.callbacks.handleJobCanceled();
            $timeout(deleteScanTemplate(), 500);
        }
        else if (jobState === 'ProcessingStopped' && (jobStateReason === 'NextOriginalWait' || jobStateReason === '')) {
            logService.logMsg('else if ProcessingStopped NextOriginalWait', 'information');
            $timeout(beginCheckLoop, 2000);
        }
        else if (!(jobState === 'Completed' && jobStateReason === "None") && (jobState === 'Completed' || jobState === 'ProcessingStopped')) {
            logService.logMsg('else if Completed ProcessingStopped', 'information');
            $timeout(service.callbacks.handleJobComplete(), 500);
            $timeout(deleteScanTemplate(), 500);
        }
        else if (jobState === null && jobStateReason === 'JobCanceledByUser') {
            logService.logMsg('else if JobCanceledBUser', 'information');
            //$rootScope.$broadcast('jobProgress', jobStateReason);
            service.callbacks.handleJobCanceled();
            $timeout(deleteScanTemplate(), 500);
            errorHandlerService.SDE_JOB_CANCELED1();
        }
        else if (jobState === null && jobStateReason !== '') {
            logService.logMsg('else if (jobState === null && jobStateReason !== ) {  jobStateReason:' + jobStateReason, 'information');
            errorHandlerService.SDE_JOB_CANCELED1();
            service.callbacks.handleScanException(jobStateReason);
            $timeout(deleteScanTemplate(), 500);
        }
        else {
            $timeout(beginCheckLoop, 2000);
        }
    }

    // Deletes the template by checksum.
    function deleteScanTemplate() {

        // We can delete the template by checksum if we have it.
        if (template.checkSum) {
            xrxTemplateDeleteTemplate(printerUrl,
                template.name,
                template.checkSum,
                function success() {
                },
                function failure() {
                });
        }
    }

    return service;
}