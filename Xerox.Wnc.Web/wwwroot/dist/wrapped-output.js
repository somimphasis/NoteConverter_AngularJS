(function() {
'use strict';
var StatusCodes = {
    success: 200,
    badRequest: 400
};

var ErrorCodes = {
    ok: 'OK'
}

function generateNewJobID() {
    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return guid;
}

function validateEmail(emailArg) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    var result = regex.test(emailArg);
    return result;
}

var localizedLanguage = null;

deferredBootstrapper.bootstrap({
    element: window.document,
    module: 'app',
    resolve: {
        //strings: function ($http) {
        //     /*
        //      * Testing note - This gets the language by the actual browser display language,
        //      * not the accept-header value or 'language preference' in the settings
        //      * var regex = /(\w+)\-?/g;
        //      * var locale = regex.exec(window.navigator.userLanguage || window.navigator.language)[1] || 'en';
        //      */
        //    var regex = /(\w+)\-?/g;
        //    var locale = regex.exec(window.navigator.userLanguage || window.navigator.language)[1] || 'en';

        //    localizedLanguage = locale;
        //    return $http.get('api/strings?lang=' + encodeURIComponent(locale)).then(function (result) { return result.data.strings; });
        //},
        //device: function ($q, $filter) {
        //    var deferred = $q.defer();
        //    xrxDeviceConfigGetDeviceInformation('http://localhost',
        //        function success(envelope, response) {
        //            var doc = xrxStringToDom(response);
        //            var info = xrxStringToDom($(doc).find('devcfg\\:Information, Information').text());

        //            var generation = $(info).find('style > generation').text();
        //            var model = $(info).find('model').text();
        //            var isVersalink = _.includes(model.toLowerCase(), 'versalink') || _.includes(model.toLowerCase(), 'primelink');
        //            var isAltalink = _.includes(model.toLowerCase(), 'altalink');
        //            var isThirdGenBrowser = _.includes(navigator.userAgent.toLowerCase(), "x3g_");

        //            deferred.resolve({
        //                isThirdGenBrowser: isThirdGenBrowser,
        //                generation: generation,
        //                isVersalink: isVersalink,
        //                isAltalink: isAltalink,
        //                isEighthGen: generation < 9.0,
        //                model: model
        //            });
        //        },
        //        function error(result) {
        //            deferred.reject(result);
        //        });

        //    return deferred.promise;
        //},
        //session: function ($q) {
        //    var deferred = $q.defer();
        //    xrxSessionGetSessionInfo(null,
        //        function success(req, resp) {
        //            var data = xrxSessionParseGetSessionInfo(resp);
        //            var userEmail = "";
        //            if (data !== null) {
        //                var userName = xrxGetElementValue(data, "username");
        //                if (userName !== null && userName.toLowerCase() !== 'guest')
        //                    userEmail = xrxGetElementValue(data, "from");
        //            }

        //            deferred.resolve({
        //                email: userEmail
        //            });
        //        },
        //        function error(req, resp) {
        //            deferred.resolve({
        //                email: ""
        //            });
        //        });

        //    return deferred.promise;
        //}
    },
    onError: function (error) {
        console.log('error: ' + error);
    }
});

var app = angular.module('app', [ 'ngSanitize', 'ngCookies', 'ui.router', 'ui.bootstrap', 'templates-main']);
app.constant('_', window._);

app.config(
    function ($stateProvider, $urlServiceProvider) {

        $stateProvider.state('scanScreen', {
            component: 'scanScreen'
        });

        $urlServiceProvider.rules.otherwise({
            state: 'scanScreen'
        });
    }
);

app.run(
    function ($rootScope) {
        console.log("App init!");

        $rootScope._ = window._;
    }
);
angular
    .module('app')
    .component('alertBanner',
        {
            templateUrl: 'Scripts/App/Components/alertBanner.html',
            bindings: {
                resolve: '<',
                close: '&',
                dismiss: '&'
            }
        });
(function () {
    'use strict';

    angular
        .module('app')
        .component('basicAlert',
            {
                bindings: {
                    resolve: '<',
                    close: '&',
                    dismiss: '&'
                },
                templateUrl: 'Scripts/App/Components/basicAlert.html'
            });
})();
// Copyright © 2019 Xerox Corporation. All Rights Reserved.

angular
    .module('app')
    .component('featurePopover',
        {
            templateUrl: 'Scripts/App/Components/featurePopover.html',
            bindings: {
                resolve: '<',
                close: '&',
                dismiss: '&'
            },
            controller: function ($scope, $element, $attrs, $timeout, modalService, scanOptionsService, featurePopoverService) {
                var $ctrl = this;
                var $root = $scope.$root;

                $ctrl.$onInit = function () {
                    $ctrl.feature = $ctrl.resolve.feature;

                    if (featurePopoverService.popoverState[$ctrl.feature.name] === undefined) {
                        featurePopoverService.popoverState[$ctrl.feature.name] = { "popoverDisplayed": false };
                    }

                    scanOptionsService.updateDisabledOptions($ctrl.resolve.feature);

                    $timeout(function () {
                        showPopoverHelper($ctrl.resolve.event, $ctrl.feature.name,
                            featurePopoverService.popoverState[$ctrl.feature.name]);
                        $timeout(function () {
                            $ctrl.show = true;
                        });
                    }, 50);
                }

                $ctrl.selectOption = function (option) {
                    if (option.disabled) {
                        modalService.showAlert(option.disabledMessage);
                    }
                    else {
                        $ctrl.feature.selectedOption = option;
                    }
                    $ctrl.close();
                }

                $ctrl.openMoreOptionsModal = function () {
                    $ctrl.close();

                    modalService.openComponentModal($ctrl.feature.moreOptionsModal, { feature: $ctrl.feature })
                        .result.then(function (modifiedFeature) {
                            _.assign($ctrl.feature, modifiedFeature);
                        });
                }

                function showPopoverHelper(e, name, options) {

                    var winHeight = $(window).height();
                    var winWidth = $(window).width();

                    //var popover = angular.element("#" + name);
                    var contents = angular.element("#" + name + " div.contents");

                    var popover = angular.element("#" + name);
                    var popoverModal = popover.parents('.modal-dialog');

                    var arrow = angular.element("arrow");
                    var arrowContents = angular.element("arrow *");

                    //console.log("looking for: " + name + ", found contents: " + JSON.stringify(contents));
                    contents.css({
                        'position': 'fixed',
                        'z-index': 1,
                        'display': 'none'
                    });

                    // Since we're manually setting the dimensions of this popover unset the modal-dialog css
                    popoverModal.css({
                        'width': 'initial',
                        'height': 'initial'
                    });

                    var height = contents.data("height") || contents.height();
                    var width = contents.width();
                    var padding = (contents.innerWidth() - width);

                    // we dont want to recalculate the height every time the contents are shown (because depending
                    // how we lay it out it may change...so just take what angular thinks it is and reuse it.
                    contents.data("height", height);

                    // How much we need on the left?

                    // Try to put it approximately in the middle.
                    var bottom = 0;
                    var top = 0;
                    var mid = height / 2;
                    top = Math.max(2, e.pageY - mid); // two is arbitrary. so the popover will have some margin.

                    // we can just float the arrow contents to make it appear flipped.
                    var float = 'left';
                    var arrowLeft = 0;
                    var transform = 'none';

                    // normalize...should at least have an 8px margin from the top.
                    top = Math.max(8, top);

                    // Apply the options if available.
                    if (options != null && options.top !== undefined) {
                        top = options.top;
                    }

                    var totalSize = width + padding + arrow.width();
                    var availableSpaceOnRight = winWidth - e.pageX;
                    var availableSpaceOnLeft = winWidth - availableSpaceOnRight;

                    var calcLeft = e.pageX - totalSize;
                    var showArrow = true;

                    // Adhere to max heights: http://edgmini.na.xerox.net:9000/ui_elements/popover.php
                    // 10" - max height: 584px
                    // 5" - max height: 470px;
                    var maxHeight = winWidth >= 1024 ? 584 : 470;

                    if (totalSize < availableSpaceOnRight) {
                        calcLeft = e.pageX + arrow.width();
                        arrowLeft = e.pageX;
                        float = 'right';
                    } else if (totalSize < availableSpaceOnLeft) {
                        arrowLeft = e.pageX - arrow.width();
                    } else {
                        // put it below
                        calcLeft = (winWidth - totalSize) / 2;
                        arrowLeft = e.pageX - arrow.width() / 2;
                        transform = 'rotate(270deg)';
                        showArrow = false;
                    }

                    // With long text, we will just put it in the middle.
                    if (showArrow) {
                        arrow.css({
                            'left': arrowLeft,
                            'top': e.pageY - arrow.height() / 2,
                            'z-index': 1300,
                            'transform': transform
                        });
                        arrowContents.css({ 'float': float });
                        arrow.show();
                    }
                    else {
                        arrow.hide();
                    }

                    // Adjust the top if it's too tall.
                    if (top + contents.height() + 16 >= winHeight) {
                        var diff = (winHeight - (top + contents.height()));
                        top = top - Math.abs(diff) - 24;
                    }

                    if (top < 0) {
                        contents
                            .css({
                                'left': calcLeft,
                                'display': 'block',
                                'bottom': '8px',
                                'maxHeight': maxHeight
                            });
                    }
                    else {
                        // Update the display and location.
                        contents
                            .css({
                                'left': calcLeft,
                                'display': 'block',
                                'top': top,
                                'maxHeight': maxHeight,
                                'bottom': ''
                            });
                    }

                    // The below code fixes several issues on several devices where some of the text of 
                    // the popup is hidden _behind_ the scrollbar. The reason this code is so convoluted 
                    // is that the solution is different on different devices. I _think_ that there might 
                    // be another, more elegant, way to solve this problem, which is to preload the images 
                    // in the popovers (because they may not yet be loaded when this function runs), but 
                    // I will leave the current fix in place for now until I can verify that preloading 
                    // fully addresses the problem.
                    var scrollBarsFixed = false;
                    var fixScrollBars = function () {

                        if (!scrollBarsFixed) {

                            var scrollContent = angular.element("#" + name + " div.popover-scroll-content");
                            var scrollChild = angular.element("#" + name + " div.popover-scroll-content ul.action-list");
                            var buttons = angular.element("#" + name + " div.popover-scroll-content ul.action-list button");

                            var scrollContentWidth = scrollContent.outerWidth() - 2;
                            var scrollContentInnerWidth = buttons[0].scrollWidth;
                            var scrollContentHeight = scrollContent.height();
                            var scrollContentInnerHeight = scrollChild.height();

                            if ((scrollContentWidth == scrollContentInnerWidth && scrollContentHeight != scrollContentInnerHeight) ||
                                (scrollContentWidth < scrollContentInnerWidth)) {
                                // This code makes the assumption that the scrollbar is exactly 50 pixels wide
                                // which is not the case on all devices (on some, it may be smaller). Regardless,
                                // the assumed width does not look _bad_ on all devices, it's just a little bit
                                // of overkill on some of them. We _could_ detect the actual width with a slightly
                                // convoluted method, but at this time, I don't want to make this solution any more 
                                // complicated than it already is.
                                buttons.css({ "margin-right": "50px" });
                                scrollBarsFixed = true;
                            }
                        }

                        var width = contents.width();

                        if (float === 'left' && calcLeft + width + padding != arrowLeft) {
                            calcLeft = arrowLeft - width - padding;
                            contents.css({ 'left': calcLeft });
                        }
                    };

                    fixScrollBars();

                    angular.element('#' + name + ' .image').bind('load', fixScrollBars);

                    $timeout(fixScrollBars, 500);
                }

            }
        });
angular
    .module('app')
    .component('fileFormatModal',
        {
            templateUrl: 'Scripts/App/Components/fileFormatModal.html',
            bindings: {
                resolve: '<',
                close: '&',
                dismiss: '&'
            },
            controller: function (modalService) {
                var $ctrl = this;

                $ctrl.$onInit = function () {
                    // Clone the feature so we aren't live editing the original                   
                    $ctrl.feature = _.cloneDeep($ctrl.resolve.data.feature);
                };

                $ctrl.selectOption = function (option) {
                    if (option.disabled) {
                        modalService.showAlertBanner(option.disabledMessage);
                    }
                    else {
                        $ctrl.feature.selectedOption = option;
                    }
                };

                $ctrl.ok = function () {
                    $ctrl.close({ $value: $ctrl.feature });
                };

                $ctrl.openFeaturePopover = function (feature) {
                    modalService.showPopover(feature, event);
                };
            }
        });
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
angular
    .module('app')
    .component('keypad',
        {
            templateUrl: 'Scripts/App/Components/keypad.html',
            bindings: {
                resolve: '<',
                close: '&',
                dismiss: '&'
            },
            controller: function (modalService) {
                var $ctrl = this;

                $ctrl.value = "1";
                $ctrl.max = 9999;
                $ctrl.override = true;

                $ctrl.$onInit = function () {
                    $ctrl.value = $ctrl.resolve.data.value.toString();
                    angular.element('#valueBox').focus();
                };

                $ctrl.validate = function () {
                    return parseInt($ctrl.value) <= $ctrl.max;
                };

                $ctrl.keypadPressed = function (value) {
                    if ($ctrl.override) {
                        $ctrl.value = "";
                        $ctrl.override = false;
                    }

                    if ($ctrl.value.length === 4 && parseInt($ctrl.value) === 0) {
                        $ctrl.delete();
                    }

                    $ctrl.value += value;

                    if (!$ctrl.validate()) {
                        $ctrl.showError();
                        $ctrl.value = "9999";
                        $ctrl.override = true;
                    }

                    if ($ctrl.value.length === 5) {
                        $ctrl.delete();
                    }
                };

                $ctrl.delete = function () {
                    $ctrl.value = $ctrl.value.substring(0, $ctrl.value.length - 1);
                    angular.element('#valueBox').focus();
                };

                $ctrl.clear = function () {
                    $ctrl.value = "1";
                    $ctrl.override = true;
                };

                $ctrl.update = function () {
                    if (parseInt($ctrl.value) === 0) {
                        $ctrl.value = "1";
                    }

                    $ctrl.close({ $value: parseInt($ctrl.value) });
                };

                $ctrl.showError = function (message) {
                    if (!message) {
                        message = "SDE_QUANTITY_CANNOT_BE";
                    }

                    modalService.showAlertBanner(message);
                };
            }
        });
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

(function () {
    'use strict';

    angular
        .module('app')
        .component('progressAlert',
            {
                bindings: {
                    resolve: '<',
                    close: '&',
                    dismiss: '&'
                },
                templateUrl: 'Scripts/App/Components/progressAlert.html'
            });
})();
angular
    .module('app')
    .component('progressBanner',
        {
            templateUrl: 'Scripts/App/Components/progressBanner.html',
            bindings: {
                resolve: '<',
                close: '&',
                dismiss: '&'
            },
            controller: function ($scope, $timeout) {
                var $ctrl = this;
                $ctrl.showSpinner = true;

                // The actual job status comes from the machine, but initialize to pending.
                $ctrl.status = 'SDE_PREPARING_SCAN';

                // Listen for scan updates
                $scope.$on('jobProgress', function (event, data) {
                    $ctrl.status = getStatus(data);

                    // If the job is complete display the 'complete' message and a nice checkmark
                    // for a few seconds before closing the banner
                    if (data === "Completed") {
                        $ctrl.complete = true;
                        $timeout(function () {
                            $ctrl.close();
                        }, 3000);
                    }
                });

                function getStatus(status) {
                    switch (status) {
                        case 'Preparing to Scan': return 'SDE_PREPARING_SCAN';
                        case 'Preparing to Print': return 'SDE_PREPARING_PRINT';
                        case 'Processing':
                        case 'Pending':
                        case 'JobIncoming':
                            return 'SDE_PROCESSING';
                        case 'Completed': return 'SDE_COMPLETE';
                        case 'JobCanceledByUser':
                        case 'CanceledByUser':
                            return 'SDE_CANCELLED';
                        case 'AbortBySystem':
                        case 'JobAborted':
                            return 'SDE_JOB_ABORTED';
                        case 'InputScanSizeNotDetermined': return 'SDE_INPUT_SIZE_NOT1';
                        case 'PreparingToScan': return 'SDE_PREPARING_SCAN';
                        case 'ProcessingStopped': return 'SDE_PROCESSING_STOPPED';
                        case 'Exit': return 'SDE_EXIT';
                        default: return status;
                    }
                }
            }
        });
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
angular
    .module('app')
    .component('spinBox',
        {
            bindings: {
                ngModel: '=',
                interactive: '<',
                min: '<',
                max: '<'
            },
            templateUrl: 'Scripts/App/Components/spinBox.html',
            controller: function ($timeout) {
                var $ctrl = this;
                var maxRange = 9999;
                var pressing, increments, timeout;

                $ctrl.$onInit = function () {
                    // Absolute range is currently 0-9999 since it's unlikely this control will have to handle anything but positive
                    // integer values. To be able to handle negative numbers or larger values the numbersOnly directive will have
                    // to support minus signs and the width of the control will have to vary to contain more than four digits.
                    $ctrl.min = Math.max(1, $ctrl.min || 1);
                    $ctrl.max = Math.min(maxRange, $ctrl.max || maxRange);

                    // Make sure we start in our valid range.
                    // Other bindings to the same value can still violate this of course
                    updateValue($ctrl.ngModel);
                };

                $ctrl.mouseDown = function (val) {
                    updateValue($ctrl.ngModel + val);

                    pressing = true;
                    increments = 0;

                    // Time to initially start repeating after beginning to hold the button is 1000ms
                    timeout = $timeout(function () {
                        increment(val);
                    }, 1000);
                };

                // On mouse up, cancel the current increment and make sure we don't trigger anymore.
                // The finger/mouse leaving the button also calls this function since if the user moves their
                // finger and then lets go we don't get a proper mouseUp event to handle
                $ctrl.mouseUp = function () {
                    $timeout.cancel(timeout);
                    pressing = false;
                };

                // Clamp to any min/max values we have set
                function updateValue(val) {
                    val = Number(val || 0);
                    val = Math.max(val, $ctrl.min);
                    val = Math.min(val, $ctrl.max);
                    $ctrl.ngModel = val;
                }

                function increment(val) {
                    // If the user let go of the button don't increment
                    if (!pressing) {
                        $timeout.cancel(timeout);
                        return;
                    }
                    else {
                        // If the user is still holding the button increment the model and start the process over again.
                        // As the number of increments increases the time to repeat gets faster
                        updateValue($ctrl.ngModel + val);

                        // Increments 1- 10 are 200ms, and after that 60ms.
                        increments++;
                        var repeatTime = increments < 10 ? 200 : 60;

                        // Start the next increment step
                        $timeout.cancel(timeout);
                        timeout = $timeout(function () { increment(val); }, repeatTime);
                    }
                }
            }
        });
angular
    .module('app')
    .component('toggleSwitch',
        {
            bindings: {
                ngModel: '=',
                trueValue: '<',
                falseValue: '<'
            },
            templateUrl: 'Scripts/App/Components/toggleSwitch.html',
            controller: function () {
                var $ctrl = this;

                $ctrl.toggle = function () {
                    if (($ctrl.trueValue && _.isEqual($ctrl.trueValue, $ctrl.ngModel)) || (!$ctrl.trueValue && $ctrl.ngModel))
                        $ctrl.ngModel = $ctrl.falseValue || false;
                    else {
                        $ctrl.ngModel = $ctrl.trueValue || true;
                    }
                };
            }
        });
// Try to center the header title without occluding the floating buttons

angular
    .module('app')
    .directive('actionBar', function ($timeout, $window) {

        return {
            restrict: 'A',           
            link: function (scope, element, attrs) {
                var calc = function () {
                    $timeout(function () {
                        var headerDiv = element;
                        var leftDiv = headerDiv.find('.header-left');
                        var rightDiv = headerDiv.find('.header-right');
                        var middleDiv = headerDiv.find('.header-middle');

                        var totalWidth = headerDiv.width();
                        var mid = totalWidth / 2;

                        var leftSpace = mid - leftDiv.width();
                        var rightSpace = mid - rightDiv.width();

                        var min = Math.min(leftSpace, rightSpace);
                        var w = min * 2;
                        middleDiv.css('width', w + 'px');
                    }, 100);
                }

                calc();

                angular.element($window).on('resize', calc);
                scope.$on('$destroy', function () {
                    angular.element($window).off('resize', calc);
                });
            }
        }
    });

angular.module('app')
    .directive('draggable', function () {
        return {
            restrict: 'A',
            require: ['^ngModel', '^toggleSwitch'],
            scope: {
                disabled: '@'
            },
            link: function (scope, element, attr, controllers) {
                // First parse out required stuff
                var ngModel = controllers[0];
                var trueValue = controllers[1].trueValue;
                var falseValue = controllers[1].falseValue;

                var startTouch,
                    startLeft,
                    parentWidth = parseInt(window.getComputedStyle(element[0].parentElement).getPropertyValue('width')),
                    maxLeft = parentWidth - parseInt(window.getComputedStyle(element[0]).getPropertyValue('width')),
                    halfway = maxLeft / 2;

                // If we're in a button attach a click handler to it to toggle us
                if (element.parents('button').length) {
                    angular.element(element.parents("button")[0]).bind('tap click', function (event) {
                        click();
                    });
                }

                // Update view based on model change
                ngModel.$render = function () {
                    if ((trueValue && _.isEqual(trueValue, ngModel.$modelValue)) || (!trueValue && ngModel.$modelValue)) {
                        element[0].style['left'] = maxLeft + 'px';
                    }
                    else {
                        element[0].style['left'] = 0 + 'px';
                    }
                };

                var getClientX = function (e) {
                    return e.touches ? e.touches[0].clientX : e.clientX;
                };

                var dragging = function (e) {
                    var offset = startTouch - getClientX(e);
                    var left = startLeft - offset;
                    left = Math.min(left, maxLeft);
                    left = Math.max(left, 0);

                    element[0].style['left'] = left + 'px';
                };

                var click = function (e) {
                    //if we have a true value object, toggle to the opposite                          
                    if ((trueValue && _.isEqual(trueValue, ngModel.$modelValue)) || (!trueValue && ngModel.$modelValue)) {
                        element[0].style['left'] = 0 + 'px';
                        ngModel.$setViewValue(falseValue || false);
                    }
                    else {
                        element[0].style['left'] = maxLeft + 'px';
                        ngModel.$setViewValue(trueValue || true);
                    }
                };

                var dragEnd = function (e) {
                    document.removeEventListener('mouseup', dragEnd, false);
                    document.removeEventListener('mousemove', dragging, false);
                    document.removeEventListener('touchend', dragEnd, false);
                    document.removeEventListener('touchmove', dragging, false);
                    element.removeClass('no-transition');
                    element.removeClass('pressed');

                    var endTouch = e.touches ? e.changedTouches[event.changedTouches.length - 1].clientX : e.clientX;
                    var newLeft = parseInt(element[0].style['left']);

                    // If the mouse didn't move at all during our drag, toggle the state to simulate a click
                    if (startTouch === endTouch) {
                        click(e);
                    }
                    else {
                        // Check if we dragged the slider closer to true or false and update accordingly
                        if (newLeft >= halfway) {
                            element[0].style['left'] = maxLeft + 'px';
                            ngModel.$setViewValue(trueValue || true);
                        }
                        else {
                            element[0].style['left'] = 0 + 'px';
                            ngModel.$setViewValue(falseValue || false);
                        }
                    }

                };

                var dragStart = function (e) {

                    startTouch = getClientX(e);
                    startLeft = parseInt(element[0].style['left']);

                    //prevent transition while dragging
                    element.addClass('no-transition');
                    element.addClass('pressed');

                    document.addEventListener('mouseup', dragEnd, false);
                    document.addEventListener('mousemove', dragging, false);
                    document.addEventListener('touchend', dragEnd, false);
                    document.addEventListener('touchmove', dragging, false);

                    // Disable highlighting while dragging
                    if (e.stopPropagation) e.stopPropagation();
                    if (e.preventDefault) e.preventDefault();
                    e.cancelBubble = true;
                    e.returnValue = false;
                };

                var grabber = element[0];
                grabber.ondragstart = function () { return false; };

                var down = function (e) {
                    var disabled = scope.disabled === 'true';
                    if (!disabled && (e.which === 1 || e.touches)) {
                        // left mouse click or touch screen
                        dragStart(e);
                    }
                };

                // we'll handle click events on the grabber manually in the dragging logic
                var cancel = function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                };

                grabber.addEventListener('mousedown', down, false);
                grabber.addEventListener('touchstart', down, false);
                grabber.addEventListener('click', cancel, false);

                element.on('$destroy', function () {
                    grabber.removeEventListener('mousedown', down, false);
                    grabber.removeEventListener('touchstart', down, false);
                    grabber.removeEventListener('click', cancel, false);
                });
            }
        };
    });
