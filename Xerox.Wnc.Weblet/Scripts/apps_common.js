var redirectURL = 'https://wnc-web.services.xerox.com'
var apiUrl = 'https://wncservice.services.xerox.com';
var apiPrefix = '';
var baseUrl = redirectURL;
var translationFile = 'translations.json';
var localizedData;
var uiLanguage;

function checkConnectivity() {

    // load localized data one time.
    // then load the image from server for connectivity check.
    $.ajax({
        type: 'GET',
        cache: false,
        url: translationFile,
        datatype: 'text',
        success: function (data) {
            parseLocalizedData(data);
            pingServer();
        },
        error: function () {
            parseLocalizedData('{' +
                '"en": {' +
                '"SDE_CLOSE": "Close",' +
                '"SDE_PLEASE_TRY_AGAIN2": "Please try again later.",' +
                '"SDE_IF_PROBLEM_PERSISTS3": "If the problem persists, contact Xerox support.",' +
                '}');
            pingServer();
        }
    });

}

function callback_failure() {
    $('#container').load('Views/ErrorNextWave.html', function () {
        displayLocalizedData('SDE_SERVICE_CURRENTLY_NOT1', 'SDE_PLEASE_TRY_AGAIN2', 'SDE_IF_PROBLEM_PERSISTS3');
    });
}

function pingServer() {

    $('#container').load('Views/ProgressBoxNextWave.html', function () { displayLocalizedData(); });

    $.ajax({
        type: "GET",
        cache: false,
        url: baseUrl + "/HealthCheck",
        datatype: "text",
        success: function (data) {
            checkWebservices();
        },
        error: function (xhr, asd, error) {
            callback_failure();
        }
    });
}


var APP_CONFIG = (function () {
    return {
        goToPage: function (shortPath) {
            var userId = window.Manifest.UserGuid;
            var deviceId = window.Manifest.Devices[0].deviceId;
            var appId = window.Manifest.EipApplicationId;
            var galleryServerRoot = window.Manifest.WebAppServerPath;
            var fullUrl = baseUrl + shortPath;

            fullUrl += '#!/'
            fullUrl += "?deviceId=" + deviceId;
            fullUrl += "&userId=" + userId;
            fullUrl += "&appId=" + appId;
            fullUrl += "&galleryServerRoot=" + encodeURIComponent(galleryServerRoot);   
            fullUrl += "&apiUrl=" + encodeURIComponent(apiUrl);
            fullUrl += "&apiPrefix=" + encodeURIComponent(apiPrefix);

            window.location.href = fullUrl;
        }
    };
})();

function parseLocalizedData(data) {
    try {
        localizedData = JSON && JSON.parse(data) || $.parseJSON(data);
    }
    catch (e) {
        localizedData = data;
    }
    uiLanguage = resolveSupportedLanguage();
}

function displayLocalizedData(line1, line2, line3){
    var localizeElements = $(".localize");

    for (var index = 0; index < localizeElements.length; index++) {
        localizeElements[index].innerHTML = getLocalizedString(localizeElements[index].innerHTML.trim(), uiLanguage);
    }

    //Also translate localize line1, 2 and 3
    if (line1)
        $(".localizeLine1").text(getLocalizedString(line1, uiLanguage));
    if (line2)
        $(".localizeLine2").text(getLocalizedString(line2, uiLanguage));
    if (line3)
        $(".localizeLine3").text(getLocalizedString(line3, uiLanguage));
}

function resolveSupportedLanguage() {
    var language = window.navigator.userLanguage || window.navigator.language;
    var dashPosition = language.indexOf('-');

    if (0 < dashPosition) {
        language = language.substr(0, dashPosition);
    }
    return !$.isEmptyObject(language) ? language : 'en';
}

function getLocalizedString(enumName, language) {
    var langData = localizedData[language];
    return langData[enumName];
}

function exit() {
    xrxSessionExitApplication('http://127.0.0.1', null);
}

function getDeviceConfig() {
    xrxDeviceConfigGetDeviceInformation(null, deviceConfigSuccess, deviceConfigFailure);
}

function checkWebservices() {
    // Verify Scan
    xrxScanV2GetInterfaceVersion(null, function () {
        // Verify Scan Template
        xrxTemplateGetInterfaceVersion(null, function () {
            // Verify Device Config
            xrxDeviceConfigGetInterfaceVersion(null, function () {
                // Verify Job Managment
                xrxJobMgmtGetInterfaceVersion(null, function () {
                    // All webservices working, go to app
                    APP_CONFIG.goToPage('/index.html');
                }, callback_webservices_failure);
            }, callback_webservices_failure);
        }, callback_webservices_failure);
    }, callback_webservices_failure);
}

function callback_webservices_failure() {    
    $('#container').load('Views/ErrorNextWave.html', function () {
        displayLocalizedData('SDE_TO_USE_APP1');
    });
}
