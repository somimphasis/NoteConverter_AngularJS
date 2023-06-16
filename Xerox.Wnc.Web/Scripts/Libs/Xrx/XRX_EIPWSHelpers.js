//
// Help functions
//

/**
 * Help function, build the PrintJobTicket.
 * 
 * @param jobDescription    job description tag string
 * @param jobProcessing     job processing tag string
 * @return string PrintJobTicket tag in escaped form
 */
function xrxPrintJobTicket(jobDescription, jobProcessing) {
    var ticketStr = '<?xml version=\"1.0\" encoding=\"utf-8\"?>' +
		xrxCreateTag('PrintJobTicket', 'xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns=\"http://schemas.xerox.com/enterprise/eipjobmodel/1\"', jobDescription + jobProcessing);
    return xrxEscape(ticketStr);
}

/**
 * Help function, build the JobDescription tag in the PrintJobTicket
 *
 * @param jobName   job name 
 * @param jobOriginating    job owner
 * @return string JobDescription tag in PrintJobTicket 
 */
function xrxPrintJobDescription(jobName, jobOriginating) {
    return xrxCreateTag('JobDescription', '',
		xrxCreateTag('JobName', '', jobName) + xrxCreateTag('JobOriginatingUserName', '', jobOriginating));
}

/**
 * Help function, build the JobProcessing tag in the PrintJobTicket
 * @param input     input tag string
 * @param output    output tag string
 * @return string   JobProcessing tag in PrintJobTicket
 */
function xrxPrintJobProcessing(input, output) {
    return xrxCreateTag('JobProcessing', '', input + output);
}

/**
 * Help function, build the Input tag in the PrintJobTicket when the accouting type is JBA
 * 
 * @param jbaUserId JBA user id
 * @param jbaAcctId JBA account id
 * @return string   Input tag in PrintJobTicket 
 */
function xrxPrintInputJBA(jbaUserId, jbaAcctId) {
    return xrxCreateTag('Input', '',
		xrxCreateTag('Accounting', '', xrxCreateTag('Jba', '',
			xrxCreateTag('JobAccountingUserId', '', jbaUserId) + xrxCreateTag('JobAccountId', '', jbaAcctId))));
}


/**
 * Help function, build the Input tag in the PrintJobTicket when the accouting type is XSA
 *
 * @param xsaUserId     XSA user id
 * @param xsaAcctType   XSA account type
 * @param xsaAcctId     XSA account id
 * @return string       Input tag in PrintJobTicket
 */
function xrxPrintInputXSA(xsaUserId, xsaAcctType, xsaAcctId) {
    return xrxCreateTag('Input', '',
         xrxCreateTag('Accounting', '', xrxCreateTag('Xsa', '',
             xrxCreateTag('AccountUserId', '', xsaUserId) + xrxCreateTag('AccountTypeInfo', '',
                 xrxCreateTag('AccountType', '', xsaAcctType) + xrxCreateTag('AccountID', '', xsaAcctId)) +
             xrxCreateTag('AccountBillingId', '', ''))));
}


/**
 * Help function, build the Output tag in the PrintJobTicket
 *
 * @param staple    StapleFinishing value
 * @param punch     PunchFinishing value
 * @param fold      FoldFinishing value
 * @param color     ColorEffectsType value
 * @param collate   SheetCollate value
 * @param copies    Number of copies
 * @param sides     Output plex value
 * @param inputTray Input tray value
 * @return string   Output tag in PrintJobTicket
 *
 */
function xrxPrintOutput(staple, punch, fold, color, collate, copies, sides, inputTray) {
    var finishingTag = xrxCreateTag('Finishings', '',
			xrxCreateTag('StapleFinishing', '', staple) + xrxCreateTag('PunchFinishing', '', punch) + xrxCreateTag('FoldFinishing', '', fold));

    var colorEffectsTag = xrxCreateTag('ColorEffectsType', '', color);

    var collationTag = xrxCreateTag('SheetCollate', '', collate);

    var copiesTag = xrxCreateTag('Copies', '', copies);

    var sidesTag = xrxCreateTag('Sides', '', sides);

    var trayTag = xrxCreateTag('InputTraysCol', '', xrxCreateTag('InputTrayName', '', inputTray));

    return xrxCreateTag('Output', '', finishingTag + colorEffectsTag + collationTag + copiesTag + sidesTag + trayTag);
}

/*
* Function to escape the unescaped characters in a xml payload.
*
* @param text	string to modify
*/
function xrxEscape(text) {
    text = unescape(text);
    text = xrxReplaceChars(text, "<", "&lt;");
    text = xrxReplaceChars(text, ">", "&gt;");
    return text;
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string		jobID
*/
function xrxPrintParseInitiateJob(response) {
    var data = xrxFindElement(xrxStringToDom(response), ['InitiatePrintJobURLResponse', 'JobId']);
    var jobID = xrxGetValue(data);
    return jobID;
}


/**
* This function returns the job state values.
*
* @param	response	webservice response in string form
* @return	string	    JobState
*/
function xrxParseJobState(response) {
    var payloadNode = xrxFindElement(xrxStringToDom(response), ["JobInfoXmlDocument"]);
    var payload = xrxGetValue(payloadNode);

    var data = xrxFindElement(xrxStringToDom(xrxUnescape(payload)), ["JobInfo", "JobState"]);
    return xrxGetValue(data);
}

/**
* This function returns the parsed values.
*
* @param	response	webservice response in string form
* @return	string	    JobStateReason
*/
function xrxParseJobStateReasons(response) {
    return xrxJobMgmtParseJobStateReasons(response);
}
