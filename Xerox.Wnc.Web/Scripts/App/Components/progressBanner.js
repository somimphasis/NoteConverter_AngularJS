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