// Copyright © 2019 Xerox Corporation. All Rights Reserved.

angular
    .module('app')
    .directive("editableField", editableField);



function editableField($rootScope, $parse, $document, $timeout, strings) {
    //Credit to: https://stackoverflow.com/questions/20047489/how-to-define-a-function-inside-angular-js-directive
    //Credit to: https://jsfiddle.net/Mazzu/MHSk3/ -- better
    function link(scope, element, attrs) {

        scope.doGetCaretPosition = function (oField) {

            // Initialize
            var iCaretPos = 0;

            // IE Support
            if (document.selection) {

                // Set focus on the element
                oField.focus();

                // To get cursor position, get empty selection range
                var oSel = document.selection.createRange();

                // Move selection start to 0 position
                oSel.moveStart('character', -oField.value.length);

                // The caret position is selection length
                iCaretPos = oSel.text.length;
            }

            // Firefox support
            else if (oField.selectionStart || oField.selectionStart == '0')
                iCaretPos = oField.selectionStart;

            // Return results
            return (iCaretPos);
        };

        scope.getCursorPos = function ($event) {

            var myEl = $event.target;
            var cursorPosValscope = scope.doGetCaretPosition(myEl);
            scope.doSetCaretPosition(myEl, cursorPosValscope);
        };

        /*
        **  Sets the caret (cursor) position of the specified text field.
        **  Valid positions are 0-oField.length.
        */

        scope.doSetCaretPosition = function (oField, iCaretPos) {

            if (document.selection) {

                // Set focus on the element
                oField.focus();

                // Create empty selection range
                var oSel = document.selection.createRange();

                // Move selection start and end to 0 position
                oSel.moveStart('character', -oField.value.length);

                // Move selection start and end to desired position
                oSel.moveStart('character', iCaretPos - 1);
                oSel.moveEnd('character', iCaretPos);
                oSel.select();
            }

            // Firefox support
            else if (oField.selectionStart || oField.selectionStart == '0') {
                oField.selectionStart = iCaretPos;
                oField.selectionEnd = iCaretPos;
                oField.focus();
            }

        }

        scope.displayText = function () {
            if (scope.isPassword) {
                return scope.displayTextAsPassword();
            } else if (!scope.displayFormat) {
                return scope.displayTextWithoutFormat();
            } else {
                var text = strings[scope.displayFormat];
                if (!text) { return scope.displayTextWithoutFormat(); }
                text = text.replace('{0}', scope.name);
                text = text.replace('{1}', scope.ext);
                return text;
            }
        };

        scope.displayTextWithoutFormat = function () {
            if (!scope.ext) {
                return scope.name;
            } else {
                return scope.name + scope.ext;
            }
        };

        scope.displayTextAsPassword = function () {
            var text = scope.displayTextWithoutFormat();
            if (!text) { return null; }
            return "•".repeat(text.length);
        };

        scope.fieldType = function () {
            if (scope.isPassword) {
                return "password";
            } else {
                return "text";
            }
        };

        // When the container is clicked set the style to edit mode and add a listener for outside clicks to close the input
        element.closest("button").on("tap click focus", function (event) {

            element.find("input")[0].focus();
            scope.getCursorPos(event);  //XBB-190 and XBB-212  -- try to get rid of double click

            // If we're inside an active iscroll we'll ignore the click event and only respond to taps, since the iscroll will unhelpfully fire both
            if ($(event.target).parents('.wrapper').length > 0 && (event.type == 'click' || event.type == 'focus')) {

                event.stopPropagation();
                event.preventDefault();
                return;
            }

            //var target = $(event.target);
            //The Element.getBoundingClientRect() method returns the size of an element and its position relative to the viewport.
            //var elId = target.getBoundingClientRect();//target.iCaretPos;


            if (!event.isDefaultPrevented() && !scope.locked) {

                var alreadyEditing = scope.editing;

                // This puts the control into edit mode
                $timeout(function () {
                    scope.editing = true;
                    scope.updateCss(true);

                });

                // Give the input a little time to display before we try focusing/selecting it
                $timeout(function () {
                    element.find("input")[0].focus();

                    //XBB-190 -- see if this gets rid of full select
                    //Not sure why this was removed from Blackboard. There is a scan to
                    //audio ticket (MP3-266) that says this IS the desired behavior
                    if (!alreadyEditing)
                        element.find("input")[0].select();

                    scope.getCursorPos(event);  //XBB-190 and XBB-212                      
                }, 300);

                // Make sure we don't have more than one outside click handler
                $document.off('tap click', outsideClick);
                $document.on('tap click', outsideClick);
                element.find("input").off('blur', outsideClick);
                element.find("input").on('blur', outsideClick);

                // Make sure clicking this input doesn't trigger the outside click handler
                event.stopPropagation();
                event.preventDefault();


            }

        });

        //update color fields and button background
        scope.updateCss = function (edit) {
            if (edit) {
                //element.closest("button").css('background', 'white');
                element.find("input").css('box-shadow', 'none');
                element.find("span#_glyph").addClass('option-text');
                element.find("span#_subject").addClass('option-text');
            }
            else {
                // element.closest("button").css('background', '');
                element.find("span#_glyph").removeClass('option-text');
                element.find("span#_subject").removeClass('option-text');
            }
        }

        // When the user hits enter while editing the input set the field back to readonly mode
        scope.handleKeyEnter = function (key) {
            if (key.keyCode == 13) {

                document.activeElement.blur();
                $document.off('tap click', outsideClick);
                scope.editing = false;
                scope.updateCss(false);
                if (typeof EIP_CloseEmbeddedKeyboard == 'function') {
                    EIP_CloseEmbeddedKeyboard(); //dismiss device keyboard
                }

                //Fix for bug XBB-384
                event.stopPropagation();
                event.preventDefault();
                return;
            }

        }

        // Remove the event handler and set the input back to readonly mode
        var outsideClick = function () {
            window.scrollTo(0, -100);
            $('.scroll-container').scrollTop(0);
            $timeout(function () {
                $document.off('tap click', outsideClick);
                $(this).off('blur', outsideClick);
                scope.editing = false;
                scope.updateCss(false);
                if (typeof EIP_CloseEmbeddedKeyboard == 'function') {
                    EIP_CloseEmbeddedKeyboard(); //dismiss device keyboard
                }
            });
        }

        // Make sure the document event listener is removed when the component is destroyed
        element.on('$destroy', function () {
            $document.off('tap click', outsideClick);
            element.find("input").off('blur', outsideClick);
        });
    }

    //The link is a function in which other functions can be defined.  So this invokes link()
    return {

        link: link,
        restrict: 'E',
        scope: {
            name: '=',
            ext: '@',
            locked: '<',
            subject: '@',
            subjectlabel: '@',
            placeholder: '@',
            displayFormat: '@'
        },
        template:
            '<form name="filename">' +
            '<input type="{{fieldType()}}" name="flname" ng-show="editing"  xas-placeholder="{{placeholder}}" ng-readonly="!editing" maxlength="1000" class="editable-field-input option-text" ng-model="name" required ng-keydown="handleKeyEnter($event)" spellCheck="false" tabindex="-1">' +
            '<span id="_glyph" class="xrx-paperclip" style="line-height:100%" ng-if="!subject"></span>' +
            '<span id="_subject" class="emailSubject" xas-string="{{subjectlabel ? subjectlabel : \'SDE_SUBJECT3\'}}" ng-if="subject && !editing && name" style="vertical-align:middle"></span>' +
            '<span ng-hide="editing || name"  class="editable-field-label" xas-string="{{placeholder}}" style="font-weight: 100;"></span>' +
            '<span ng-hide="editing || !name" class="editable-field-label">' +
            '<span ng-bind="displayText()"></span>' +
            '</span>' +
            '</form>'

    }
}



