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