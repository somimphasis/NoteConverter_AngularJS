
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