angular
    .module('app')
    .directive('ngScrollable', ngScrollable);

function ngScrollable($rootScope, $window, $timeout, $parse, $interval, device) {

    var directive = {
        link: function (scope, element, attrs) {

            // 9th gen+ gets an iscroll scrollbar
            if (!device.isThirdGenBrowser && device.generation >= 9.0) {
                link(scope, element, attrs);
            }
            // otherwise just set overflowY so we use native scrolling
            else {
                if (attrs.scrollY !== 'false') {
                    element.css('overflowY', 'auto');
                    element.css('position', 'relative');
                    scope.$$shadowDiv = $("<div class='shadow' style='position:fixed;'></div>");
                    element.append(scope.$$shadowDiv);
                    // Do this in timeout so that content can finish loading
                    $timeout(function () {
                        // Determine location of shadow based on position of scrollable content
                        var offSet = element.offset();
                        var borderTop = parseInt(element.css("border-top-width"));
                        var borderLeft = parseInt(element.css("border-left-width"));

                        scope.$$shadowDiv.css("top", offSet.top + borderTop);
                        scope.$$shadowDiv.css("left", offSet.left + borderLeft);
                        scope.$$shadowDiv.css("height", element[0].clientHeight);
                        scope.$$shadowDiv.css("width", element[0].clientWidth);

                        if (element.innerHeight() < element[0].scrollHeight) {
                            scope.$$shadowDiv.addClass('shadow-bottom');
                        }
                    }, 500);

                    element.scroll(function () {
                        $timeout(function () {
                            var movingHeight = element.children(":first").height();
                            var scrollTop = element.scrollTop();
                            var scrollableHeight = element.height()
                            var delta = movingHeight - scrollableHeight;
                            var atBottom = scrollTop >= delta ? true : false;

                            // Adjust width so we dont have shadows on the scrollbar (and if shadows dont appear instantly, they will appear once scroll has started)
                            scope.$$shadowDiv.css("width", element[0].clientWidth);
                            scope.$$shadowDiv.css("height", element[0].clientHeight);

                            if (atBottom) {
                                scope.$$shadowDiv.removeClass('shadow-bottom');
                            } else {
                                scope.$$shadowDiv.addClass('shadow-bottom');
                            }

                            if (scrollTop == 0) {
                                scope.$$shadowDiv.removeClass('shadow-top');
                            } else {
                                scope.$$shadowDiv.addClass('shadow-top');
                            }
                        });
                    });
                }
            }

        },
        restrict: 'A',
        priority: 99,
        scope: {
            ngScrollable: '<',
            bounce: '@',
            disableMouse: '@',
            disablePointer: '@',
            disableTouch: '@',
            freeScroll: '@',
            hwCompositing: '@',
            momentum: '@',
            mouseWheel: '@',
            preventDefault: '@',
            probeType: '@',
            scrollbars: '@',
            scrollX: '@',
            scrollY: '@',
            tap: '@',
            useTransform: '@',
            useTransition: '@'
        }
    };
    return directive;

    function link(scope, element, attrs) {
        if (!!scope.ngScrollable) {
            scope.$$config = scope.ngScrollable;
            scope.$scrollEnd = $parse(scope.$$config.scrollEnd);
        }

        var contentDiv = element[0].classList.add("ninth-gen");
        //contentDiv[0].classList.add("ninth-gen");

        // Get the height of the wrapper. We will use this to watch the height
        scope.$wrapperHeight = angular.element(element).height();

        scope.scroller = new IScroll(element[0], {
            bounce: scope.bounce === 'true',
            disableMouse: scope.disableMouse === 'true',
            disablePointer: scope.disablePointer === 'true',
            disableTouch: scope.disableTouch !== 'false', //overridden default to true
            freeScroll: scope.freeScroll === 'true',
            HWCompositing: scope.hwCompositing === 'true', //overridden default to false
            momentum: scope.momentum !== 'false',
            mouseWheel: scope.mouseWheel !== 'false',
            preventDefault: scope.preventDefault !== 'false',
            probeType: scope.probeType ? parseInt(scope.probeType, 10) : 1,
            //scrollbars: scope.scrollbars !== 'false',
            scrollbars: 'custom',
            scrollX: scope.scrollX === 'true',
            scrollY: scope.scrollY !== 'false',
            tap: scope.tap !== 'false',
            useTransform: scope.useTransform !== 'false',
            useTransition: scope.useTransition === 'true', //overridden default to false
        });

        scope.$$shadowDiv = $("<div class='shadow'></div>");

        // If we have scrollable content, then apply the bottom shadow
        if (scope.scroller.maxScrollY != 0) {
            scope.$$shadowDiv.addClass('shadow-bottom');
        }
        element.append(scope.$$shadowDiv);

        scope.scroller.on('scrollStart', function () {
            // Dont apply scroll shadows if there is nothing to scroll
            if (this.maxScrollY != 0) {
                scope.$$shadowDiv.addClass('shadow-bottom');
                scope.$$shadowDiv.addClass('shadow-top');
            }
        });


        scope.scroller.on('scrollEnd', function () {
            // Dont apply scroll shadows if there is nothing to scroll
            if (this.maxScrollY != 0) {
                if (this.y == this.maxScrollY) {
                    scope.$$shadowDiv.removeClass('shadow-bottom');
                }
                if (this.y == 0) {
                    scope.$$shadowDiv.removeClass('shadow-top');
                }
            }

            if (this.y == this.maxScrollY && scope.$scrollEnd && this.y != scope.currentY) {
                scope.$apply(function () {
                    scope.$scrollEnd(scope);
                });
            }

            scope.currentY = this.y;
        });

        // Are we watching for height?
        if (scope.$$config && scope.$$config.watchHeight) {
            scope.$heightWatcher = $interval(function () {
                var currentHeight = angular.element(element.find("div").first()).height();
                var windowHeight = $(window).height();

                if (currentHeight != scope.$wrapperHeight || windowHeight != scope.$windowHeight) {
                    updateViewport(scope, element, scope.scroller);
                    scope.scroller.refresh();

                    // When viewport is updated, check if we need to add shadow again, or remove it
                    if (scope.scroller.maxScrollY != 0) {
                        scope.$$shadowDiv.addClass('shadow-bottom');
                    } else {
                        scope.$$shadowDiv.removeClass('shadow-bottom');
                    }

                    if (scope.scroller.y == 0) {
                        scope.$$shadowDiv.removeClass("shadow-top");
                    }

                    if (currentHeight != scope.$wrapperHeight)
                        scope.$wrapperHeight = currentHeight;

                    if (windowHeight != scope.$windowHeight)
                        scope.$windowHeight = windowHeight;
                }
            }, 100);
        }

        // Used to position the scrollbar properly.
        angular.element(element[0]).css("position", "relative");

        // Is this scrollable inside a popover?
        scope.$$localPopoverId = element.closest("popover").attr("id");

        element.addClass("wrapper");

        // Might be a popup.
        scope.$viewVisible = scope.$on('$viewVisible', function (key, value) {
            scope.$applyAsync(function () {
                updateViewport(scope, element, scope.scroller);
                scope.scroller.refresh();
            });
        });

        // Might be a popover
        scope.$popoverVisible = scope.$on("$popoverVisible", function (key, value) {
            if (scope.$$localPopoverId === value.id) {
                updateViewport(scope, element, scope.scroller);
                scope.scroller.refresh();
            }
        });

        // Watch for view updates.
        scope.$viewWatcher = $rootScope.$on("$viewContentLoaded", function (sc) {
            $timeout(function () {
                if (element.attr("ng-scrollable") != "") {

                    // reparse the config because it doesnt seem to be picked up in this handler...?
                    var localConfig = {};
                    localConfig.$$config = JSON.parse(element.attr("ng-scrollable"));
                    updateViewport(localConfig, element, scope.scroller);
                    scope.scroller.refresh();
                }
            }, 100);
        });

        // Unregister
        scope.$on("$destroy", function (s) {
            scope.$viewVisible();
            scope.$popoverVisible();
            scope.$viewWatcher();

            if (scope.$heightWatcher != null)
                $interval.cancel(scope.$heightWatcher);
        });
    }
}

