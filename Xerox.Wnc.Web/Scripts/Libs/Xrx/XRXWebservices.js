/* 
 * XrxWebservices.js
 * Copyright (C) Xerox Corporation, 2007 - 2021.  All rights reserved.
 *
 * This file encapsulates the functions to Xerox Web services.
 *
 * @revision    10/07/2007
 *              09/21/2012 
 *              10/15/2012  AHB Updated
 *              06/20/2013  3.10    AHB Added Synchronous behavior
 *              07/26/2013  3.11    AHB Added Mtom constants
 *              08/01/2013  3.12    AHB Added xrxParseStringSoap12ErrorResponse
 *              08/30/2013  3.0.13  AHB Added WsXConfig
 *                                  Added Authorization XRXWsSecurity.js
 *                                  Added Mtom
 *              07/20/2014  3.0.14  TC  Updated the XRX_WEBSERVICES_LIBRARY_VERSION to 
 *										3.0.14.
 *              08/17/2015  3.5.01  TC  Updated the XRX_WEBSERVICES_LIBRARY_VERSION to 
 *										3.5.01.
 *              10/29/2015  3.5.02  TC  Added 'xmlns:xop="http://www.w3.org/2004/08/xop/include"' 
 *										to  XRX_SOAPSTART_MTOM.
 *				06/20/2016  4.0.01  TC  Change the XMLHttpRequest object to a local variable in xrxCallAjax().
 *				01/19/2017  4.0.02  TC  Updated the version number.
 *				04/12/2017  4.0.03  TC  Updated the version number for the mustUnderstand="1" change.
 *				08/21/2017  		DW  Fixed spelling errors and made small formatting changes in comments.
 *				09/28/2017  4.1.01  TC  Updated the XRX_WEBSERVICES_LIBRARY_VERSION to 4.1.01.
 *				05/21/2018	4.1.02	TC	Updated comments.
 *				08/07/2018  4.1.03  TC  Update the version number to 4.1.03 for bug fixes.
 *				01/03/2019  4.1.04  TC  Updated XRX_SOAP11_SOAPSTART, XRX_SOAPSTART and XRX_SOAPEND. 
 *										Deprecated variables XRX_SOAPSTART_MTOM and XRX_XML_TYPE_BOOLEAN.
 *				03/07/2019  		TC  Set xrxXmlhttp.withCredentials to true when credentials are provided 
 *				03/07/2019  		DW  Added ability to request sAMAccountName & userPrincipalName from LDAP 
 *										session for xrxSessionGetSessionInfo() in XRXSession.js
 *				03/20/2019  		TC  Added a helper function addWsAddressingHeader().
 *				04/03/2019  4.1.05  TC  Set xrxXmlhttp.timeout only when it is an asynchronous call. 
 *										Deprecated synchronous calls.
 *				05/03/2019  4.1.06  TC  Updated the version number.
 *				06/20/2019  4.1.07  TC 	Updated getWsSecurityHeader() and getSecurityHeader() in XRXWsSecurity.js
 *										to use UTC time for the Timestamp elements.
 *				08/09/2019  4.2.01  TC  Added GetAddressBook() in XRXDeviceConfig.js. 
 *										Added XRXNetworkConfig.js.
 *				12/12/2019  4.2.02  TC  Added XRX_SOAPSTART_MTOM_V2. Added XRXSecurityConfig.js.
 *				05/28/2020  4.2.03  TC  Added XRXAccessConfig.js
 *										Updated XRX_MIME_BOUNDARY and XRX_MIME_BOUNDARY_END so it conforms 
 *										to the standard for MIME attachments.
 *										Deprecated the ASync Framework functions in this file.
 *										Added a new function and deprecated multiple functions in XRXUtilities.js.
 *              12/09/2020  4.2.04  TC  Added GetSecurityToken() in XRXSession.js. 
 *              04/22/2021  4.3.01  DW  Added GetMultiple(), GetMultipleNext(), SetMultiple() and SNMPWalk() in
 *										XRXWsSnmp.js. Added BuildWorkflowJob() and SubmitBuildWorkflowJob() 
 *										in XRXWorkflowManagement.js. Added xrxCardReaderParseGetPeripherals() in
 *										XRXCardReader.js.
 *
 *  When changing the version don't forget to change the version in the global below.
 */
 
