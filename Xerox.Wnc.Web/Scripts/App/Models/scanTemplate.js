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
