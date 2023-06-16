
/* 
 * XrxTemplate.js
 * Copyright (C) Xerox Corporation, 2012.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Template Api Web services.
 *
 * @revision    04/26/2012 added GetInterfaceVersion and ReplaceTemplate
 *              10/15/2012 AHB Updated
 *				05/21/2018 TC	Updated comments.
 *				01/11/2019 TC	Use XRX_SOAP11_SOAPSTART and XRX_SOAPEND instead of
 *								XRX_TEMPLATE_SOAPSTART and XRX_TEMPLATE_SOAPEND. 
 *								Add WS-Security support to xrxTemplateGetTemplate(),
 *								xrxTemplatePutTemplate(), xrxTemplateReplaceTemplate()
 *								and xrxTemplateDeleteTemplate().
 */

/****************************  CONSTANTS  *******************************/

var XRX_TEMPLATE_NAMESPACE = 'xmlns="http://www.xerox.com/webservices/office/template_management/1/"';

var XRX_TEMPLATE_PATH = '/webservices/office/template_management/1';

/****************************  FUNCTIONS  *******************************/

//  Template Interface Version

/**
* This function gets the Template interface version.
*
* @param {string}	url					destination address
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxTemplateGetInterfaceVersion( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_TEMPLATE_PATH;
    var sendReq = xrxTemplateGetInterfaceVersionRequest();
	xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the Template interface version request.
*
* @return {string}	xml request
*/
function xrxTemplateGetInterfaceVersionRequest()
{
	return	XRX_SOAP11_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_TEMPLATE_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {string}	Major.Minor.Revision
*/
function xrxTemplateParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["InterfaceVersion","Revision"] ) );
}

//  Get Template List

