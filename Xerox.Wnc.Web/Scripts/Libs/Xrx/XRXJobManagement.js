/* 
 * XRXJobManagement.js
 * Copyright (C) Xerox Corporation, 2011, 2012, 2013.  All rights reserved.
 *
 * This file encapsulates the functions to call the Xerox Job Management Api 
 * Web services.
 *
 * @revision    06/26/2012
 *              10/15/2012  AHB Updated with missing methods
 *              11/01/2012  AHB Corrected comment in header for return value in xrxJobMgmtParseGetJobDetails
 *              07/31/2013  AHB Added MTOM methods and new Secure methods, made corrections
 *              08/08/2013  AHB Bug fix to parse queues - unescape only secure
 *                              Fixed Queue Secure Requests to not include a Credentials element if user and pass blank
 *              08/16/2013  AHB Added Ws-Security
 *				01/08/2018  TC	Added support for WsSecurity plain text password.
 *				05/21/2018	TC	Updated comments.
 *				12/03/2018  TC  Removed the use of xrxUnescape().
 *				01/03/2019  TC  Use XRX_SOAPSTART instead of XRX_SOAPSTART_MTOM.
 *				01/04/2019  TC  Call addWsSecurityHeader() instead of addWsSecurity().
 */

/****************************  GLOBALS  *******************************/

var XRX_JOBMGMT_NAMESPACE = 'xmlns="http://xml.namespaces.xerox.com/enterprise/JobManagement/1"';

var XRX_JOBMGMT_PATH = '/webservices/JobManagement/1';

/****************************  FUNCTIONS  *******************************/


//  Job Management Interface Version


/**
* This function gets the Job Management interface version and returns the parsed values.
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
function xrxJobMgmtGetInterfaceVersion( url, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtGetInterfaceVersionRequest();
    return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This function builds the Job Management interface version request.
*
* @return {string}	xml request
*/
function xrxJobMgmtGetInterfaceVersionRequest()
{
	return	XRX_SOAPSTART 
			+ xrxCreateTag( 'GetInterfaceVersionRequest', XRX_JOBMGMT_NAMESPACE, '' ) 
			+ XRX_SOAPEND;
}

/**
* This function returns the parsed values.
*
* @param {string}	response 	web service response in string form
* @return {string}	Major.Minor.Revision
*/
function xrxJobMgmtParseGetInterfaceVersion( response )
{
	return xrxParseGetInterfaceVersion( response );
}


//  ListActiveQueue


/**
* This function gets jobs in the active queue
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
function xrxJobMgmtListActiveQueue( url, callback_success, callback_failure, timeout, async ) 
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_JOBMGMT_PATH;
	var sendReq = xrxJobMgmtListActiveQueueRequest();
	var headers = new Array();
	headers[0] = ['Content-Type','multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, headers, null, null, async );
}   

/**
* This function builds the request.
*   
* @return {string}    xml request
*/
function xrxJobMgmtListActiveQueueRequest()
{
    var resq = XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART
			+ xrxCreateTag( 'ListActiveJobQueueRequest', XRX_JOBMGMT_NAMESPACE, '' )
			+ XRX_SOAPEND + XRX_MIME_BOUNDARY_END;
    return resq;
}

/**
* This function returns the job queue values.
*
* @param {string}	response	        web service response in string form
* @return {object}	JobQueue xml payload in DOM form
*/
function xrxJobMgmtParseListActiveQueue( response )
{
	return xrxJobMgmtParseListQueue( response );
}


//  ListActiveQueueSecure


