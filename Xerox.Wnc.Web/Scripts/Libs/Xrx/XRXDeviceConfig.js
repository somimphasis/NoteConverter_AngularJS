/*
 * XRXDeviceConfig.js
 * Copyright (C) Xerox Corporation, 2012, 2013.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox DeviceConfig Api Web services.
 *
 * @revision    04/05/2012
 *              09/21/2012  AHB Expanded functionality to parse payload
 *              10/15/2012  AHB Updated
 *              12/20/2012  AHB Added xrxGetDeviceInformation pass through to remain compatible with other versions
 *              08/01/2013  AHB Added synchronous behavior
 *				01/26/2017  TC  Fixed a typo in xrxDeviceConfigGetInterfaceVersion() parameters.
 *				05/21/2018	TC	Updated comments.
 *				10/10/2018	DW	Added GetAddressBook call.
 *				12/04/2018  TC  Removed the use of xrxUnescape().
 */

/****************************  CONSTANTS  *******************************/

var XRX_DEVICECONFIG_NAMESPACE = 'xmlns="http://www.xerox.com/webservices/office/device_configuration/1"';

var XRX_DEVICECONFIG_PATH = '/webservices/office/device_configuration/1';

/****************************  FUNCTIONS  *******************************/


//  DeviceConfig Interface Version


/**
* This function gets the DeviceConfig interface version and returns the parsed values.
*
* @param {string}	url					destination address
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxDeviceConfigGetInterfaceVersion( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_DEVICECONFIG_PATH;
    var sendReq = xrxDeviceConfigGetInterfaceVersionRequest();
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the DeviceConfig interface version request.
*
* @return {string}	xml request
*/
function xrxDeviceConfigGetInterfaceVersionRequest()
{
	return	XRX_SOAP11_SOAPSTART
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_DEVICECONFIG_NAMESPACE, '' )
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {string}	Major.Minor.Revision
*/
function xrxDeviceConfigParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","Revision"] ) );
}


//  GetDeviceConfigInfo


