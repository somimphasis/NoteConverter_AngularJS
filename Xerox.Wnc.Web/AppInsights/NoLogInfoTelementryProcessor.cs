using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;

namespace Xerox.Wnc.Web.AppInsights
{
    public class NoLogInfoTelementryProcessor : ITelemetryProcessor
    {
        private ITelemetryProcessor Next { get; set; }
        public NoLogInfoTelementryProcessor(ITelemetryProcessor next)
        {
            this.Next = next;
        }
        public void Process(ITelemetry item)
        {
            if (item is RequestTelemetry request)
            {
                if (request.Url.ToString().Contains("api/log"))
                {
                    return;
                }
            }

            this.Next.Process(item);
        }
    }
}