/**
* This function gets the Template List from the device.
*
* @param {string}	url					destination address
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxTemplateGetTemplateList( url, callback_success, callback_failure, timeout )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_TEMPLATE_PATH;
	var sendReq = xrxTemplateGetTemplateListRequest();
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the Get Template List request.
*
* @return {string}	xml request
*/
function xrxTemplateGetTemplateListRequest()
{
	return	XRX_SOAP11_SOAPSTART
			+ xrxCreateTag( 'ListTemplatesRequest', XRX_TEMPLATE_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {array}	associative array of the form
*						name = checksum
*/
function xrxTemplateParseGetTemplateList( response )
{
	var result = new Array();
	try
	{
	    var data = xrxGetTheElement( xrxStringToDom( response ), "TemplateEntries" );
	    var entries = xrxFindElements( data, "TemplateEntry" );
	    var name, checksum;
	    if(entries != null)
		    for(var i = 0;i < entries.length;++i)
			    if(((name = xrxGetElementValue( entries[i], "TemplateName" )) != null) &&
				    ((checksum = xrxGetElementValue( entries[i], "TemplateChecksum" )) != null))
			    result[name] = checksum;
    }
    catch( e )
    {
    }
	return result;
}

//  Get Template

/**
* This function gets the template from the device.
*
* @param {string}	url					destination address
* @param {string}	template			name of template
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {object}	[credentials=undefined] the parameters for WS-Security
* @param {string}   credentials.admin - admin username (blank will not be included)
* @param {string}   credentials.adminPassword - admin password (blank will not be included)
* @param {string}   [credentials.passwordType="PasswordDigest"] - Ws-Security password type. 
*										Supported values are "PasswordDigest" and "PasswordText".
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxTemplateGetTemplate( url, template, callback_success, callback_failure, timeout, credentials )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_TEMPLATE_PATH;
	var sendReq = xrxTemplateGetTemplateRequest( template, credentials );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the Get Template request.
*
* @param {string}	template	template name
* @param {object}	[credentials=undefined] the parameters for WS-Security
* @param {string}   credentials.admin - admin username (blank will not be included)
* @param {string}   credentials.adminPassword - admin password (blank will not be included)
* @param {string}   [credentials.passwordType="PasswordDigest"] - Ws-Security password type. 
*										Supported values are "PasswordDigest" and "PasswordText".
* @return {string}	xml request
*/
function xrxTemplateGetTemplateRequest( template, credentials )
{
	var result = XRX_SOAP11_SOAPSTART
			    + xrxCreateTag( 'GetTemplateRequest', XRX_TEMPLATE_NAMESPACE, 
			    xrxCreateTag( 'templateName', XRX_XML_TYPE_NONE, template ) ) 
			    + XRX_SOAPEND;

	if ( typeof credentials === 'object' ) {
		if(((credentials.admin != null) && (credentials.admin != "")) && ((credentials.adminPassword != null) && (credentials.adminPassword != ""))) {
			result = addWsSecurityHeader( result, credentials.admin, credentials.adminPassword, credentials.passwordType );
		}
	}
	return result;
}
/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {string}	template content or null
*/
function xrxTemplateParseGetTemplate( response )
{
	var data = xrxFindElement( xrxStringToDom( response ), ["GetTemplateResponse","TemplateContent"] );
	return xrxGetValue( data );
}

//  Put Template

/**
* This function puts the provided template on the device.
*
* @param {string}	url					destination address
* @param {string}	templateName		template name
* @param {string}	template			template content data
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {object}	[credentials=undefined] the parameters for WS-Security
* @param {string}   credentials.admin - admin username (blank will not be included)
* @param {string}   credentials.adminPassword - admin password (blank will not be included)
* @param {string}   [credentials.passwordType="PasswordDigest"] - Ws-Security password type. 
*										Supported values are "PasswordDigest" and "PasswordText".
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxTemplatePutTemplate( url, templateName, template, callback_success, callback_failure, timeout, credentials )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_TEMPLATE_PATH;
	var sendReq = xrxTemplatePutTemplateRequest( templateName, template, credentials );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the Put Template request.
*
* @param {string}	templateName	template name
* @param {string}	template		template content data
* @param {object}	[credentials=undefined] the parameters for WS-Security
* @param {string}   credentials.admin - admin username (blank will not be included)
* @param {string}   credentials.adminPassword - admin password (blank will not be included)
* @param {string}   [credentials.passwordType="PasswordDigest"] - Ws-Security password type. 
*										Supported values are "PasswordDigest" and "PasswordText".
* @return {string}	xml request
*/
function xrxTemplatePutTemplateRequest( templateName, template, credentials )
{
	var result = XRX_SOAP11_SOAPSTART
			    + xrxCreateTag( 'PutTemplateRequest', XRX_TEMPLATE_NAMESPACE, 
			    xrxCreateTag( 'templateName', XRX_XML_TYPE_NONE, templateName )
			    + xrxCreateTag( 'templateContent', XRX_XML_TYPE_NONE, template ) ) 
			    + XRX_SOAPEND;
	if ( typeof credentials === 'object' ) {
		if(((credentials.admin != null) && (credentials.admin != "")) && ((credentials.adminPassword != null) && (credentials.adminPassword != ""))) {
			result = addWsSecurityHeader( result, credentials.admin, credentials.adminPassword, credentials.passwordType );
		}
	}
	return result;	
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {string}	checksum or null
*/
function xrxTemplateParsePutTemplate( response )
{
	var result = new Array();
	var data = xrxFindElement( xrxStringToDom( response ), ["ChecksumResponse","TemplateChecksum"] );
	return xrxGetValue( data );
}

//  Replace Template

/**
* This function puts the provided template content in the given template already on the device.
*
* @param {string}	url					destination address
* @param {string}	templateName		template name
* @param {string}	templateContent		template content data
* @param {string}	priorChecksum		checksum of template currently on device
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {object}	[credentials=undefined] the parameters for WS-Security
* @param {string}   credentials.admin - admin username (blank will not be included)
* @param {string}   credentials.adminPassword - admin password (blank will not be included)
* @param {string}   [credentials.passwordType="PasswordDigest"] - Ws-Security password type. 
*										Supported values are "PasswordDigest" and "PasswordText".
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxTemplateReplaceTemplate( url, templateName, templateContent, priorChecksum, callback_success, callback_failure, timeout, credentials )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_TEMPLATE_PATH;
	var sendReq = xrxTemplateReplaceTemplateRequest( templateName, templateContent, priorChecksum, credentials );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
} 

/**
* This function builds the Replace Template request.
*
* @param {string}	templateName	    template name
* @param {string}	templateContent		template content data
* @param {string}	priorChecksum		checksum of template currently on device
* @param {object}	[credentials=undefined] the parameters for WS-Security
* @param {string}   credentials.admin - admin username (blank will not be included)
* @param {string}   credentials.adminPassword - admin password (blank will not be included)
* @param {string}   [credentials.passwordType="PasswordDigest"] - Ws-Security password type. 
*										Supported values are "PasswordDigest" and "PasswordText".
* @return {string}	xml request
*/
function xrxTemplateReplaceTemplateRequest( templateName, templateContent, priorChecksum, credentials )
{
	var result = XRX_SOAP11_SOAPSTART
			    + xrxCreateTag( 'ReplaceTemplateRequest', XRX_TEMPLATE_NAMESPACE, 
			    xrxCreateTag( 'templateName', XRX_XML_TYPE_NONE, templateName )
			    + xrxCreateTag( 'templateContent', XRX_XML_TYPE_NONE, templateContent ) 
			    + xrxCreateTag( 'priorChecksum', XRX_XML_TYPE_NONE, priorChecksum ) ) 
			    + XRX_SOAPEND;
	if ( typeof credentials === 'object' ) {
		if(((credentials.admin != null) && (credentials.admin != "")) && ((credentials.adminPassword != null) && (credentials.adminPassword != ""))) {
			result = addWsSecurityHeader( result, credentials.admin, credentials.adminPassword, credentials.passwordType );
		}
	}
	return result;	
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {string}	checksum or null
*/
function xrxTemplateParseReplaceTemplate( response )
{
	var result = new Array();
	var data = xrxFindElement( xrxStringToDom( response ), ["ChecksumResponse","TemplateChecksum"] );
	return xrxGetValue( data );
}

//  Delete Template

/**
* This function deletes the template from the device.
*
* @param {string}	url					destination address
* @param {string}	template			template name
* @param {string}	checksum			template checksum
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {object}	[credentials=undefined] the parameters for WS-Security
* @param {string}   credentials.admin - admin username (blank will not be included)
* @param {string}   credentials.adminPassword - admin password (blank will not be included)
* @param {string}   [credentials.passwordType="PasswordDigest"] - Ws-Security password type. 
*										Supported values are "PasswordDigest" and "PasswordText".
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxTemplateDeleteTemplate( url, template, checksum, callback_success, 
									callback_failure, timeout, credentials )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_TEMPLATE_PATH;
	var sendReq = xrxTemplateDeleteTemplateRequest( template, checksum, credentials );
    xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout );
}

/**
* This function builds the Delete Template request.
*
* @param {string}	template		template content data
* @param {string}	checksum		template checksum
* @param {object}	[credentials=undefined] the parameters for WS-Security
* @param {string}   credentials.admin - admin username (blank will not be included)
* @param {string}   credentials.adminPassword - admin password (blank will not be included)
* @param {string}   [credentials.passwordType="PasswordDigest"] - Ws-Security password type. 
*										Supported values are "PasswordDigest" and "PasswordText".
* @return {string}	xml request
*/
function xrxTemplateDeleteTemplateRequest( template, checksum, credentials )
{
	var result = XRX_SOAP11_SOAPSTART
			    + xrxCreateTag( 'DeleteTemplateRequest', XRX_TEMPLATE_NAMESPACE, 
			    xrxCreateTag( 'templateName', XRX_XML_TYPE_NONE, template )
			    + xrxCreateTag( 'priorChecksum', XRX_XML_TYPE_NONE, checksum ) ) 
			    + XRX_SOAPEND;
	if ( typeof credentials === 'object' ) {
		if(((credentials.admin != null) && (credentials.admin != "")) && ((credentials.adminPassword != null) && (credentials.adminPassword != ""))) {
			result = addWsSecurityHeader( result, credentials.admin, credentials.adminPassword, credentials.passwordType );
		}
	}
	return result;				
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {boolean}	true if successful
*/
function xrxTemplateParseDeleteTemplate( response )
{
	if(xrxGetTheElement( xrxStringToDom( response ), "VoidResponse" ) != null)
		return true;
	else
		return false;
}

/*************************  End of File  *****************************/