/**
* This function retrieves the DeviceConfigInfo data.
*
* @param {string}	url					destination address
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxDeviceConfigGetDeviceInformation( url, callback_success, callback_failure, timeout, async )
{
    return xrxDeviceConfigGetDeviceInfo( url, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function retrieves the DeviceConfigInfo data.
* @private
* @param {string}	url					destination address
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling
*										the callback_failure routine (0 = no timeout)
*/
function xrxDeviceConfigGetDeviceInfo( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_DEVICECONFIG_PATH;
	var sendReq = xrxDeviceConfigGetDeviceInfoRequest();
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the DeviceConfig Info data request.
*
* @return {string}	xml request
*/
function xrxDeviceConfigGetDeviceInfoRequest()
{
	return	XRX_SOAP11_SOAPSTART
			+ xrxCreateTag( 'GetDeviceInformationRequest', XRX_DEVICECONFIG_NAMESPACE, '' )
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {object}  xml payload in DOM form
*/
function xrxDeviceConfigParseGetDeviceInfo( response )
{
	var data = xrxGetElementValue( xrxStringToDom( response ), "Information" );
	if(data != null)
	    data = xrxStringToDom( data );
	return data;
}

/**
* This function returns the payload of the response.
*
* @param {string}	response	web service response in string form
* @return {string}  escaped xml payload in string form
*/
function xrxDeviceConfigParseGetDeviceInfoPayload( response )
{
	return xrxParsePayload( response, "Information" );
}


//  GetDeviceCapabilities


/**
* This function retrieves the DeviceCapabilities data.
*
* @param {string}	url					destination address
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxDeviceConfigGetDeviceCapabilities( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_DEVICECONFIG_PATH;
	var sendReq = xrxDeviceConfigGetDeviceCapabilitiesRequest();
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the DeviceConfig Capabilities data request.
*
* @return {string}	xml request
*/
function xrxDeviceConfigGetDeviceCapabilitiesRequest()
{
	return	XRX_SOAP11_SOAPSTART
			+ xrxCreateTag( 'VoidRequest', XRX_DEVICECONFIG_NAMESPACE, '' )
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {object}  xml payload in DOM form
*/
function xrxDeviceConfigParseGetDeviceCapabilities( response )
{
	var data = xrxGetElementValue( xrxStringToDom( response ), "JobModelCapabilities_DeviceJobProcessingCapabilities" );
	if(data != null)
	    data = xrxStringToDom( data );
	return data;
}

/**
* This function returns the the payload of the response.
*
* @param {string}	response	web service response in string form
* @return {string}	escaped xml payload in string form
*/
function xrxDeviceConfigParseGetDeviceCapabilitiesPayload( response )
{
    return xrxParsePayload( response, "JobModelCapabilities_DeviceJobProcessingCapabilities" );
}


//  GetWorkflowManagementState


/**
* This function retrieves the Workflow Management State data.
*
* @param {string}	url					destination address
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxGetWorkflowManagementState( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_DEVICECONFIG_PATH;
	var sendReq = xrxGetWorkflowManagementStateVoidRequest();
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the Workflow Management State data request.
*
* @return {string}	xml request
*/
function xrxGetWorkflowManagementStateVoidRequest()
{
	return	XRX_SOAP11_SOAPSTART
			+ xrxCreateTag( 'GetWorkflowManagementStateVoidRequest', XRX_DEVICECONFIG_NAMESPACE, '' )
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {object}  xml payload in DOM form
*/
function xrxDeviceConfigParseGetWorkflowManagementState( response )
{
	var data = xrxGetElementValue( xrxStringToDom( response ), "WorkflowManagementStateSchema_WorkflowManagementState" );
	if(data != null)
	    data = xrxStringToDom( data );
	return data;
}

/**
* This function returns the the payload of the response.
*
* @param {string}	response	web service response in string form
* @return {string}	escaped xml payload in string form
*/
function xrxDeviceConfigParseGetWorkflowManagementStatePayload( response )
{
    return xrxParsePayload( response, "WorkflowManagementStateSchema_WorkflowManagementState" );
}


//  GetAddressBook


/**
* This function gets address book data that is configured on the device
*
* @param {string}	url					destination address
* @param {string}	addressBookQuery	xml payload to configure address book query
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/


function xrxDeviceConfigGetAddressBook( url, addressBookQuery, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_DEVICECONFIG_PATH;
	var sendReq = xrxDeviceConfigGetAddressBookRequest(addressBookQuery);
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the request.
*
* @return {string}  xml request
*/
function xrxDeviceConfigGetAddressBookRequest(addressBookQuery)
{
    var resq = XRX_SOAP11_SOAPSTART
			+ xrxCreateTag( 'GetAddressBookRequest', XRX_DEVICECONFIG_NAMESPACE, xrxCreateTag( 'AddressBookRequestResponseSchema_GetAddressBookRequestPayload', '', addressBookQuery ) )
			+ XRX_SOAPEND;
    return resq;
}

/**
* This function returns the address book list.
*
* @param {string}	response	web service response in string form
* @return {object}	Address Book xml payload in DOM form
*/
function xrxDeviceConfigParseGetAddressBook( response )
{
	return xrxDeviceConfigParseListAddressBook( response );
}

/**
* This function returns the address book list.
*
* @param {string}	response	web service response in string form
* @return {object}	Address Book xml payload in DOM form
*/
function xrxDeviceConfigParseListAddressBook( response )
{
	return xrxStringToDom( xrxDeviceConfigParseListAddressBookString(response) );
}

/**
* This function retrieves the Address book payload from the response
*
* @param {string}	response 	web service response in string form
* @return {string} 	Address Book xml payload in string form
*/
function xrxDeviceConfigParseListAddressBookString( response )
{
	var resultStr = '';
	var searchStr = "GetAddressBookResponsePayload";
	var endIndex = response.lastIndexOf(searchStr);
	var responseSubStr = response.substring(0, endIndex - 1);
	if (endIndex >= 0) {
		endIndex = endIndex + searchStr.length + 1;
		var startIndex = responseSubStr.lastIndexOf(searchStr);
		if (startIndex >= 0) {
			responseSubStr = responseSubStr.substring(0, startIndex);
			startIndex = responseSubStr.lastIndexOf("&lt;");
			if (startIndex < 0) {
				startIndex = responseSubStr.lastIndexOf("<");
			}
			resultStr = response.substring(startIndex, endIndex);
		}
	}
	return resultStr;
}

/**
* This function retrieves the address book JSON object from the payload
*
* @param {string}	payload 	Address Book xml payload string
* @return {object} 	Address Book JSON object
*/
function xrxDeviceConfigParseAddressBookJSON( payload )
{

   	var json = JSON.parse(xrxGetElementValue(payload, "AddressBookData"));
	return json;
}



/*************************  End of File  *****************************/