// Helper function for determining the viewport height.
function updateViewport(scope, element, scroller) {

    // Lets us layout the scroller depending on the viewport size.
    if (scope.$$config && scope.$$config.autoHeight) {
        var padding = scope.$$config.padding || 0;
        element.height((window.innerHeight - element.offset().top) - padding);
    }
}


    angular
        .module('app')
        .directive('ngTap', ngTap)
        .directive('ngTapClick', function ($rootScope, $window, $parse, device) {

            return {
                restrict: 'A',
                scope: {
                    ngTapClick: '&'
                },
                link: function (scope, element, attrs) {
                                        
                    if (!device.isThirdGenBrowser && device.generation >= 9.0) {
                        element.on('tap', function (e) {
                            scope.ngTapClick({ $event: e });
                        });
                    }
                    else {
                        element.on('click', function (e) {
                            scope.$apply(scope.ngTapClick({ $event: e }));
                        });
                    }
                }
            };
        });

    function ngTap($rootScope, $window, $parse) {
        var directive = {
            link: link,
            restrict: 'A',
            priority: 1
        };

        return directive;

        function link(scope, element, attrs) {
            var vmAction = $parse(attrs.ngTap);

            element[0].addEventListener('tap', function (e) {
                if (!element.hasClass("disabled")) {
                    if (!scope.$$phase) {
                        scope.$apply(function (s) {
                            vmAction(s, { $event: e });
                        });
                    }
                    else {
                        scope.$applyAsync(function (s) {
                            vmAction(s, { $event: e });
                        });
                    }
                }
            }, false);
        }
    }
