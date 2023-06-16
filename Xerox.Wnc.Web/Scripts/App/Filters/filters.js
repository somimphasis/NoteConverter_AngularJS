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