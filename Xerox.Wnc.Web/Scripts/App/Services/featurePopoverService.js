// Copyright © 2019 Xerox Corporation. All Rights Reserved.
angular
    .module('app')
    .factory('featurePopoverService', featurePopoverService);

function featurePopoverService() {
    var service = {};

    service.popoverState = {};

    return service;
}