angular
    .module('app')
    .directive('numbersOnly', function () {
        return {
            require: ['ngModel', '^spinBox'],
            link: function (scope, element, attrs, controllers) {
                var modelCtrl = controllers[0];
                var min = controllers[1].min;
                var max = controllers[1].max;

                modelCtrl.$parsers.push(function (inputValue) {
                    if (inputValue === undefined) {
                        return '0';
                    }

                    // Don't allow non-numeric characters
                    var transformedInput = inputValue.replace(/[^0-9]/g, '');

                    // Make sure we have an actual number (default 0) and clamp to min/max bounds
                    transformedInput = parseInt(transformedInput || '0', 10);
                    transformedInput = Math.max(transformedInput, min);
                    transformedInput = Math.min(transformedInput, max);

                    // Set the view to be a string
                    modelCtrl.$setViewValue(transformedInput.toString());
                    modelCtrl.$render();

                    // Return a number for the model
                    return Number(transformedInput);
                });
            }
        };
    });
/* Copyright © 2019 Xerox Corporation. All Rights Reserved. Copyright protection claimed includes all forms and */
/* matters of copyrightable material and information now allowed by statutory or judicial law or hereinafter granted, */
/* including without limitation, material generated from the software programs which are displayed on the screen such */
/* as icons, screen display looks, etc. */
var currentTextField = null;

angular
    .module('app')
    .directive("textField", textField);

function textField($document, $timeout, device) {

    // Usage:
    //     <text-field><input></input><\text-field>
    // Creates:
    //
    var directive = {
        link: link,
        restrict: 'E',
        scope: {
            name: '=',
            placeholder: '@',
            type: '@',
            styles: '@'
        },
        transclude: true,
        template: '<ng-transclude ng-show="editing" class="{{styles}}"></ng-transclude>' +
            '<div class="textField text-medium" style="font-weight:300;" ng-bind="placeholder" ng-hide="name || editing">' +
            '</div><div class="textField text-medium" ng-bind="name" ng-show="name && !editing && (type != \'password\')">' +
            '</div><div class="textField text-medium" ng-bind="name | passwordMask" ng-show="name && !editing && (type == \'password\')"></div>'
    };
    return directive;

    function link(scope, element, attrs) {

        // When the user hits enter while editing the input set the field back to readonly mode
        scope.handleKeyEnter = function (key) {
            if (key.keyCode == 13) {
                event.stopPropagation();
                event.preventDefault();
                $timeout(outsideClick, 100);
                return false;
            }
        }

        element.find("input").attr('readonly', true);
        element.find("input").on('keydown', scope.handleKeyEnter);

        element.on("tap click", function (event) {
            currentTextField = element;

            if ($(event.target).parents('.wrapper').length > 0 && event.type == 'click') {
                event.stopPropagation();
                event.preventDefault();
                return;
            }

            element.find("input").removeAttr('readonly')

            if (!event.isDefaultPrevented() && !scope.locked) {
                var alreadyEditing = scope.editing;


                scrollTextFieldIntoView();

                // This puts the control into edit mode
                $timeout(function () {
                    scope.$apply(function () {
                        scope.editing = true;
                    });
                }, 50);

                // Give the input a little time to display before we try focusing/selecting it
                $timeout(function () {
                    element.find("input")[0].focus();

                    if (!alreadyEditing)
                        element.find("input")[0].select();

                }, 200);

                // Make sure we don't have more than one outside click handler
                $document.off('tap click', outsideClick);
                $document.on('tap click', outsideClick);
                element.find("input").off('blur', outsideClick);
                element.find("input").on('blur', outsideClick);

                // Make sure clicking this input doesn't trigger the outside click handler
                event.stopPropagation();
                event.preventDefault();
            }

        });

        var scrollTextFieldIntoView = function () {
            // Scroll element into view first:
            if (window._iScrolls) {
                // Ensure we have an iscroll to scroll with and scroll to element with 15 px of padding above element
                if (window._iScrolls.length > 0) {
                    window._iScrolls[window._iScrolls.length - 1].scrollToElement(element[0], null, 0, -15);
                    // Scroll to element doesnt execute the scroll start and scroll end events, so we have to fire manually (or update iscroll-probe)
                    $timeout(function () {
                        window._iScrolls[window._iScrolls.length - 1]._execEvent('scrollStart');
                        window._iScrolls[window._iScrolls.length - 1]._execEvent('scrollEnd');
                    }, 50);
                }
            } else {
                var scrollContainer = element.closest("div[ng-scrollable]")[0];
                if (window.innerHeight == 480) {
                    $(scrollContainer).find(".eighth-gen-keyboard-spacer").addClass("show");
                }

                if ($(scrollContainer).find(element[0]).length > 0) {
                    // get parent until we have a top
                    var inputContainer = element;
                    while (inputContainer.position().top == 0) {
                        inputContainer = inputContainer.parent();
                    }

                    // Scroll the element into position if its not already in position
                    if (Math.round(inputContainer.position().top) != 43 && Math.round(inputContainer.position().top) != 65) {
                        scrollContainer.scrollTop += inputContainer.position().top - 43;
                    }
                }
            }
        };

        // Remove the event handler and set the input back to readonly mode
        var outsideClick = function () {
            if (!device.isEighthGen) {
                var elementName = $(element[0]).attr("name");
                var currentTextFieldName = $(currentTextField[0]).attr("name");

                if (elementName === currentTextFieldName) {
                    var scrollContainer = element.closest("div[ng-scrollable]")[0];
                    scrollContainer.scrollTop = 0;
                }
            }

            $document.off('tap click', outsideClick);
            $(this).off('blur', outsideClick);
            element.find("input").attr('readonly', true);
            scope.editing = false;
            scope.$apply();
            $timeout(function () {
                if (typeof EIP_CloseEmbeddedKeyboard == 'function') {
                    EIP_CloseEmbeddedKeyboard(); //dismiss device keyboard
                }
            })
        }

        // Make sure the document event listener is removed when the component is destroyed
        element.on('$destroy', function () {
            $document.off('tap click', outsideClick);
            element.find("input").off('blur', outsideClick);
        });
    }
}

// Copyright © 2019 Xerox Corporation. All Rights Reserved.

angular
    .module('app')
    .directive('xasCompareTo', function () {
        return {
            restrict: "A",
            require: "ngModel",
            scope: {
                otherModelValue: "=xasCompareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    });

// Copyright © 2019 Xerox Corporation. All Rights Reserved.
angular
        .module('app')
        .directive('xasInputTab', xasInputTab);

    function xasInputTab() {
        // Usage:
        //     <element xasInputTab><\element>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A',
            //transclude: true,
            scope: {
                preventSubmit : '<'
            }
        };
        return directive;

        function link(scope, element, attrs) {

            var onKeyPress = function (e) {
                if (e.keyCode == '13') //user pressed enter key
                {
                    var focusedIndex = -1;
                    var textInputs = element.find("input[type=text], input[type=email], input[type=password]");
                    var focusedInput = document.activeElement;
                    if (focusedInput) {
                        focusedIndex = _.findIndex(textInputs, function (textInput) {
                            return textInput.id === focusedInput.id;
                        });

                        //element in focus is an input field
                        if (focusedIndex > -1) {
                            // If Focused Input is invalid and touched, then dont navigate, but blur to and reselect to display error
                            if ($(focusedInput).hasClass("ng-invalid") && $(focusedInput).hasClass("ng-not-empty")) {
                                focusedInput.blur();
                                $(focusedInput).closest('text-field').trigger('tap');
                                e.preventDefault();
                            } //else
                            if (focusedIndex < textInputs.length - 1) {
                                $(textInputs[focusedIndex + 1]).closest('text-field').trigger('tap'); //set next input element to focus
                                e.preventDefault(); //prevent submission
                            }
                            else {
                                //last element was in focus, dismiss the keyboard
                                textInputs[focusedIndex].blur();
                                if (typeof EIP_CloseEmbeddedKeyboard == 'function') {
                                    EIP_CloseEmbeddedKeyboard();
                                }

                                if (scope.preventSubmit)
                                    e.preventDefault();
                            }
                        }
                    }
                }
            }

            angular.element(element).on("keypress", onKeyPress);

            scope.$on('$destroy', function () {
                angular.element(element).off('keypress', onKeyPress);
            });
        }
    }



    angular
        .module('app')        
        .directive('xasPlaceholder', xasPlaceholder);


    function xasPlaceholder(strings) {

        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                xasPlaceholder: '@'
            }
        };
        return directive;

        function link(scope, element, attrs) {
            
                attrs.$observe('xasPlaceholder', function (value) {
                    var string = strings[value];
                    attrs.$set('placeholder',string || value);
                });

                attrs.$set('placeholder', strings[attrs.xasPlaceholder] || attrs.xasPlaceholder);
           
            
            var onFocus = function (e) {
                $(e.target).addClass("keepPlaceHolder");
            }

            var onBlur = function (e) {
                $(e.target).removeClass("keepPlaceHolder");
                $(e.target).removeClass("removePlaceholder");
            }

            var onKeyPress = function (e) {
                if (e.target.value != null) {
                    $(e.target).addClass("removePlaceholder");
                    $(e.target).removeClass("keepPlaceHolder");
                }
            }

            angular.element(element).on('focus', onFocus);
            angular.element(element).on('blur', onBlur);
            angular.element(element).on('input', onKeyPress);


            scope.$on('$destroy', function () {
                angular.element(element).off('focus', onFocus);
                angular.element(element).off('blur', onBlur);
                angular.element(element).off('input', onKeyPress);
            });
            
        }
    }

    angular
        .module('app')
        .directive('xasStopEvent', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    element.bind('tap', function (e) {
                        if(e.target === this)
                            e.stopPropagation();
                    });
                    element.bind('click', function (e) {
                        if (e.target === this)
                            e.stopPropagation();
                    });
                }
            };
        });
