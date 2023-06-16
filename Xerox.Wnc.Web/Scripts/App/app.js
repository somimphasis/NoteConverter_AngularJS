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