/**
* This function gets jobs in the active queue
*
* @param {string}	url					destination address
* @param {string}	admin				admin username (blank will not be included)
* @param {string}	adminPassword		admin password (blank will not be included)
* @param {string}	username			username for user credentials (blank will not be included)
* @param {string}	password			password for user credentials (blank will not be included)
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @param {string}	[passwordType="PasswordDigest"]		Ws-Security password type. Supported values are 
*										"PasswordDigest" and "PasswordText".
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxJobMgmtListActiveQueueSecure( url, admin, adminPassword, username, password, callback_success, callback_failure, timeout, async, passwordType ) 
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_JOBMGMT_PATH;
	var sendReq = xrxJobMgmtListActiveQueueSecureRequest( admin, adminPassword, username, password, passwordType );
	var headers = new Array();
	headers[0] = ['Content-Type','multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, headers, null, null, async );
}   

/**
* This function builds the request.
*   
* @param {string}	admin				admin username (blank will not be included)
* @param {string}	adminPassword		admin password (blank will not be included)
* @param {string}	username			username for user credentials (blank will not be included)
* @param {string}	password			password for user credentials (blank will not be included)
* @param {string}	[passwordType="PasswordDigest"]		Ws-Security password type. Supported values are 
*										"PasswordDigest" and "PasswordText".
* @return {string}	xml request
*/
function xrxJobMgmtListActiveQueueSecureRequest( admin, adminPassword, username, password, passwordType )
{
    var result = XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART
			+ xrxCreateTag( 'ListActiveJobQueueSecureRequest', XRX_JOBMGMT_NAMESPACE, 
			    (((username != "") || (password != ""))?xrxCreateTag( 'UserAuthCredentials', XRX_XML_TYPE_NONE, 
			        ((username != "")?xrxCreateTag( 'Username',  XRX_XML_TYPE_NONE, username ):"")
			        + ((password != "")?xrxCreateTag( 'Password',  XRX_XML_TYPE_NONE, password ):"") ):"") )
			+ XRX_SOAPEND + XRX_MIME_BOUNDARY_END;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurityHeader( result, admin, adminPassword, passwordType );
    }
    catch(e)
    {}
    return result;
}

/**
* This function returns the job list.
*
* @param {string}	response	web service response in string form
* @return {object}	JobQueue xml payload in DOM form
*/
function xrxJobMgmtParseListActiveQueueSecure( response )
{
	return xrxJobMgmtParseListQueueSecure( response );
}


//  ListCompletedQueue


/**
* This function gets jobs in the completed queue
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
function xrxJobMgmtListCompletedQueue( url, callback_success, callback_failure, timeout, async ) 
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_JOBMGMT_PATH;
	var sendReq = xrxJobMgmtListCompletedQueueRequest();
	var headers = new Array();
	headers[0] = ['Content-Type','multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, headers, null, null, async );
}   

/**
* This function builds the request.
*   
* @return {string}  xml request
*/
function xrxJobMgmtListCompletedQueueRequest()
{
    var resq = XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART
			+ xrxCreateTag( 'ListCompletedJobQueueRequest', XRX_JOBMGMT_NAMESPACE, '' )
			+ XRX_SOAPEND + XRX_MIME_BOUNDARY_END;
    return resq;
}

/**
* This function returns the job list.
*
* @param {string}	response	web service response in string form
* @return {object}	JobQueue xml payload in DOM form
*/
function xrxJobMgmtParseListCompletedQueue( response )
{
	return xrxJobMgmtParseListQueue( response );
}


//  ListCompletedQueueSecure