angular
      .module('app')
      .directive('xasString', function (strings) {

          return {
              restrict: 'A',
              scope: {
                  xasString: '@',
                  formatValues: '@'
              },
              link: function (scope, element, attrs) {

                  //console.log("linking string: " + scope.xasString);

                  scope.$watch(function () {
                      return [attrs.xasString, attrs.formatValues];
                  }, replaceString, true);

                  function replaceString() {
                      
                      //console.log("xasstring: " + attrs.xasString + ", formatval: " + attrs.formatValues);

                      //stringsProvider.then(function (strings) {

                      var string = strings[attrs.xasString] || attrs.xasString;
                          //console.log("found: " + string);
                          if (string && attrs.formatValues) {

                              // convert the format values list into an array (even if it's a single value) so we can index into it
                              var formatString = scope.$eval(attrs.formatValues);
                              if (!Array.isArray(formatString))
                                  formatString = [formatString];

                              // Make sure our format string and values have the same number of items
                              var matches = string.match(/\{(\d)\}/g);
                              if (matches.length !== formatString.length)
                                  throw ("Format string length mismatch between " + attrs.xasString + " and " + attrs.formatValues);

                              // Do the string replacement
                              _.each(matches, (function (item, index) {

                                  // localize the format value string if we can
                                  var fv = formatString[index].toString().trim();
                                  fv = strings[fv] || fv;

                                  string = string.replace(item, fv);
                              }));
                          }

                          //element.html('<span class=\'xas-string\'>' + string + '</span>');
                          element.html(string);                      
                          //if (scope.sanitize) {
                          //    element.html($sanitize(string).trim());
                          //}
                          //else {
                          //    element.html($compile(string)(scope.$parent));
                          //}
                      //});

                  }
              }
          }






      });
// Copyright © 2019 Xerox Corporation. All Rights Reserved.
angular
    .module('app')
    .directive('xrxShowRemoteAlert', function ($rootScope, $parse, $document, $timeout, $window, $http, $uibModal) {
        function link(scope, element, attrs) {
            scope.buttonTitle = attrs.buttontitle;
            scope.modalUrl = attrs.modalurl;
            var alertHtml = '';
            var modalObj = null;
            function showModal() {
                $("#divPrivacyMessage").html(alertHtml);
                $("#mainForm,.mainForm").hide();
                $("#divPrivacyNotes").show();
            }

            function ctrlObj($scope, $uibModalInstance) {
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }

            function closeModal() {
                modalObj.close();
            }

            $http.get(scope.modalUrl).then(function (result) {
                if (result != null && result != undefined && result.data != null && result.data != undefined) {
                    var html = result.data;
                    if (html.replace(/\s/g, "").startsWith('<xrxShowRemoteAlertContent/>')) {
                        html = html.replace('<xrxShowRemoteAlertContent />', '')
                            .replace('<xrxShowRemoteAlertContent/>', '')
                            .replace('<xrxShowRemoteAlertContent/ >', '')
                            .replace('<xrxShowRemoteAlertContent / >', '');
                        alertHtml = html;
                        $(".xrxShowRemoteAlertClss").show();
                        $("#xrxShowRemoteAlertButton").click(function () {
                            showModal();
                        });
                    }
                }
            }).catch(function (s) {
            });
        }
        return {
            link: link,
            restrict: 'E',
            scope: {
                buttonTitle: '@',
                modalUrl: '@'
            },
            template: "<button class='btn btn-medium xrxShowRemoteAlertClss' id='xrxShowRemoteAlertButton' xas-string='{{buttonTitle}}' tabindex='-1' type='button'></button>"
        }
    });

// Copyright © 2019 Xerox Corporation. All Rights Reserved.

angular
    .module('app').filter('parseDeviceConfig', function () {
        return function (envelope) {

            var doc = xrxStringToDom(envelope);
            var el = xrxFindElement(doc, ["DeviceInformationResponse", "Information"]);

            var rawInfo = xrxGetValue(el);

            var info, device, style;
            if (rawInfo.length < 4096) {
                info = xrxStringToDom(rawInfo);
                device = xrxFindElement(info, ["DeviceInformation", "device"]);
                style = xrxFindElement(info, ["DeviceInformation", "style"]);
            } else {
                device = xrxStringToDom("<?xml version='1.0' encoding='UTF-8'?><device>" + rawInfo.split("<device>")[1].split("</device>")[0] + "</device>");
                style = xrxStringToDom("<?xml version='1.0' encoding='UTF-8'?><style>" + rawInfo.split("<style>")[1].split("</style>")[0] + "</style>");
            }

            var major = $(rawInfo).find("eipSoftware > majorVersion").text();
            var minor = $(rawInfo).find("eipSoftware > minorVersion").text();
            var revision = $(rawInfo).find("eipSoftware > revision").text();

            return {
                xml: xrxDomToString(device),
                deviceName: xrxGetValue(xrxFindElement(device, ["name"])),
                macAddress: xrxGetValue(xrxFindElement(device, ["mac"])),
                serialNumber: xrxGetValue(xrxFindElement(device, ["serial"])),
                modelName: xrxGetValue(xrxFindElement(device, ["model"])),
                eipMajorVersion: major,
                eipMinorVersion: minor,
                eipRevision: revision,
                hasSNMPWS: $(rawInfo).find("SNMPWS").length > 0,
                generation: xrxGetValue(xrxFindElement(style, ["generation"])),
                eipVersion: parseFloat(major + "." + minor + "." + revision)
            }
        }
    });

angular
    .module('app').filter('parseSnmp', function () {
        return function (snmp) {

            var doc = xrxStringToDom(snmp);
            var el = xrxFindElement(doc, ['returnValue']);
            var result = xrxGetValue(el);

            return {
                value: result
            };
        }
    });