/****************************  CONSTANTS  *******************************/

// Overall Web services Library Version
var XRX_WEBSERVICES_LIBRARY_VERSION = "4.3.01"; 

var XRX_XML_TYPE_NONE = '';

var XRX_SOAP11_SOAPSTART = '<?xml version="1.0" encoding="utf-8"?>'
    + '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" '
	+ 'xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" '
    + 'xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" '
    + 'xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">'
	+ '<soap:Header>'
    + '</soap:Header>'
    + '<soap:Body>';

var XRX_SOAPSTART = '<?xml version="1.0" encoding="utf-8"?>' +
    '<soap:Envelope' +
    ' xmlns:soap="http://www.w3.org/2003/05/soap-envelope"' +
    ' xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing"' +
    ' xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"' +
    ' xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
    '<soap:Header>' + 
    '</soap:Header>' +
    '<soap:Body>';
	
var XRX_SOAPSTART_MTOM_V2 = '<soap:Envelope' + 
	' xmlns:xop="http://www.w3.org/2004/08/xop/include"' +
    ' xmlns:soap="http://www.w3.org/2003/05/soap-envelope"' +
    ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
    ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
    ' xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing"' +
    ' xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"' +
    ' xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
    '<soap:Header>' + 
    '</soap:Header>' +
    '<soap:Body>';

var XRX_SOAPEND = '</soap:Body></soap:Envelope>';

var XRX_MIME_BOUNDARY = '\r\n----MIMEBoundary635101843208985196\r\n';

var XRX_MIME_BOUNDARY_END = '\r\n----MIMEBoundary635101843208985196--\r\n';

var XRX_MIME_HEADER = 'content-id: <0.635101843208985196@example.org>\r\n'
        + 'content-type: application/xop+xml; charset=utf-8; type="application/soap+xml; charset=utf-8"\r\n'
        + 'content-transfer-encoding: binary\r\n\r\n';


		
// @deprecated since XeroxJavascriptLibrary 4.1.04
var XRX_SOAPSTART_MTOM = '<soap:Envelope' + 
	' xmlns:xop="http://www.w3.org/2004/08/xop/include"' +
    ' xmlns:soap="http://www.w3.org/2003/05/soap-envelope"' +
    ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
    ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
    ' xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing"' +
    ' xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"' +
    ' xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">' +
    '<env:Header xmlns:env="http://www.w3.org/2003/05/soap-envelope">' + 
    '</env:Header>' +
    '<soap:Body>';

// @deprecated since XeroxJavascriptLibrary 4.1.04
var XRX_XML_TYPE_BOOLEAN = 'xsi:type="xsd:boolean"';



/****************************  FUNCTIONS  *****************************/