/**
* This function gets jobs in the completed queue
*
* @param {string}	url					destination address
* @param {string}	admin				admin username (blank will not be included)
* @param {string}	adminPassword		admin password (blank will not be included)
* @param {string}	username			username for user credentials (blank will not be included)
* @param {string}	password			password for user credentials (blank will not be included)
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @param {string}	[passwordType="PasswordDigest"]		Ws-Security password type. Supported values are 
*										"PasswordDigest" and "PasswordText".
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxJobMgmtListCompletedQueueSecure( url, admin, adminPassword, username, password, callback_success, callback_failure, timeout, async, passwordType ) 
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_JOBMGMT_PATH;
	var sendReq = xrxJobMgmtListCompletedQueueSecureRequest( admin, adminPassword, username, password, passwordType );
	var headers = new Array();
	headers[0] = ['Content-Type','multipart/related; type="application/xop+xml"; boundary=--MIMEBoundary635101843208985196; start="<0.635101843208985196@example.org>"; start-info="application/soap+xml; charset=utf-8"'];
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, headers, null, null, async );
}   

/**
* This function builds the request.
*   
* @param {string}	admin				admin username (blank will not be included)
* @param {string}	adminPassword		admin password (blank will not be included)
* @param {string}	username			username for user credentials (blank will not be included)
* @param {string}	password			password for user credentials (blank will not be included)
* @param {string}	[passwordType="PasswordDigest"]		Ws-Security password type. Supported values are 
*										"PasswordDigest" and "PasswordText".
* @return {string}	xml request
*/
function xrxJobMgmtListCompletedQueueSecureRequest( admin, adminPassword, username, password, passwordType )
{
    var result = XRX_MIME_BOUNDARY + XRX_MIME_HEADER + XRX_SOAPSTART
			+ xrxCreateTag( 'ListCompletedJobQueueSecureRequest', XRX_JOBMGMT_NAMESPACE, 
			    (((username != "") || (password != ""))?xrxCreateTag( 'UserAuthCredentials', XRX_XML_TYPE_NONE, 
			        ((username != "")?xrxCreateTag( 'Username',  XRX_XML_TYPE_NONE, username ):"")
			        + ((password != "")?xrxCreateTag( 'Password',  XRX_XML_TYPE_NONE, password ):"") ) : "") )
			+ XRX_SOAPEND + XRX_MIME_BOUNDARY_END;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != ""))) {
            result = addWsSecurityHeader( result, admin, adminPassword, passwordType );
		}
    }
    catch(e) { 
	}
    return result;
}

/**
* This function returns the job list.
*
* @param {string}	response	web service response in string form
* @return {object}	JobQueue xml payload in DOM form
*/
function xrxJobMgmtParseListCompletedQueueSecure( response )
{
	return xrxJobMgmtParseListQueueSecure( response );
}


/***************************  Queue Support Functions  ************************************/

/**
* This function returns the job list.
*
* @param {string}	response	web service response in string form
* @return {object}	JobQueue xml payload in DOM form
*/
function xrxJobMgmtParseListQueue( response )
{
	return xrxStringToDom( xrxJobMgmtParseListQueueString(response) );
}

/**
* This function returns the job list.
*
* @param {string}	response	web service response in string form
* @return {object}	JobQueue xml payload in DOM form
*/
function xrxJobMgmtParseListQueueSecure( response )
{
	return xrxStringToDom( xrxJobMgmtParseListQueueString(response) );
}

