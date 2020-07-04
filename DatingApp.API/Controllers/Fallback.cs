using System.IO;
using Microsoft.AspNetCore.Mvc;

// to allow us to serve the angular files from the API's Kestrel server

namespace DatingApp.API.Controllers
{
    public class Fallback : Controller
    {
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot",
                "index.html"), "text/HTML");
        }
    }
}