/**
* This function calls the low level Ajax function to send the request.
*
* @param {string}	url					destination address
* @param {string}	envelope			xml string for body of message
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {array}	[headers=null]		array of optional headers in format {name:value}
* @param {string}	[username=undefined]	username for user credentials
* @param {string}	[password=undefined]	password for user credentials
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxCallWebservice( url, envelope, callback_success, callback_failure, timeout, headers, username, password, async )
{
	return xrxCallAjax( url, envelope, "POST", ((headers != undefined)?headers:null), callback_success, callback_failure, timeout, username, password, async );
}

/**
* This function is the low level Ajax function to send the request.
*
* @param {string}	url					destination address
* @param {string}	envelope			xml string for body of message
* @param {string}	type				request type ("GET" or "POST")
* @param {array}	headers				array of arrays containing optional headers to set on the request or null
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {string}   [username=undefined]	username for ajax request
* @param {string}   [password=undefined]    password for ajax request
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous [Deprecated] call if false
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxCallAjax( url, envelope, type, headers, callback_success, callback_failure, timeout, username, password, async )
{
	// Ajax Request Object
	var xrxXmlhttp = new XMLHttpRequest();
	
	// Ajax Request Xml
	var xrxEnvelope = null;
	
	// Storage for Success Callback Function Address
	var xrxAjaxSuccessCallback = null;
	
	// Storage for Failure Callback Function Address
	var xrxAjaxFailureCallback = null;

	if(async == undefined)
	    async = true;

	xrxEnvelope = envelope;
	xrxAjaxSuccessCallback = ((callback_success == undefined)?null:callback_success);
	xrxAjaxFailureCallback = ((callback_failure == undefined)?null:callback_failure);

	try
	{
	    if((username == undefined) || (password == undefined) || (username == null) || (password == null)) {
	        xrxXmlhttp.open( type, url, async );
		}
	    else {
	        xrxXmlhttp.open( type, url, async, username, password );
			xrxXmlhttp.withCredentials = true;
		}
	}
	catch(exc)
	{
        var errString = "";
        var uaString = navigator.userAgent;
        if(!async && (uaString != undefined) && (uaString != null) && ((uaString = uaString.toLowerCase()).indexOf( "galio" ) >= 0))
            errString = "FAILURE: Synchronous Ajax Does Not Work in FirstGenBrowser!";
        else
            errString = "FAILURE: Failure to Open Ajax Object!";
	    xrxCallCallback( xrxAjaxSuccessCallback, xrxAjaxFailureCallback, xrxEnvelope, 0, errString );
	    return errString;
	}
	if(headers != null)
	{
		for(var i = 0;i < headers.length;++i)
		{
			xrxXmlhttp.setRequestHeader( headers[i][0], headers[i][1] );
		}
	} else
	{
	    xrxXmlhttp.setRequestHeader("SOAPAction", '""');
	    xrxXmlhttp.setRequestHeader( "Content-Type", "text/xml" );
	}
	
	if(async)
	{
		var xrxTimeout = (timeout == undefined || timeout == null) ? 0 : timeout;
		xrxXmlhttp.timeout = xrxTimeout*1000;
		xrxXmlhttp.ontimeout = function(e) {
			if (xrxAjaxFailureCallback != null) {
				var msg = "<comm_error>COMM TIMEOUT(" + xrxTimeout + " sec)</comm_error>";
				xrxAjaxFailureCallback( xrxEnvelope, msg, -99 );
			}
		}
		
		// response function
	    xrxXmlhttp.onreadystatechange = function() 
	    {
		    if((xrxXmlhttp != null) && (xrxXmlhttp.readyState == 4))
		    {
			    try
			    {
					xrxCallCallback( xrxAjaxSuccessCallback, xrxAjaxFailureCallback, xrxEnvelope, xrxXmlhttp.status, xrxXmlhttp.responseText );
			    }
			    catch( e )
			    {
				    xrxAjaxFailureCallback( xrxEnvelope, "<comm_error>" + e.toString() + "</comm_error>", 0 );
			    }
		    }
	    }
	    xrxXmlhttp.send( xrxEnvelope );
	} else
	{
	    try
	    {
	        xrxXmlhttp.send( xrxEnvelope );
	        xrxCallCallback( xrxAjaxSuccessCallback, xrxAjaxFailureCallback, xrxEnvelope, xrxXmlhttp.status, xrxXmlhttp.responseText );
	    }
	    catch( e )
	    {
	        return "FAILURE: comm_error " + (((e != null) && (e.message != null))? e.message : "Exception" );
	    }
        return ((xrxXmlhttp.status == 200) ? "" : "FAILURE: " + xrxXmlhttp.status + " - ") + xrxXmlhttp.responseText;
    }
    return "";
}



/**
* This function calls the callbacks if they were given a value.
* @private
* @param {string} xrxAjaxSuccessCallback	Routine to call when status == 200
* @param {string} xrxAjaxFailureCallback	Routine to call when status != 200
* @param {string} xrxEnvelope  	web service request
* @param {number} status      	status code
* @param {string} response    	web service response
*/
function xrxCallCallback( xrxAjaxSuccessCallback, xrxAjaxFailureCallback, xrxEnvelope, status, response )
{
    if((response == undefined) || (response == null))
        response = "";
    if(status != 200) {
		if(xrxAjaxFailureCallback != null) {
			xrxAjaxFailureCallback( xrxEnvelope, response, status );   
		} 
	} else {
		if(xrxAjaxSuccessCallback != null) {
			xrxAjaxSuccessCallback( xrxEnvelope, response );
		}	
	}
}

// Helper functions