/**
* This function retrieves the JobQueue payload from the response
*
* @param {string}	response 	web service response in string form
* @return {string} 	JobQueue xml payload in string form
*/
function xrxJobMgmtParseListQueueString( response )
{
	var resultStr = '';
	var searchStr = "JobQueue";
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



//  GetJobDetails


/**
* This function gets job details for a specific job referenced by the job id
*
* @param {string}	url					destination address
* @param {string}   jobType             job type
* @param {string}	jobId			    job id
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxJobMgmtGetJobDetails( url, jobType, jobId, callback_success, callback_failure, timeout, async ) 
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_JOBMGMT_PATH;
	var sendReq = xrxJobMgmtGetJobDetailsRequest( jobType, 'JobId', jobId );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}

/**
* This LEGACY function gets job details for a specific job providing the job id
* 
* @private
* @param {string}	url					destination address
* @param {string}   jobType             job type
* @param {string}   jobIdType           job id type = "JobId"
* @param {string}	jobId			    job id
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxGetJobDetails( url, jobType, jobIdType, jobId, callback_success, callback_failure, timeout, async ) 
{
    xrxJobMgmtGetJobDetails( url, jobType, jobId, callback_success, callback_failure, timeout, async  );
}   

/**
* This function builds the request.
*
* @param {string}  	jobType     job type
* @param {string}   jobIdType   job id type = "JobId"
* @param {string}	jobId		job id     
* @return {string}	xml request
*/
function xrxJobMgmtGetJobDetailsRequest( jobType, jobIdType, jobId )
{
    var resq = XRX_SOAPSTART 
			+ xrxCreateTag( 'GetJobDetailsRequest', XRX_JOBMGMT_NAMESPACE,
			    xrxCreateTag( 'JobData', XRX_XML_TYPE_NONE, 
			        xrxCreateTag( 'JobIdentifierType', XRX_XML_TYPE_NONE, jobIdType ) 
			        + xrxCreateTag( 'JobIdentifierString', XRX_XML_TYPE_NONE, jobId ) ) 
			    + xrxCreateTag( 'JobType', XRX_XML_TYPE_NONE, jobType ) ) 
			+ XRX_SOAPEND;
    return resq;
}

/**
* This function returns the job state values.
*
* @param {string}	response	web service response in string form
* @return {object}	JobInfo xml payload in DOM form
*/
function xrxJobMgmtParseGetJobDetails( response )
{
	var data = xrxGetElementValue( xrxStringToDom( response ), "JobInfoXmlDocument" );
	if(data != null) 
	    data = xrxStringToDom( data );
	return data;
}

/**
* This LEGACY function returns the job values.
*
* @private
* @param {string}	response	web service response in string form
* @return {string}  JobInfo xml payload in DOM form
*/
function xrxParseGetJobDetails( response )
{
	return xrxJobMgmtParseGetJobDetails( response );
}

/**
* This function returns the parsed values.
*
* @param {string}	response	web service response in string form
* @return {string}	JobStateReasons
*/
function xrxJobMgmtParseJobStateReasons( response )
{
	var payloadNode = xrxFindElement( xrxStringToDom( response ), ["JobInfoXmlDocument"] );
	var payload = xrxGetValue( payloadNode );
	var data = xrxFindElement( xrxStringToDom( payload ), ["JobInfo","JobStateReasons"] );
	return xrxGetValue( data );
}


//  GetJobDetailsSecure


/**
* This function gets job details for a specific job referenced by the job id
*
* @param {string}	url					destination address
* @param {string}   jobType             job type
* @param {string}	jobId			    job id
* @param {string}	admin				admin username (blank will not be included)
* @param {string}	adminPassword		admin password (blank will not be included)
* @param {string}	username			username for user credentials (blank will not be included)
* @param {string}	password			password for user credentials (blank will not be included)
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @param {string}	[passwordType="PasswordDigest"]		Ws-Security password type. Supported values are 
*										"PasswordDigest" and "PasswordText".
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxJobMgmtGetJobDetailsSecure( url, jobType, jobId, admin, adminPassword, username, password, callback_success, callback_failure, timeout, async, passwordType ) 
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
	var sendUrl = url + XRX_JOBMGMT_PATH;
	var sendReq = xrxJobMgmtGetJobDetailsSecureRequest( jobType, 'JobId', jobId, admin, adminPassword, username, password, passwordType );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async );
}
   

/**
* This function builds the request.
*
* @param {string}  	jobType             job type
* @param {string}  	jobIdType           job id type = "Jobid"
* @param {string}	jobId		        job id   
* @param {string}	admin			    admin username (blank will not be included)
* @param {string}	adminPassword	    admin password (blank will not be included)
* @param {string}	username	        username for user credentials (blank will not be included)
* @param {string}	password	        password for user credentials (blank will not be included)
* @param {string}	[passwordType="PasswordDigest"]		Ws-Security password type. Supported values are 
*										"PasswordDigest" and "PasswordText".
* @return {string}	xml request
*/
function xrxJobMgmtGetJobDetailsSecureRequest( jobType, jobIdType, jobId, admin, adminPassword, username, password, passwordType )
{
    var result = XRX_SOAPSTART 
			+ xrxCreateTag( 'GetJobDetailsSecureRequest', XRX_JOBMGMT_NAMESPACE,
			    xrxCreateTag( 'JobData', XRX_XML_TYPE_NONE, 
			        xrxCreateTag( 'JobIdentifierType', XRX_XML_TYPE_NONE, jobIdType ) 
			        + xrxCreateTag( 'JobIdentifierString', XRX_XML_TYPE_NONE, jobId ) ) 
			    + xrxCreateTag( 'JobType', XRX_XML_TYPE_NONE, jobType )
			    + (((username != "") || (password != ""))?xrxCreateTag( 'UserAuthCredentials', XRX_XML_TYPE_NONE, 
			        ((username != "")?xrxCreateTag( 'Username',  XRX_XML_TYPE_NONE, username ):"")
			        + ((password != "")?xrxCreateTag( 'Password',  XRX_XML_TYPE_NONE, password ):"") ):"") )
			+ XRX_SOAPEND;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurityHeader( result, admin, adminPassword, passwordType );
    }
    catch(e)
    {}
    return result;
}

