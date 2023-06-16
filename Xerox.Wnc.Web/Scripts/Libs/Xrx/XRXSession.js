/* 
 * XrxSession.js
 * Copyright (C) Xerox Corporation, 2007, 2008, 2009, 2010, 2011, 2012, 2013.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Session Api Web services.
 *
 * @revision    04/26/2012  AHB Added xrxSessionParseGetInterfaceVersion
 *              04/2012 TC  Added SetSession functionality
 *              10/15/2012  AHB Updated
 *              08/01/2013  AHB Added synchronous behavior and updated constants
 *				06/11/2015  TC  Use XRX_SOAP11_SOAPSTART instead of XRX_SOAPSTART.
 *				09/01/2016  TC  Use XRX_SESSION_SOAPSTART instead of XRX_SOAP11_SOAPSTART.
 *				05/21/2018	TC	Updated comments.
 *              12/04/2018  TC  Removed the use of xrxUnescape().
 *              03/07/2019  DW  Added ability to request sAMAccountName & 
 *								userPrincipalName from LDAP session in
 *								xrxSessionGetSessionInfo call.
 *              12/09/2020  MC  Added GetSecurityToken.
 */

/****************************  CONSTANTS  *******************************/

var XRX_SESSION_NAMESPACE = 'xmlns="http://www.xerox.com/webservices/office/cuisession/1"';

var XRX_SESSION_INFORMATION_NAMESPACE = 'xmlns="http://schemas.xerox.com/office/cui/sessioninformation/1"';

var XRX_SESSION_PATH = '/webservices/office/cuisession/1';

var XRX_SESSION_SOAPSTART = '<?xml version="1.0" encoding="utf-8"?>'
	+ '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '
	+ 'xmlns:xsd="http://www.w3.org/2001/XMLSchema">'
	+ '<soap:Body>';

/****************************  FUNCTIONS  *******************************/


//  Session Interface Version


/**
* This function gets the Session interface version and returns the parsed values.
*
* @param {string}	url					destination address
* @param {string}	callback_success	function to callback upon successful completion
* @param {string} 	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxSessionGetInterfaceVersion( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_SESSION_PATH;
    var sendReq = xrxSessionGetInterfaceVersionRequest();
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the Session interface version request.
*
* @return {string}	xml request
*/
function xrxSessionGetInterfaceVersionRequest()
{
	return	XRX_SESSION_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_SESSION_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string} 	response	web service response in string form
* @return {string}	Major.Minor.Revision
*/
function xrxSessionParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","Revision"] ) );
}


//  Exit Application


/**
* This function initiates an exit from EIP. There is no success callback
* because EIP will exit upon success of the web service call.
*
* @param {string}	url					destination address
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxSessionExitApplication( url, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_SESSION_PATH;
	var sendReq = xrxSessionExitApplicationRequest();
	return xrxCallWebservice( sendUrl, sendReq, null, callback_failure, timeout, null, null, null, async );
}    

/**
* This function builds the Exit Application request.
*
* @return {string}	xml request
*/
function xrxSessionExitApplicationRequest()
{
	return	XRX_SESSION_SOAPSTART 
		    + xrxCreateTag( 'ExitApplicationRequest', XRX_SESSION_NAMESPACE, '' ) 
		    + XRX_SOAPEND;
}


//  GetSessionInfo