/**
*
* This function adds the Ws-Addressing header to the envelope that is passed in
*   
* @param	{string} 	envelope	current soap request
* @param    {string}    action		wsa:Action.
* @param    {string}    to 			wsa:To.
* @return	{string}	Ws-Addressing header.
*/
function addWsAddressingHeader( envelope, action, to )
{
	var XRX_ADDRESSING_HEADER = '<wsa:MessageID>[MessageId]</wsa:MessageID>' 
	+ '<wsa:Action>[Action]</wsa:Action>'
    + '<wsa:ReplyTo><wsa:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:Address></wsa:ReplyTo>'
	+ '<wsa:To>[To]</wsa:To>';
	
    var result = XRX_ADDRESSING_HEADER;
    
    result = result.replace( "[MessageId]", 'urn:uuid:f7f5154b-976a-4ace-a187-390202166a70' );
    result = result.replace( "[Action]", action );
    result = result.replace( "[To]", to );

    return envelope.replace( '</soap:Header>', result + '</soap:Header>' );
} 

/**
* This function pulls the Mtom data from the response.
*
* @param {string}	response	web service response in string form
* @param {string}   idString	Start of the last matching substring
* @param {string}   idString2	End of the last matching substring
* @return {string}	The last matching substring that begins with idString and ends with idString2
*/
function findMtomData( response, idString, idString2 )
{
    var index = response.lastIndexOf( idString );
    if ( index > 0 ) {
        return response.substring( index, response.lastIndexOf( idString2 ) + idString2.length );
	}
    return "FAILURE: Cannot Locate Mtom Data!";
}

/**
* This function parses the interface version.
*
* @param {string}	response	web service response in string form
* @return {array}	[MajorVersion],[MinorVersion],[Revision]
*/
function xrxParseInterfaceVersion( response )
{
	var result = new Array();
	var dom = xrxStringToDom( response );
	var data = xrxGetTheElement( dom, "InterfaceVersion" );
	var node = xrxFindElement( data, ["MajorVersion"] );
	if(node != null) result['MajorVersion'] = xrxGetValue( node );
	var node = xrxFindElement( data, ["MinorVersion"] );
	if(node != null) result['MinorVersion'] = xrxGetValue( node );
	var node = xrxFindElement( data, ["Revision"] );
	if(node != null) result['Revision'] = xrxGetValue( node );
	return result;
}

/**
* This function returns the parsed interface values.
*
* @param {string}	response 	web service response in string form
* @return {string}	Major.Minor.Revision
*/
function xrxParseGetInterfaceVersion( response )
{
    var data = xrxStringToDom( response );
	return xrxGetValue( xrxFindElement( data, ["Version","MajorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","MinorVersion"] ) ) + "."
	    + xrxGetValue( xrxFindElement( data, ["Version","Revision"] ) );
}

/**
* This function parses the error response.
*
* @param {string}	response	web service response in string form
* @return {object}	fault portion of response in DOM form or null
*/
function xrxParseErrorResponse( response )
{
	var data = null;
	if((response != null) && (response != ""))
		data = xrxFindElement( xrxStringToDom( response ), ["Fault"] );
	return data;
}

/**
* This function parses the error response.
*
* @param {string}	response	web service response in string form
* @return {string}	fault portion of response in string form
*/
function xrxParseStringSoap12ErrorResponse( response )
{
    var subcode = "";
    var reason = "";
    if((typeof(response) != "undefined") && (response != null))
    {
	    var index = response.indexOf( "Subcode" );
	    if(index > 0)
	        if((index = response.indexOf( "Value", index )) > 0)
	            if((index = response.indexOf( ">", index )) > 0)
	                subcode = response.substring( index + 1, response.indexOf( "<", index ) );
	    if((index = response.indexOf( "Reason" )) > 0)
	        if((index = response.indexOf( "Text" )) > 0)
	            if((index = response.indexOf( ">", index )) > 0)
	                reason = response.substring( index + 1, response.indexOf( "<", index ) );
	}
	if((subcode != "") || (reason != ""))
	    return subcode + ":" + reason;
	else
	    return "General Failure:" + response;
}