/**
* This function returns the job state values.
*
* @param {string}	response	web service response in string form
* @return {string}	JobInfo xml payload in DOM form
*/
function xrxJobMgmtParseGetJobDetailsSecure( response )
{
	var data = xrxGetElementValue( xrxStringToDom( response ), "JobInfoXmlDocument" );
	if(data != null) 
	    data = xrxStringToDom( data );
	return data;
}


//  Cancel Job


/**
* This function cancels the job referenced by the given Id.
*
* @param {string}	url					destination address
* @param {string}   jobType             job type
* @param {string}   jobId               job Id for desired job
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxJobMgmtCancelJob( url, jobType, jobId, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtCancelJobRequest( jobType, 'JobId', jobId );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async  );
}

/**
* This function builds the command request.
*
* @param {string}   jobType     job type
* @param {string}   jobIdType   job id type = "JobId"
* @param {string}	jobId		job id 
* @return {string}	xml request
*/
function xrxJobMgmtCancelJobRequest( jobType, jobIdType, jobId )
{
	return XRX_SOAPSTART +
        xrxCreateTag( 'CancelJobRequest', XRX_JOBMGMT_NAMESPACE, 
            xrxCreateTag( 'JobData', XRX_XML_TYPE_NONE, 
			    xrxCreateTag( 'JobIdentifierType', XRX_XML_TYPE_NONE, jobIdType ) 
			    + xrxCreateTag( 'JobIdentifierString', XRX_XML_TYPE_NONE, jobId ) ) 
			+ xrxCreateTag( 'JobType', XRX_XML_TYPE_NONE, jobType ) ) 
        + XRX_SOAPEND;
}


//  Cancel Job Secure


