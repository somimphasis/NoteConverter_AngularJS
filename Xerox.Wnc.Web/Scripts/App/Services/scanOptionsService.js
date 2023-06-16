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