/**
* Extract a payload from the passed in xml string
* @param {string} 	text	An xml string
* @param {string}	name	A tag name
* @return {string}	The payload within the name tag 
*/
function xrxParsePayload( text, name )
{
    var result = "";
    var index;
    if((index = text.indexOf( ":" + name + ">" )) < 0)
        if((index = text.indexOf( "<" + name + ">" )) < 0)
            if((index = text.indexOf( ":" + name + " " )) < 0)
                index = text.indexOf( "<" + name + " " );
    if(index >= 0)
    {
        var fullname = xrxGetWholeName( text, name, index );
        index = text.indexOf( ">", index ) + 1;
        var index2 = text.indexOf( "/" + fullname, index );
        if(index2 > 0)
            result = text.substring( index, index2 - 1 );
    }
    return result;
}

/**
* @private
*/
function xrxGetWholeName( text, name, index )
{
    var result;
    var start = xrxBackSearch( text, '<', index );
    if((start >= 0) && (start < index))
        result = text.substring( start + 1, start + ((index - start) + name.length + 1) );
    else
        result = "";
    return result;
}

/**
* @private
*/
function xrxBackSearch( text, theChar, index )
{
    var result;
    for(result = index;(text.charAt( result ) != theChar) && (result >= 0);--result);
    return result;
}

/*************************  Support Functions  *****************************/

/**
* This function returns the Library version.
*
* @return {string}	version string
*/
function xrxGetWebservicesLibraryVersion()
{
    return XRX_WEBSERVICES_LIBRARY_VERSION;
}

/**
* This function creates an xml tag in a string.
*
* @param {string}	label	tag
* @param {string}	type	attribute
* @param {string}	value	text value
* @return {string}	An xml element with attribute and value
*/
function xrxCreateTag( label, type, value )
{
    if(type == "")
    {
        return( "<" + label + ">" + value + "</" + label + ">" );
    }
    else
    {
        return( "<" + label + " " + type + ">" + value + "</" + label + ">" );
    }
}



/*************************  ASync Framework  *****************************/

// Singleton object
var xrxASyncFramework = new XrxASyncFramework();

/**
* @deprecated since XeroxJavascriptLibrary 4.2.03
*
* This constructor creates an object that handles some of the complexities
* of asynchronous programming. It works on the idea of a 'framework'. This framework
* is an array that holds a series of steps each with its function to call if
* the previous level was successful and one to call if not. Storage of 
* intermediate values is accomplished by the store and recall functions.
* You can also add any normal non-web service functions to the list and 
* when you call xrxASyncCallback the second parameter can be 0 for success or 1 for failure.
*
* @example <caption> A typical setup would be: </caption>
* <lang>js</lang>
framework = new Array();
framework[0] = ["loadTemplates"];
framework[1] = ["finishLoadTemplates","commFailure"];
framework[2] = ["finishInitiateScan","commFailure"];
xrxASyncFramework.load( framework );
xrxASyncFramework.start();
*
* @example <caption> The function loadTemplates would be called first. Somewhere in that function a 
* Ajax call will be made. When it returns the AsyncFramework will execute the 
* first function call of the next layer if the Ajax call was successful and the 
* second if a failure. This will continue until the framework is no longer called 
* or all layers are executed.
* <br/>
* <br/>
* A traditional function with a web service would be as you normally create it but with the exception of the success callback and the failure callback are fixed
* values of xrxASyncSuccessCallback and xrxASyncFailureCallback, as below: </caption>
* <lang>js</lang>
function getDefaultApplication() {
	xrxWsXConfigGetPathwayDefaultApplication( "http://127.0.0.1", "Services", adminUserString, adminPasswordString, xrxASyncSuccessCallback, xrxASyncFailureCallback, 30, true );
}
*
* @example <caption> Your callback functions remain the same with two additions, one, You get the parameters by calling for them and you finish with a mandatory call: </caption>
* <lang>js</lang>
function gda_success( request, response ) {
	response = xrxASyncFramework.recall( "p1" ); // calls for parameter 1 (0 based parameter list) which is the response
	var app = new AppInfo( xrxWsXConfigParseGetPathwayDefaultApplication( response ) ).name;
	if(app != null) {
		document.getElementById( 'defaultApplication' ).innerHTML = app;
		for(var i = 0;i < applicationLen;++i)
		if(applicationList[i].name == app) {
			selectedApplicationIndex = i;
			selectApplication();
			break;
		}
	}
	xrxASyncCallback( null, 0 ); // returns control to the framework
}

* @example <caption> So in the following framework the first call is made and if failure goes to your error handler gen_failure() and your handler can decide if the framework continues.
* If successful it drops down to the next which is your success handler: </caption>
* <lang>js</lang>
framework = new Array();
framework.push( ["getDefaultApplication", "gen_failure"] );
framework.push( ["gda_success"] );
xrxASyncFramework.load( framework );
xrxASyncFramework.start();
*
*/
function XrxASyncFramework()
{
	this.framework = null;
	this.queue = new Array();
	this.step = 0;
	this.cancel = false;
	this.parameters = null;
	
	this.load = xrxASyncLoadFramework;
	this.start = xrxASyncStartFramework;
	this.stop = xrxASyncStopFramework;
	this.restart = xrxASyncStartFramework;
	this.store = xrxASyncStoreParameter;
	this.recall = xrxASyncGetParameter;
	this.clear = xrxASyncClear;
	this.success = xrxASyncSuccessCallback;
	this.failure = xrxASyncFailureCallback;
}