/**
* This function retrieves the SessionInfo data.
*
* @param {string}	url					destination address
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* @param {object}   [ldap]              object containing LDAP attributes to 
*                                       return in the session payload.  For example:
*                                       {sAMAccountName: 'sAMAccountName', userPrincipalName: 'userPrincipalName'}
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxSessionGetSessionInfo( url, callback_success, callback_failure, timeout, async, ldap )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_SESSION_PATH;
	var sendReq = xrxSessionGetSessionInfoRequest(ldap);
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
} 

/**
* This function builds the request.
*
* @return {string}	xml request
*/
function xrxSessionGetSessionInfoRequest(LDAP)
{
	var ldapAttributeNameList = '',
	ldapAttribues = '',
	request;
	// check to see if the LDAP parameter is an object.  If it is, then generate the xrxSessionGetSessionInfoRequest with the LdapAttributeNameList payload
	if(typeof LDAP == 'object'){
		// loop through the LDAP object and generate <Attribute></Attribute> tags for each item in the object
		for (var i in LDAP) {
		  ldapAttribues += xrxCreateTag('Attribute', XRX_SESSION_INFORMATION_NAMESPACE, LDAP[i]);
		}
		// create LdapAttributeNameList tag and place the ldapAttribues list inside
		ldapAttributeNameList = xrxCreateTag('LdapAttributeNameList', '', ldapAttribues);
	}

	// create request
		request = XRX_SESSION_SOAPSTART + xrxCreateTag( 'GetSessionInformationRequest', XRX_SESSION_NAMESPACE, ldapAttributeNameList) + XRX_SOAPEND;
		// return request
		return request;
}

/**
* This function returns the parsed payload.
* @private
* @param {string}	response	web service response in DOM form
* @return {string}  xml payload in string form
*/
function xrxSessionParseSessionPayload( response )
{
	return xrxGetElementValue( response, "Information" );
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {array} 	xml payload in DOM form
*/
function xrxSessionParseGetSessionInfo( response )
{
	var data = xrxSessionParseSessionPayload( xrxStringToDom( response ) );
	if(data != null) 
	    data = xrxStringToDom( data );
	return data;
}


//  SetSessionInfo


/**
* This function sets the SessionInfo data. 
*
* @param {string}	url					destination address
* @param {string}  	payload             xml payload containing the session data
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxSessionSetSessionInfo( url, payload, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_SESSION_PATH;
	var sendReq = xrxSessionSetSessionInfoRequest( payload );
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the request.
*
* @param {string}	session_info	payload to include in the request
* @return {string} 	xml request in string form
*/
function xrxSessionSetSessionInfoRequest( session_info )
{
	return XRX_SESSION_SOAPSTART +
		    xrxCreateTag( 'SetSessionParametersRequest', XRX_SESSION_NAMESPACE,
			xrxCreateTag( 'SessionInfoSchema_SetSessionParametersPayload', XRX_SESSION_NAMESPACE, session_info )) 
			+ XRX_SOAPEND;
}

//  GetSecurityToken

/**
* This function retrieves the SecurityToken data.
*
* @param {string}  	url					destination address
* @param {string}   service_provider    the cloud service the client wishes to access	
* @param {string}   b64_security_token_key  a unique authorization key that allows the client to
*										access the specified cloud service token, must be Base64 encoded
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @return {string}	Blank string or comm error beginning with "FAILURE"
*/
function xrxSessionGetSecurityToken(url, service_provider, b64_security_token_key, callback_success, callback_failure, timeout) 
{
    if ((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_SESSION_PATH;
    var sendReq = xrxSessionGetSecurityTokenRequest(service_provider, b64_security_token_key);
    return xrxCallWebservice(sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, true);
}

/**
* This function builds the request.
*
* @param {string}   service_provider    the cloud service the client wishes to access	
* @param {string}   b64_security_token_key  a unique authorization key that allows the client to
*										access the specified cloud service token, must be Base64 encoded
* @return {string}	xml request
*/
function xrxSessionGetSecurityTokenRequest(service_provider, b64_security_token_key) {
    return XRX_SESSION_SOAPSTART +
        xrxCreateTag('GetSecurityTokenRequest', XRX_SESSION_NAMESPACE,
            xrxCreateTag('ServiceProvider', '', service_provider) + xrxCreateTag('SecurityTokenKey', '', b64_security_token_key))
        + XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	webservice response in string form
* @return {string}	A security token, Base64 encoded
*/
function xrxSessionParseGetSecurityToken(response) {
    return xrxGetValue(xrxFindElement(xrxStringToDom(response), ["GetSecurityTokenResponse", "SecurityToken"]));
}

/*************************  End of File  *****************************/