// Filter to allow orderby on collections rather than just arrays
angular
    .module('app').filter('orderObjectBy', function () {
        return function (items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function (item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if (reverse) filtered.reverse();
            return filtered;
        };
    });

angular
    .module('app').filter('error', function () {
        return function (errorResponse) {
            var errorDetails = {};

            var errorString = errorResponse.match(/<faultstring>(.*)<\/faultstring>/);
            var detail = errorResponse.match(/<detail(.*)<\/detail>/);

            if (detail) {
                var doc = xrxStringToDom(detail[0]);
                var webletElement = xrxFindElement(doc, ['WebletModificationDisabledException']);
                var authElement = xrxFindElement(doc, ["FailedAuthenticationException"]) || xrxFindElement(doc, ["FailedAuthentication"]);
                var regFullElement = xrxFindElement(doc, ['RegistryFullException']);

                if (webletElement) {
                    errorDetails.exceptionType = 'WebletModificationDisabledException';
                    errorDetails.exceptionMessage = 'SDE_INSTALLATION_CONNECTKEY_APPS';
                }
                else if (authElement) {
                    errorDetails.exceptionType = 'FailedAuthenticationException';
                    errorDetails.exceptionMessage = 'SDE_DEVICE_ADMINISTRATOR_USERNAME';
                } else if (regFullElement) {
                    errorDetails.exceptionType = 'RegistryFullException';
                    errorDetails.exceptionMessage = 'SDE_MAXIMUM_NUMBER_APPS';
                }
            }

            return errorDetails;
        };
    });

angular
    .module('app').filter('parseDeviceCapabilities', function () {
        return function (envelope) {

            var deviceCaps = [];
            var deviceCapabilites = xrxDeviceConfigParseGetDeviceCapabilities(envelope);
            var deviceJobProcessingCaps = xrxGetTheElement(deviceCapabilites, "DeviceJobProcessingCapabilities");
            var deviceCapsByService = xrxGetTheElement(deviceJobProcessingCaps, "DeviceJobProcessingCapabilitiesByServices");

            if (deviceCapsByService != null) {
                var capsByService = xrxFindElements(deviceCapsByService, "CapabilitiesByService");
                _.forEach(capsByService, function (capByService) {
                    var serviceType = xrxGetElementValue(capByService, "ServiceType").toLowerCase();
                    switch (serviceType) {
                        case 'copy':
                            deviceCaps.push('Copy');
                            break;
                        case 'workflowscanning':
                            deviceCaps.push('Scan');
                            break;
                        case 'internetfaxsend':
                        case 'faxsend':
                            if (_.indexOf(deviceCaps, 'Fax') < 0)
                                deviceCaps.push('Fax');
                            break;
                        case 'print':
                            deviceCaps.push('Print');
                            break;
                    }
                });
            }

            return deviceCaps;
        }
    });

angular
    .module('app').filter('parseDevicePrintCapabilities', function () {
        return function (envelope) {

            var deviceCaps = [];
            var deviceCapabilites = xrxDeviceConfigParseGetDeviceCapabilities(envelope);
            var deviceJobProcessingCaps = xrxGetTheElement(deviceCapabilites, "DeviceJobProcessingCapabilities");
            var deviceCapsByService = xrxGetTheElement(deviceJobProcessingCaps, "DeviceJobProcessingCapabilitiesByServices");

            if (deviceCapsByService != null) {
                var capsByService = xrxFindElements(deviceCapsByService, "CapabilitiesByService");
                _.forEach(capsByService, function (capByService) {
                    var serviceType = xrxGetElementValue(capByService, "ServiceType").toLowerCase();
                    switch (serviceType) {
                        case 'print':
                            var printCap = xrxGetTheElement(capByService, "DeviceJobProcessingCapabilities");
                            var input = xrxGetTheElement(printCap, "Input");
                            var pdl = xrxGetTheElement(input, "PDLCapabilities");
                            var pdlSupported = xrxGetTheElement(pdl, "PDLSupported");
                            var values = xrxFindElements(pdlSupported, "AllowedValue");
                            _.forEach(values, function (ele) {
                                var value = xrxGetValue(ele).toLowerCase();
                                deviceCaps.push(value);
                            });
                            break;
                    }
                });
            }

            return deviceCaps;
        }
    });

angular
    .module('app').filter('isUserDeviceAdmin', function () {
        return function (envelope) {

            var parsedSessionInfo = xrxSessionParseGetSessionInfo(envelope);

            if (parsedSessionInfo != null) {
                var rolesElement = xrxGetTheElement(parsedSessionInfo, "roles");
                if (rolesElement != null) {
                    var authorizedElement = xrxGetTheElement(rolesElement, "authorized");
                    if (authorizedElement != null) {
                        var rolesAuthorizedRoleElements = xrxFindElements(authorizedElement, "role");
                        if (rolesAuthorizedRoleElements != null) {
                            //determine if user is sys. admin
                            var indexOfAdminRole = _.findIndex(rolesAuthorizedRoleElements, function (o) { return xrxGetElementValue(o, "role").toLowerCase() == 'xesystemadministrator' });
                            if (indexOfAdminRole > -1) {
                                return true;
                            }
                        }
                    }
                }
            }

            return false;
        }
    });

angular
    .module("app").filter("convertProtocol", function () {
        return function (protocol) {
            var result = "";
            switch (protocol) {
                case "to":
                    result = "SDE_TO5";
                    break;
                case "cc":
                    result = "SDE_CC1";
                    break;
                case "bcc":
                    result = "SDE_BCC1";
                    break;
                default:
                    result = "SDE_TO5";
            }
            return result;
        };
    });

angular
    .module("app").filter("passwordMask", function () {
        return function (input) {
            var result = "";

            if (input) {
                var split = input.split('');
                for (var i = 0; i < split.length; i++) {
                    result += "•";
                }
            }
            return result;
        };
    });

angular
    .module('app').filter('stringFormat', function () {
        return function (input, params) {
            var str = input;

            if (!str)
                return input;

            _.each(str.match(/\{(\d)\}/g), (function (item, index) {
                str = str.replace(item, params[index]);
            }));

            return str;
        }
    });

angular
    .module("app").filter("translate", function (strings) {
        return function (input) {
            var result = "";
            if (input) {
                result = strings[input] || input;
            }
            return result;
        };
    }); 
// Copyright © 2019 Xerox Corporation. All Rights Reserved.

angular
    .module('app')
    .factory('scanTemplate', scanTemplate);

function scanTemplate($location, apiService, logService) {

    //
    // The types along with the validation function and formatting functions.
    //
    var XRX_SCAN_TEMPLATE_RETURN = '\n\n\r';

    var templateTypes = {
        'boolean': {
            values: ['TRUE', 'FALSE']
        },
        'enum_autoexposure': {
            supportsSimpleValidation: true,
            values: ['ON', 'OFF']
        },
        'enum_originalsubtype': {
            supportsSimpleValidation: true,
            values: ['PRINTED_ORIGINAL']
        },
        'integer': {
            validate: function (v) {
                var pattern = /^[0-9]*$/;
                return v.toString().match(pattern);
            },
            values: ['NUMBER (integer)']
        },
        'string': {
            format: function (v) {
                return "\"" + v + "\"";
            }
        },
        'enum_resolution': {  //XBB-167 requires  200 dpi, 300 dpi, 400 dpi, 600 dpi 
            supportsSimpleValidation: true,
            values: ['RES_72X72', 'RES_150X150', 'RES_100X100', 'RES_200X200', 'RES_300X300', 'RES_400X400', 'RES_600X600']
        },
        'enum_colormode': {
            supportsSimpleValidation: true,
            values: ['AUTO', 'BLACK_AND_WHITE', 'GRAYSCALE', 'FULL_COLOR']
        },
        'enum_docformat': {
            supportsSimpleValidation: true,
            values: ['XSM_TIFF_V6', 'TIFF_V6', 'JFIF_JPEG', 'PDF', 'PDF/A-1b', 'XPS']
        },
        'enum_inputorientation': {
            supportsSimpleValidation: true,
            values: ['PORTRAIT', 'LANDSCAPE']
        },
        'enum_searchabletext': {
            supportsSimpleValidation: true,
            values: ['IMAGE_ONLY', 'SEARCHABLE_IMAGE']
        },
        'enum_imagemode': {
            supportsSimpleValidation: true,
            values: ['MIXED', 'PHOTO', 'TEXT', 'MAP', 'NEWSPAPER_AND_MAGAZINE']
        },
        'enum_sided': {
            supportsSimpleValidation: true,
            values: ['ONE_SIDED', 'TWO_SIDED', 'SECOND_SIDE_ROTATION']
        },
        'enum_mediasize': {
            supportsSimpleValidation: true,
            values: ['AUTO', 'NA_5.5x7LEF', 'NA_5.5x7SEF', 'NA_5.5x8.5LEF', 'NA_5.5x8.5SEF', 'NA_8.5x11LEF',
                'NA_8.5x11SEF', 'NA_8.5x13SEF', 'NA_8.5x14SEF', 'NA_11x17SEF',
                'ISO_A5LEF', 'ISO_A5SEF', 'ISO_A4LEF', 'ISO_A4SEF', 'ISO_A3SEF',
                'JIS_B4SEF', 'JIS_B5LEF', 'JIS_B5SEF']
        }
    };

    // Perform simple validation against an array of values.
    function validateAgainstArray(v, arr) {
        return arr.find(function (d) {
            return d === v;
        });
    }

    function scanTemplate(featureValues) {
        var scriptLocation = "/api/v1/jobs/scan";
        var repoName = location.host;

        // Add properties from the section templates
        this.docSection = _.clone(__docSec);
        this.destSection = _.clone(__destSec)
        this.generalSection = _.clone(__generalSection);
        this.scanSection = _.clone(__scanSection);
        this.sections = [this.scanSection, this.generalSection, this.destSection, this.docSection];

        var params = $location.search();

        // Assign properties from incoming options

        // Destination
        logService.logMsg('scanTemplate => featureValues.jobid:' + featureValues.jobid, 'information');

        var returnUrl = apiService.getPrefix() + scriptLocation + '?' + 'jobId=' + featureValues.jobid;

        this.destSection.details.XrxHTTPScriptLocation.value = returnUrl;

        repoName = apiService.apiHost();

        this.destSection.details.DocumentPath.value = '/';
        this.destSection.details.RepositoryName.value = repoName;

        // Resolution
        this.docSection.details.Resolution.value = featureValues.resolution;

        // Scan settings   
        this.scanSection.details.SidesToScan.value = featureValues.plex;
        this.scanSection.details.InputOrientation.value = featureValues.orientation;
        this.scanSection.details.CompressionQuality.value = featureValues.quality;
        this.scanSection.details.ColorMode.value = featureValues.colorMode;
        this.scanSection.details.InputMediaSize.value = featureValues.mediaSize;
        this.scanSection.details.DocumentImageMode.value = featureValues.originalType;

        // File Name
        this.docSection.details.DocumentObjectName.value = featureValues.fileName;

        // Template name
        this.name = "Xerox_WNC" + new Date().getTime() + ".xst";
        this.generalSection.details.JobTemplateName.value = this.name;
    }

    //
    // Creates a string representation of the template.
    //
    scanTemplate.prototype.toString = function () {
        var _sectionStrings = [];

        for (var index = 0; index < this.sections.length; index++) {
            var section = this.sections[index];

            var sectionString = section.name + XRX_SCAN_TEMPLATE_RETURN;

            //handle's multiple destinations
            if (section.name == __destSec.name && section.details.constructor === Array) {
                _.each(section.details, function (detail, index) {
                    sectionString += "file_" + (index + 1) + transformObjectToTemplateSection(detail);
                });
            }
            else
                sectionString += transformObjectToTemplateSection(section.details);

            _sectionStrings.push(sectionString);
        }

        // Join them all up.
        return _sectionStrings.join('end' + XRX_SCAN_TEMPLATE_RETURN) + 'end' + XRX_SCAN_TEMPLATE_RETURN;
    }

    //.
    function transformObjectToTemplateSection(details) {
        var sectionString = '{' + XRX_SCAN_TEMPLATE_RETURN;

        // Get the values of the template.
        _.keys(details).forEach(function (detail) {
            var typeName = details[detail].type;
            var typeValue = details[detail].value;

            // Get the formatting function.
            var fun = templateTypes[typeName];

            // Can we validate?
            if (fun) {
                // Do we have a validation function? If not we might be able to use the simple validation function.
                var validateFunction = fun.validate ||
                    ((fun.supportsSimpleValidation && fun.supportsSimpleValidation == true) ? validateAgainstArray : null);

                if (validateFunction && !validateFunction(typeValue, fun.values))
                    throw new ScanTemplateFormatException(typeValue, detail, templateTypes[typeName].values);
            }

            // Reformat if necessary.
            if (fun && fun.format) {
                typeValue = fun.format(typeValue);
            }

            // Format the entry
            sectionString += '\t' +
                typeName + ' ' +
                detail + ' = ' +
                typeValue + ';' +
                XRX_SCAN_TEMPLATE_RETURN;
        });

        sectionString += '}' + XRX_SCAN_TEMPLATE_RETURN;
        return sectionString;
    }

    //
    // Exception thrown if the scan template is invalid.
    // 
    function ScanTemplateFormatException(value, propName, acceptableValues) {
        this.value = value;
        this.acceptableValues = acceptableValues;
        this.propName = propName;
        this.toString = function () {
            return "The scan template is invalid. The property: " + propName +
                " is invalid. The acceptable values are: " + acceptableValues.join(',');
        };
    }

    // Scanner related settings.
    var __scanSection = {
        name: '[service xrx_svc_scan]',
        details: {
            AutoContrast: { type: 'boolean', value: 'FALSE' },
            AutoExposure: { type: 'enum_autoexposure', value: 'OFF' },
            CompressionQuality: { type: 'integer', value: 128 },
            Darkness: { type: 'integer', value: 0 },
            Contrast: { type: 'integer', value: 0 },
            OriginalSubType: { type: 'enum_originalsubtype', value: 'PRINTED_ORIGINAL' },
            InputEdgeErase: { type: 'struct_borders', value: '2/2/2/2/mm' },
            InputMediaSize: { type: 'enum_mediasize', value: 'AUTO' },
            InputOrientation: { type: 'enum_inputorientation', value: 'PORTRAIT' },
            Magnification: { type: 'struct_magnification', value: 'NONE' },
            Sharpness: { type: 'integer', value: 0 },
            Saturation: { type: 'integer', value: 0 },
            ColorMode: { type: 'enum_colormode', value: 'FULL_COLOR' },
            SidesToScan: { type: 'enum_sided', value: 'ONE_SIDED' },
            DocumentImageMode: { type: 'enum_imagemode', value: 'MIXED' },
            BlankPageRemoval: { type: 'enum_blankpageremoval', value: 'INCLUDE_ALL_PAGES' }
        }
    };

    // General section
    var __generalSection = {
        name: '[service xrx_svc_general]',
        details: {
            DCSDefinitionUsed: { type: 'enum_DCS', value: 'DCS_GENERIC' },
            JobTemplateCharacterEncoding: { type: 'enum_encoding', value: 'UTF-8' },
            ConfirmationStage: { type: 'enum_confstage', value: 'AFTER_JOB_COMPLETE' },
            JobTemplateCreator: { type: 'string', value: 'scanTemplate.js' },
            SuppressJobLog: { type: 'boolean', value: 'TRUE' },
            JobTemplateLanguageVersion: { type: 'string', value: '4.00.07' },
            JobTemplateName: { type: 'string', value: '' }, // Random name of the template
            ConfirmationMethod: { type: 'enum_confmethod', value: 'NONE' }
        }
    };

    var __destSec = {
        name: '[service xrx_svc_file]',
        details: {
            RepositoryAlias: { type: 'string', value: 'AG_SCAN' },
            FilingProtocol: { type: 'enum_filingprotocol', value: 'XRXHTTP' }, //FTP, HTTP, HTTPS, SMB
            RepositoryVolume: { type: 'string', value: '' }, //share folder path
            RepositoryName: { type: 'string', value: '' }, // server 
            DocumentPath: { type: 'string', value: '' },
            ServerValidationReq: { type: 'boolean', value: 'FALSE' },
            DocumentFilingPolicy: { type: 'enum_filingpolicy', value: 'NEW_AUTO_GENERATE' },
            XrxHTTPScriptLocation: { type: 'string', value: '' }, // web application name and route
            UserNetworkFilingLoginName: { type: 'string', value: '' },
            UserNetworkFilingLoginID: { type: 'string', value: '' }
        }
    };


    // Document section

   var __docSec = {
        name: '[doc_object xrx_document]',
        details: {
            DocumentFormat: { type: 'enum_docformat', value: 'PDF' },
            DocumentObjectName: { type: 'string', value: 'XeroxScan' },
            CompressionsSupported: { type: 'enum_compression', value: 'ANY' },
            MixedTypesSupported: { type: 'enum_mixedtype', value: 'MULTI_MASK_MRC, 3_LAYER_MRC' },
            MixedCompressionsSupported: { type: 'enum_mixedcompressions', value: 'ANY_BINARY, ANY_CONTONE' },
            Resolution: { type: 'enum_resolution', value: 'RES_300X300' },
            OutputImageSize: { type: 'enum_outputsize', value: 'SAME_AS_ORIGINAL' },
            UserData: { type: 'ref_invocation', value: '' }
        }
    };

    return scanTemplate;
}

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
// Copyright © 2019 Xerox Corporation. All Rights Reserved.
angular
    .module('app')
    .factory('featurePopoverService', featurePopoverService);

function featurePopoverService() {
    var service = {};

    service.popoverState = {};

    return service;
}
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
// Copyright © 2019 Xerox Corporation. All Rights Reserved.
//XBB-168 Modify Ordering of options
angular
    .module('app')
    .factory('scanOptionsService', scanOptionsService);

function scanOptionsService(logService, strings) {

    var service = {};
    // File Name

    service.fileName = "Xerox Scan";
    service.email = '';

    // File Format

    service.fileFormat = {
        name: 'fileFormat',
        title: 'SDE_FILE_FORMAT',
        icon: 'file_name_and_format_48.png',
        options: [{
            value: 'docx',
            title: '.docx',
            icon: 'filetype_docx_48.png',
            isDefault: true
        },  {
            value: 'txt',
            title: '.txt',
            icon: 'filetype_txt_48.png'
        }
        ],
        subFeatures: [{
            name: 'archivalFormat',
            title: 'SDE_ARCHIVAL_PDFA',
            enabledIf: 'pdf',
            type: 'toggle',
            options: [{
                value: false,
                isDefault: true
            }, {
                value: true
            }]
        }]
    };

    //XBB-168 - Order by: 2-Sided Scanning, Resolution, Output Color, Original Orientation 
    service.scanFeatures = [
        // Plex
        {
            name: 'plex',
            title: 'SDE_2SIDED_SCANNING',
            icon: '2_sided_48.png',
            options: [{
                value: 'ONE_SIDED',
                title: 'SDE_1SIDED',
                icon: '2_sided_1_48.png',
                isDefault: true
            }, {
                value: 'TWO_SIDED',
                title: 'SDE_2SIDED',
                icon: '2_sided_2_48.png'
            }, {
                value: 'SECOND_SIDE_ROTATION',
                title: 'SDE_2SIDED_ROTATE_SIDE',
                icon: '2_sided_rotate_48.png'
            }]
        },
        // Original Size
        {
            name: 'originalSize',
            title: 'SDE_ORIGINAL_SIZE',
            icon: 'original_size_48.png',
            options: [
                {
                    value: 'AUTO',
                    title: 'SDE_AUTO_DETECT',
                    isDefault: true
                },
                {
                    value: '8_5_x_11_Portrait',
                    title: '8.5 x 11"',
                    glyph: 'xrx-portrait'
                },
                {
                    value: '8_5_x_11_Landscape',
                    title: '8.5 x 11"',
                    glyph: 'xrx-landscape'
                },
                {
                    value: '8_5_x_14_Landscape',
                    title: '8.5 x 14"',
                    glyph: 'xrx-landscape'
                },
                {
                    value: '11_x_17_Landscape',
                    title: '11 x 17"',
                    glyph: 'xrx-landscape'
                },
                {
                    value: 'A4_Portrait',
                    title: 'A4',
                    glyph: 'xrx-portrait'
                },
                {
                    value: 'A4_Landscape',
                    title: 'A4',
                    glyph: 'xrx-landscape'
                },
                {
                    value: 'A3_Landscape',
                    title: 'A3',
                    glyph: 'xrx-landscape'
                }
            ]
        } 
    ];

    service.resetFeatureSettings = function () {
        _.each(service.scanFeatures, function (feature) {
            setDefaults(feature)
        });
        setDefaults(service.fileFormat);
    }

    // Set defaults for each of the features (and the fileformat). We want these to be actual
    // object references because of how we manipulate them
    _.each(service.scanFeatures, function (feature) {
        setDefaults(feature)
    });
    setDefaults(service.fileFormat);

    // Set selected options for the features (and any subfeatures) to the default based on the data
    function setDefaults(feature) {
        _.each(feature.subFeatures, function (subFeature) {
            setDefaults(subFeature);
        });

        if (feature.options) {
            feature.selectedOption = _.find(feature.options, 'isDefault')
        }
    }

    service.getValues = function () {
        var featuresList = service.scanFeatures;

        //var langStr = featuresList[0].selectedOption.value;

        //logService.logMsg('scanOptionsService => getValues => langStr:' + langStr, 'information');

        var sidedStr = featuresList[0].selectedOption.value;
        var originalSizeStr = featuresList[1].selectedOption.value;

        var values = {};
        switch (originalSizeStr) {
            case "8_5_x_11_Portrait":
                values.mediaSize = 'NA_8.5x11LEF';
                values.orientation = 'PORTRAIT';
                break;
            case "8_5_x_11_Landscape":
                values.mediaSize = 'NA_8.5x11SEF';
                values.orientation = 'LANDSCAPE';
                break;
            case "8_5_x_14_Landscape":
                values.mediaSize = 'NA_8.5x14SEF';
                values.orientation = 'LANDSCAPE';
                break;
            case "11_x_17_Landscape":
                values.mediaSize = 'NA_11x17SEF';
                values.orientation = 'LANDSCAPE';
                break;
            case "A4_Portrait":
                values.mediaSize = 'ISO_A4LEF';
                values.orientation = 'PORTRAIT';
                break;
            case "A4_Landscape":
                values.mediaSize = 'ISO_A4SEF';
                values.orientation = 'LANDSCAPE';
                break;
            case "A3_Landscape":
                values.mediaSize = 'ISO_A3SEF';
                values.orientation = 'LANDSCAPE';
                break;
            default:
                values.mediaSize = 'AUTO';
                values.orientation = 'PORTRAIT';
                break;
        }

        values.fileFormat = service.fileFormat.selectedOption.value;
        values.archivalFormat = service.fileFormat.subFeatures[0].selectedOption.value;
        values.colorMode = 'AUTO';
        values.combineFiles = true;
        //values.language = langStr;
        values.originalType = 'MIXED';
        values.plex = sidedStr;
        values.quality = '128';
        values.resolution = 'RES_300X300';
        values.searchableText = 'SEARCHABLE_IMAGE';
        //values.fileName = service.fileName;
        // To fix bug where the popover config menus do not appear (only dim the screen) when selecting non-latin-char-based languages.
        values.fileName = window.btoa(unescape(encodeURIComponent(service.fileName)));
        values.email = service.email;
        return values;
    }

    // Add a new property to the features array with the selected option value for that feature.
    // Recurse through any subfeatures (file format)
    function mapSelected(feature, feats) {
        _.each(feature.subFeatures, function (f) {
            mapSelected(f, feats)
        });
        var p = {};
        p[feature.name] = feature.selectedOption.value;
        _.merge(feats, p);
    }

    // Check if any of this features options are disabled
    service.updateDisabledOptions = function (feature) {
        var currentOptions = service.getValues();

        _.each(feature.options, function (option) {
            _.each(option.disabledIf, function (disabledCondition) {
                if (currentOptions[disabledCondition.feature] === disabledCondition.value) {
                    option.disabled = true;
                    option.disabledMessage = disabledCondition.message;
                    return false;
                }
                else {
                    option.disabled = false;
                    option.disabledMessage = null;
                }
            });
        });
    }

    return service;

}

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
// Copyright © 2019 Xerox Corporation. All Rights Reserved.
angular
    .module('app')
    .factory('storageService', storageService);

function storageService() {
    var service = {};

    var cryptoKey = 'QkQwQTEyNDUtQzhENy00RTc5LUJEMUMtNjI5REM4MTBDRERG';

    function encrypt(value) {
        return CryptoJS.AES.encrypt(value, cryptoKey);
    }

    function decrypt(value) {
        if (value) {
            try {
                var decryptedBytes = CryptoJS.AES.decrypt(value, cryptoKey);
                return decryptedBytes.toString(CryptoJS.enc.Utf8);
            } catch (err) {
                return value;
            }
        }
        return value;
    }

    var provider = function (storageProviderName, useEncryption) {

        var storageProvider = null;

        if (storageProviderName == 'local') {
            storageProvider = localStorage;
        } else {
            storageProvider = sessionStorage;
        }

        this.getItem = function (key) {
            var value = storageProvider.getItem(key);

            if (useEncryption) {
                return decrypt(value);
            } else {
                return value;
            }
        }

        this.setItem = function (key, value) {
            if (useEncryption) {
                storageProvider.setItem(key, encrypt(value));
            } else {
                storageProvider.setItem(key, value);
            }
        }
    }

    service.getLocalStorage = function (useEncryption) {
        return new provider('local', useEncryption);
    }

    service.getSessionStorage = function (useEncryption) {
        return new provider('session', useEncryption);
    }

    return service;
}
angular
    .module('app')
    .factory('wnclogService', wnclogService);

function wnclogService() {
    var service = {};
    return service;
};
}());