/**
* This function cancels the job referenced by the given Id.
*
* @param {string}	url					destination address
* @param {string}   jobType             job type
* @param {string}   jobId               job Id for desired job
* @param {string}	admin				admin username (blank will not be included)
* @param {string}	adminPassword		admin password (blank will not be included)
* @param {string}	username			username for user credentials (blank will not be included)
* @param {string}	password			password for user credentials (blank will not be included)
* @param {string}	pin     			pin for job (blank will not be included)
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @param {string}	[passwordType="PasswordDigest"]		Ws-Security password type. Supported values are 
*										"PasswordDigest" and "PasswordText".
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxJobMgmtCancelJobSecure( url, jobType, jobId, admin, adminPassword, username, password, pin, callback_success, callback_failure, timeout, async, passwordType )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtCancelJobSecureRequest( jobType, 'JobId', jobId, admin, adminPassword, username, password, pin, passwordType );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async  );
}

/**
* This function builds the command request.
*
* @param {string}   jobType            	job type
* @param {string}   jobIdType          	job id type = "JobId"
* @param {string}	jobId		        job id 
* @param {string}	admin				admin username (blank will not be included)
* @param {string}	adminPassword		admin password (blank will not be included)
* @param {string}	username			username for user credentials (blank will not be included)
* @param {string}	password			password for user credentials (blank will not be included)
* @param {string}	pin     			pin for job (blank will not be included)
* @param {string}	[passwordType="PasswordDigest"]		Ws-Security password type. Supported values are 
*										"PasswordDigest" and "PasswordText".
* @return {string}	xml request
*/
function xrxJobMgmtCancelJobSecureRequest( jobType, jobIdType, jobId, admin, adminPassword, username, password, pin, passwordType )
{
	var result = XRX_SOAPSTART +
        xrxCreateTag( 'CancelJobSecureRequest', XRX_JOBMGMT_NAMESPACE, 
            xrxCreateTag( 'JobData', XRX_XML_TYPE_NONE, 
			    xrxCreateTag( 'JobIdentifierType', XRX_XML_TYPE_NONE, jobIdType ) 
			    + xrxCreateTag( 'JobIdentifierString', XRX_XML_TYPE_NONE, jobId ) ) 
			+ xrxCreateTag( 'JobType', XRX_XML_TYPE_NONE, jobType )
            + (((username != "") || (password != ""))?xrxCreateTag( 'UserAuthCredentials', XRX_XML_TYPE_NONE, 
			    ((username != "")?xrxCreateTag( 'Username',  XRX_XML_TYPE_NONE, username ):"")
			    + ((password != "")?xrxCreateTag( 'Password',  XRX_XML_TYPE_NONE, password ):"") ):"")
			    + ((pin != "")?xrxCreateTag( 'PinNumber', XRX_XML_TYPE_NONE, pin ):"") ) 
        + XRX_SOAPEND;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurityHeader( result, admin, adminPassword, passwordType );
    }
    catch(e)
    {}
    return result;
}


//  Pause Job


/**
* This function pauses the job referenced by the given Id.
*
* @param {string}	url					destination address
* @param {string}   jobType             job type
* @param {string}   jobId               job Id for desired job
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxJobMgmtPauseJob( url, jobType, jobId, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtPauseJobRequest( jobType, 'JobId', jobId );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async  );
}

/**
* This function builds the command request.
*
* @param {string}   jobId       	job Id for desired job
* @param {string}   jobIdType     	job id type = "JobId"
* @return {string}	xml request
*/
function xrxJobMgmtPauseJobRequest( jobType, jobIdType, jobId )
{
	return XRX_SOAPSTART +
        xrxCreateTag( 'PauseJobRequest', XRX_JOBMGMT_NAMESPACE, 
            xrxCreateTag( 'JobData', XRX_XML_TYPE_NONE, 
			        xrxCreateTag( 'JobIdentifierType', XRX_XML_TYPE_NONE, jobIdType ) 
			        + xrxCreateTag( 'JobIdentifierString', XRX_XML_TYPE_NONE, jobId ) ) 
			    + xrxCreateTag( 'JobType', XRX_XML_TYPE_NONE, jobType ) ) 
        + XRX_SOAPEND;
}


//  Pause Job Secure


