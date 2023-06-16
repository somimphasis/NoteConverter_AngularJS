using Microsoft.AspNetCore.Mvc;

namespace Xerox.Wnc.Web.Controllers
{
    [Route("HealthCheck")]
    public class HealthCheckController : ControllerBase
    {
        [HttpGet]
        public string Get()
        {
            return "OK";
        }
    }
}
