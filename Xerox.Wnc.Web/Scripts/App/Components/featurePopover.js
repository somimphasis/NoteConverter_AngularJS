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