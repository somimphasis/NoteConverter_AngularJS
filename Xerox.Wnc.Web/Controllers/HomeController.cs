using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Resources;
using Xerox.Wnc.Resources.Resources;
using Xerox.Wnc.Web.Models;

namespace Xerox.Wnc.Web.Controllers
{

    [Route("api")]
    public class HomeController : Controller
    {
        private IConfiguration _configuration;

        public HomeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Returns the localization strings for all supported languages in JSON format for the app.
        /// </summary>
        /// <returns></returns>
        [Route("strings")]
        public IActionResult GetStrings(string lang = "")
        {
            //lang = SupportedLanguages.GetSupportedLanguage(new List<string>() { lang });

            if (!String.IsNullOrEmpty(lang))
            {
                CultureInfo.CurrentUICulture = new CultureInfo(lang, false);
            }

            ResourceSet resources = AppsResource.ResourceManager.GetResourceSet(CultureInfo.CurrentUICulture, true, true);
            Dictionary<string, string> resourceDict = new Dictionary<string, string>();

            foreach (DictionaryEntry resource in resources)
            {
                resourceDict.Add(resource.Key.ToString(), resource.Value.ToString());
            }

            return Json(new
            {
                strings = resourceDict
            });
        }

        [HttpPost]
        [Route("log")]
        public void LogInfo([FromBody]LogItem logItem)
        {
            try
            {
                switch (logItem.LogType.ToLower())
                {
                    case "information":
                        Trace.TraceInformation($"deviceId={logItem.DeviceID ?? "null"}: " + logItem.LogMessage);
                        break;
                    case "error":
                        Trace.TraceError($"deviceId={logItem.DeviceID ?? "null"}: " + logItem.LogMessage);
                        break;
                    case "warning":
                        Trace.TraceWarning($"deviceId={logItem.DeviceID ?? "null"}: " + logItem.LogMessage);
                        break;
                }
            }
            catch { }
        }

        [HttpGet("/index.html")]
        public IActionResult Index()
        {
            ViewBag.InstrumentationKey = _configuration["APPINSIGHTS_INSTRUMENTATIONKEY"];
            return View();
        }
    }
}