/**
* This function pauses the job referenced by the given Id.
*
* @param {string}	url					destination address
* @param {string}   jobType             job type
* @param {string}   jobId               job Id for desired job
* @param {string}	admin				admin username (blank will not be included)
* @param {string}	adminPassword		admin password (blank will not be included)
* @param {string}	username			username for user credentials (blank will not be included)
* @param {string}	password			password for user credentials (blank will not be included)
* @param {string}	pin     			pin for job (blank will not be included)
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @param {string}	[passwordType="PasswordDigest"]		Ws-Security password type. Supported values are 
*										"PasswordDigest" and "PasswordText".
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxJobMgmtPauseJobSecure( url, jobType, jobId, admin, adminPassword, username, password, pin, callback_success, callback_failure, timeout, async, passwordType )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtPauseJobSecureRequest( jobType, 'JobId', jobId, admin, adminPassword, username, password, pin, passwordType );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async  );
}

/**
* This function builds the command request.
*
* @param {string}   jobType             job type
* @param {string}   jobIdType          	job id type = "JobId"
* @param {string}   jobId               job Id for desired job
* @param {string}	admin				admin username (blank will not be included)
* @param {string}	adminPassword		admin password (blank will not be included)
* @param {string}	username			username for user credentials (blank will not be included)
* @param {string}	password			password for user credentials (blank will not be included)
* @param {string}	pin     			pin for job (blank will not be included)
* @param {string}	[passwordType="PasswordDigest"]		Ws-Security password type. Supported values are 
*										"PasswordDigest" and "PasswordText".
* @return {string}	xml request
*/
function xrxJobMgmtPauseJobSecureRequest( jobType, jobIdType, jobId, admin, adminPassword, username, password, pin, passwordType )
{
	var result = XRX_SOAPSTART +
        xrxCreateTag( 'PauseJobSecureRequest', XRX_JOBMGMT_NAMESPACE, 
            xrxCreateTag( 'JobData', XRX_XML_TYPE_NONE, 
			    xrxCreateTag( 'JobIdentifierType', XRX_XML_TYPE_NONE, jobIdType ) 
			    + xrxCreateTag( 'JobIdentifierString', XRX_XML_TYPE_NONE, jobId ) ) 
			+ xrxCreateTag( 'JobType', XRX_XML_TYPE_NONE, jobType )
			+ (((username != "") || (password != ""))?xrxCreateTag( 'UserAuthCredentials', XRX_XML_TYPE_NONE, 
			    ((username != "")?xrxCreateTag( 'Username',  XRX_XML_TYPE_NONE, username ):"")
			    + ((password != "")?xrxCreateTag( 'Password',  XRX_XML_TYPE_NONE, password ):"") ):"")
			    + ((pin != "")?xrxCreateTag( 'PinNumber', XRX_XML_TYPE_NONE, pin ):"") ) 
        + XRX_SOAPEND;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurityHeader( result, admin, adminPassword, passwordType );
    }
    catch(e)
    {}
    return result;
}


//  Resume Job


/**
* This function resumes the job referenced by the given Id.
*
* @param {string}	url					destination address
* @param {string}   jobType             job type
* @param {string}   jobId               job Id for desired job
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxJobMgmtResumeJob( url, jobType, jobId, callback_success, callback_failure, timeout, async )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtResumeJobRequest( jobType, 'JobId', jobId );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async  );
}

/**
* This function builds the command request.
*
* @param {string}   jobType       	job type
* @param {string}   jobIdType     	job id type = "JobId"
* @param {string}   jobId         	job Id for desired job
* @return {string}	xml request
*/
function xrxJobMgmtResumeJobRequest( jobType, jobIdType, jobId )
{
	return XRX_SOAPSTART +
        xrxCreateTag( 'ResumeJobRequest', XRX_JOBMGMT_NAMESPACE, 
            xrxCreateTag( 'JobData', XRX_XML_TYPE_NONE, 
			    xrxCreateTag( 'JobIdentifierType', XRX_XML_TYPE_NONE, jobIdType ) 
			    + xrxCreateTag( 'JobIdentifierString', XRX_XML_TYPE_NONE, jobId ) ) 
			+ xrxCreateTag( 'JobType', XRX_XML_TYPE_NONE, jobType ) ) 
        + XRX_SOAPEND;
}


//  Resume Job Secure


