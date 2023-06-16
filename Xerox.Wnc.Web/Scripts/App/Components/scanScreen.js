angular
    .module('app')
    .component('scanScreen',
        {
            templateUrl: 'Scripts/App/Components/scanScreen.html',
            controller: function ($http, $scope, $location, $timeout, $document, $state, modalService, scanOptionsService, apiService, scanService, errorHandlerService, logService, strings, storageService, configurationService, session, device) {
                var $ctrl = this;
                var storageProvider = storageService.getLocalStorage(true);
                $ctrl.isCreditsEnabled = false;
                var params = $location.search();
                var emailHasError = falsescan()
                //$ctrl.creditValue = 0;
                $ctrl.maxPagesPerJobStyle = 'text-align:left !important;';
                $ctrl.$onInit = function () {
                    $ctrl.privacyURL = 'https://appgallery.services.xerox.com/api/apps/template-privacy-policy';



                    $ctrl.scanOptionsService.email = session.email;

                    $ctrl.validationStatus = false;

                    $timeout(function () {
                        $ctrl.mainForm['email'].$setTouched();

                    }, 0);

                    // If we have an email in session, attempt to validate fields (to enable scan button)
                    if (session.email) {
                        $ctrl.validateAllFields();
                    }

                    // If not eigth gen, whenever scroll-container scrolls (its an accident, so scrolltop to 0) to fix shadows
                    if (!device.isEighthGen && !device.isThirdGenBrowser) {
                        $(".scroll-container").scroll(_.debounce(function () {
                            $(this).scrollTop(0);
                        }, 250, { leading: true })
                        );
                    }
                };

                $scope.$on('jobProgress', function (event, enable) {
                    console.log(enable);
                    logService.logMsg("$scope.$on -> event:" + event + " enable:" + enable, "information");
                    if (enable !== null && enable === 'JOB_COMPLETED_SUCCESSFULLY') {
                        $ctrl.refreshCredits();
                    }
                });

                var paramsJsonStr = JSON.stringify(params, null, 2);

                logService.logMsg('scanScreen -> paramsJsonStr:' + paramsJsonStr, 'information');

                // Some people consider exposing services directly on the scope to be bad form, but it's a convenient way
                // of setting up 2 way data-binding without having to have an intermediary data object that stores all
                // the properties we want to show and modify, since binding directly to scalar properties doesn't work properly.
                $ctrl.scanOptionsService = scanOptionsService;
                $ctrl.scanService = scanService;
                $ctrl.errorHandlerService = errorHandlerService;
                scanOptionsService.fileName = "Xerox Scan";
                //Protect against empty fileName
                $ctrl.fileNameEmpty = function () {
                    return $ctrl.scanOptionsService.fileName === undefined || $ctrl.scanOptionsService.fileName === null || $ctrl.scanOptionsService.fileName < 1;
                };

                $scope.$on("globalAppMessage", function (event, data) {
                    if (data !== null && data === 'Exit') {
                        $ctrl.exit();
                    }
                });

                $scope.$on("globalAppMessage", function (event, data) {
                    if (data !== null && data === 'logout') {
                        $state.go('createAdminAccountApp');
                        xrxSessionExitApplication('http://127.0.0.1', null);
                    }
                });

                $ctrl.resetSettings = function (shouldShowAlert) {
                    scanOptionsService.resetFeatureSettings();
                    scanOptionsService.email = "";
                    $ctrl.scanOptionsService.fileName = strings['SDE_XEROX_SCAN'];
                    $timeout(function () {
                        $ctrl.clearValidation();
                        $ctrl.validationStatus = false;
                    }, 0);

                    if (shouldShowAlert) {
                        errorHandlerService.wncWasReset();
                    }
                };

                $ctrl.openFeaturePopover = function (feature) {
                    modalService.showPopover(feature, event);
                };

                $ctrl.scan = function () {
                    logService.logMsg('ctrl.scan ...', 'information');
                    /*This is a bit odd so it warrants a comment, mainDeviceConfig is called from the scan buttom because it sets off a cascading
                    set of webservice calls via the success callbacks. Device config is probably not necessary but no harm. We only make sure we
                    get an answer from getInterfaceVersion for our needed webservices. The web service calls we make in order are:
                    Device Config: Get Interface Version
                    Scan V2: Get Interface Version
                    JobManagement: Get interface version
                    Scan Template Management: Get Interface Version
                    Now we enter scanservice.scan in scanservice.js
                    */
                    mainDeviceconfig();
                };



                $ctrl.hasError = function (field) {
                    var errors = $ctrl.mainForm[field].$error;
                    emailHasError = ((errors.required || errors.compareTo) && $ctrl.mainForm.$submitted) || (!_.isEmpty(errors) && !errors.required && $ctrl.mainForm[field].$touched);
                    return emailHasError;
                };

                $ctrl.fieldChange = function (field) {
                    var control1 = $ctrl.mainForm['email'];
                    if (control1.$touched) {
                        $ctrl.validateAllFields();
                    }
                };

                $ctrl.fieldBlur = function (field) {
                    var control1 = $ctrl.mainForm['email'];

                    if (control1.$touched) {
                        $ctrl.validateAllFields();
                    }
                };

                $ctrl.clearValidation = function () {
                    $('#emailHasErrors').hide();
                    $('#emailHasErrorRequired').hide();
                    $('#emailHasErrorNotValid').hide();
                };

                $ctrl.openPrivacy = function () {
                    modalService.openComponentModal("privacyPolicy").result.then(angular.noop, angular.noop);
                };

                $ctrl.validateAllFields = function () {
                    var emailStr = $ctrl.scanOptionsService.email !== null && $ctrl.scanOptionsService.email !== undefined ? $ctrl.scanOptionsService.email.toLowerCase() : '';


                    if (emailStr === '') {
                        console.log('Email required');
                        $('#emailHasErrors').show();
                        $('#emailHasErrorRequired').show();
                        $('#emailHasErrorNotValid').hide();
                        $ctrl.validationStatus = false;
                        return false;
                    }

                    if (!validateEmail(emailStr)) {
                        console.log('Email invalid');
                        $('#emailHasErrors').show();
                        $('#emailHasErrorRequired').hide();
                        $('#emailHasErrorNotValid').show();
                        $ctrl.validationStatus = false;
                        return false;
                    }



                    $ctrl.clearValidation();
                    $ctrl.validationStatus = true;
                    return true;
                };

                function mainDeviceconfig() {
                    logService.logMsg('mainDeviceconfig()...', 'information');
                    var regex = /^[^\\\/\:\*\?\"\<\>\|]+$/;
                    if (regex.test(scanOptionsService.fileName)) {
                        logService.logMsg('mainDeviceconfig() -> if (regex.test(scanOptionsService.fileName))', 'information');
                        xrxDeviceConfigGetInterfaceVersion("http://127.0.0.1", DeviceCallBack_Success, DeviceCallBack_Failure, null, true);
                    } else {
                        logService.logMsg('mainDeviceconfig() ELSE FOR if (regex.test(scanOptionsService.fileName))', 'information');
                        var text = strings['SDE_CHARACTERS_CANNOT_BE'].replace('{0}', '\\ / : * ? " < > |');
                        errorHandlerService.showErrorAlert(text, '', null, null);
                    }
                }

                function DeviceCallBack_Success() {
                    getScanStatus();
                }
                function DeviceCallBack_Failure(respText, newresp) {
                    logService.logMsg('DeviceCallBack_Failure -> respText:' + respText + ' newresp:' + newresp, 'error');
                    errorHandlerService.XBB_DEVICE_EIP_DEVICE_CONFIG_DISABLED();
                }
                function getScanStatus() {
                    logService.logMsg('getScanStatus()...', 'information');
                    xrxScanV2GetInterfaceVersion("http://127.0.0.1", callback_success, callback_failure, null, true);
                }
                function callback_success(reqText, respText) {
                    logService.logMsg('getScanStatus() -> callback_success', 'information');
                    getjobmamt();
                }
                function callback_failure(respText, newresp) {
                    logService.logMsg('callback_failure -> respText:' + respText + ' newresp:' + newresp, 'error');
                    errorHandlerService.DEVICE_EIP_SCANV2_SERVICES_DISABLED();
                }
                function getjobmamt() {
                    logService.logMsg('getjobmanagementInterfaceVersion()...', 'information');
                    xrxJobMgmtGetInterfaceVersion("http://127.0.0.1", Jobcallback_success, Jobcallback_failure, null, true);
                }
                function Jobcallback_success(reqText, respText) {
                    logService.logMsg('Jobcallback_success()...', 'information');
                    CheckTemplate();
                }
                function Jobcallback_failure(reqText, respText) {
                    logService.logMsg('Jobcallback_failure -> reqText:' + reqText + ' respText:' + respText, 'error');
                    errorHandlerService.DEVICE_EIP_SCANV2_SERVICES_DISABLED();
                }

                function CheckTemplate() {
                    xrxTemplateGetInterfaceVersion("http://127.0.0.1", Templatecallback_success, Templatecallback_failure, null, true);
                }

                function Templatecallback_success() {

                    logService.logMsg('Templatecallback_success()...', 'information');

                    var values = scanOptionsService.getValues();

                    logService.logMsg('Templatecallback_success() values:' + values, 'information');

                    '##############################################################################'
                    '####################              SCAN       #################################'
                    '##############################################################################'

                    scanService.scan(values);
                }
                function Templatecallback_failure(respText, newresp) {
                    logService.logMsg('Templatecallback_failure -> respText:' + respText + ' newresp:' + newresp, 'error');
                    errorHandlerService.DEVICE_EIP_SCANV2_SERVICES_DISABLED();
                }


                var captureScanPress = function (event) {
                    if (event !== null) {
                        if (event.which == "4098") {
                            if (typeof EIP_CloseEmbeddedKeyboard === 'function') {
                                EIP_CloseEmbeddedKeyboard(); //dismiss device keyboard
                            }
                            if ($ctrl.validationStatus) {
                                $ctrl.scan();
                            }
                        }
                    }
                };

                // Capture start button on the device
                $document.on('keyup', captureScanPress);

                $ctrl.$onDestroy = function () {
                    console.log("destroying ");
                    $document.off('keyup', captureScanPress);
                };

            }
        });