/**
* @deprecated since XeroxJavascriptLibrary 4.2.03
*
* This function loads a new framework and returns internal values
* to default.
* 
* @private
* @param {array}	framework	An array of functions.
*/
function xrxASyncLoadFramework( framework )
{
	this.framework = framework;
	this.step = 0;
	this.cancel = false;
	this.parameters = new Array();
}

/**
* @deprecated since XeroxJavascriptLibrary 4.2.03
*
* This function clears the data from the framework.
* @private
*/
function xrxASyncClear()
{
	this.cancel = true;
	this.parameters = null;
	this.framework = new Array();
	this.step = 0;
}

/**
* @deprecated since XeroxJavascriptLibrary 4.2.03
*
* This function starts the framework executing.
* @private
*/
function xrxASyncStartFramework()
{
	eval( this.framework[this.step++][0] + "()" );
}

/**
* @deprecated since XeroxJavascriptLibrary 4.2.03
*
* This function stops the framework.
* @private
*/
function xrxASyncStopFramework()
{
	this.cancel = true;
}

/**
* @deprecated since XeroxJavascriptLibrary 4.2.03
*
* This function stores a given value.
*
* @private
* @param {string}	name	name of stored value
* @param {string}	value	value to store
*/
function xrxASyncStoreParameter( name, value )
{
	this.parameters[name] = value;
}

/**
* @deprecated since XeroxJavascriptLibrary 4.2.03
*
* This function retrieves a previously stored value.
*
* @private
* @param {string}	name	name of stored value
*/
function xrxASyncGetParameter( name )
{
	return this.parameters[name];
}

/*************************  External Functions  *****************************/

/**
* @deprecated since XeroxJavascriptLibrary 4.2.03
*
* This function is called upon successful conclusion of a web service call.
* @private
*/
function xrxASyncSuccessCallback()
{
	xrxASyncCallback( arguments, 0 );
}

/**
* @deprecated since XeroxJavascriptLibrary 4.2.03
*
* This function is called upon a failed conclusion of a web service call.
* @private
*/
function xrxASyncFailureCallback()
{
	xrxASyncCallback( arguments, 1 );
}

/**
* @deprecated since XeroxJavascriptLibrary 4.2.03
*
* This function is handles the callback. The arguments are stored 
* under p1 ... pn.
*
* @private
* @param {array} 	params	arguments sent from Ajax handler
* @param {number}	code	0=successful, 1=failure
*/
function xrxASyncCallback( params, code )
{
	if(xrxASyncFramework.parameters != null)
	    if(params != null)
		    for(var i = 0;i < params.length;++i)
			    xrxASyncFramework.store( ("p" + i), params[i] );
	if(!xrxASyncFramework.cancel)
		if(xrxASyncFramework.framework[xrxASyncFramework.step] != undefined)
			if(xrxASyncFramework.framework[xrxASyncFramework.step] != null)
				eval( xrxASyncFramework.framework[xrxASyncFramework.step++][code] + "()" );
}

/*************************  End of File  *****************************/