/**
* This function resumes the job referenced by the given Id.
*
* @param {string}	url					destination address
* @param {string}   jobType             job type
* @param {string}   jobId               job Id for desired job
* @param {string}	admin				admin username (blank will not be included)
* @param {string}	adminPassword		admin password (blank will not be included)
* @param {string}	username			username for user credentials (blank will not be included)
* @param {string}	password			password for user credentials (blank will not be included)
* @param {string}	pin     			pin for job (blank will not be included)
* @param {string}	callback_success	function to callback upon successful completion
* @param {string}	callback_failure	function to callback upon failed completion
* @param {number}	[timeout=0]			amount of seconds to wait before calling 
*										the callback_failure routine (0 = no timeout)
* @param {boolean}  [async=true]        make asynchronous call if true,
* 										make synchronous call if false
* @param {string}	[passwordType="PasswordDigest"]		Ws-Security password type. Supported values are 
*										"PasswordDigest" and "PasswordText".
* @return {string} 	Blank string or comm error beginning with "FAILURE" if async == true,
*           		response or comm error beginning with "FAILURE" if async == false.
*/
function xrxJobMgmtResumeJobSecure( url, jobType, jobId, admin, adminPassword, username, password, pin, callback_success, callback_failure, timeout, async, passwordType )
{
    if((url == null) || (url == ""))
        url = "http://127.0.0.1";
    var sendUrl = url + XRX_JOBMGMT_PATH;
    var sendReq = xrxJobMgmtResumeJobSecureRequest( jobType, 'JobId', jobId, admin, adminPassword, username, password, pin, passwordType );
	return xrxCallWebservice( sendUrl, sendReq, callback_success, callback_failure, timeout, null, null, null, async  );
}

/**
* This function builds the command request.
*
* @param {string}  	jobType             job type
* @param {string}   jobIdType          	job id type = "JobId"
* @param {string}   jobId               job Id for desired job
* @param {string}	admin				admin username (blank will not be included)
* @param {string}	adminPassword		admin password (blank will not be included)
* @param {string}	username			username for user credentials (blank will not be included)
* @param {string}	password			password for user credentials (blank will not be included)
* @param {string}	pin     			pin for job (blank will not be included)
* @param {string}	[passwordType="PasswordDigest"]		Ws-Security password type. Supported values are 
*										"PasswordDigest" and "PasswordText".
* @return {string}	xml request
*/
function xrxJobMgmtResumeJobSecureRequest( jobType, jobIdType, jobId, admin, adminPassword, username, password, pin, passwordType )
{
	var result = XRX_SOAPSTART +
        xrxCreateTag( 'ResumeJobSecureRequest', XRX_JOBMGMT_NAMESPACE, 
            xrxCreateTag( 'JobData', XRX_XML_TYPE_NONE, 
			    xrxCreateTag( 'JobIdentifierType', XRX_XML_TYPE_NONE, jobIdType ) 
			    + xrxCreateTag( 'JobIdentifierString', XRX_XML_TYPE_NONE, jobId ) ) 
			+ xrxCreateTag( 'JobType', XRX_XML_TYPE_NONE, jobType )
			+ (((username != "") || (password != ""))?xrxCreateTag( 'UserAuthCredentials', XRX_XML_TYPE_NONE, 
			    ((username != "")?xrxCreateTag( 'Username',  XRX_XML_TYPE_NONE, username ):"")
			    + ((password != "")?xrxCreateTag( 'Password',  XRX_XML_TYPE_NONE, password ):"") ):"")
			    + ((pin != "")?xrxCreateTag( 'PinNumber', XRX_XML_TYPE_NONE, pin ):"") ) 
        + XRX_SOAPEND;
    try
	{
        if(((admin != null) && (admin != "")) && ((adminPassword != null) && (adminPassword != "")))
            result = addWsSecurityHeader( result, admin, adminPassword, passwordType );
    }
    catch(e)
    {}
    return result;
}

/*************************  End of File  *****************************/
