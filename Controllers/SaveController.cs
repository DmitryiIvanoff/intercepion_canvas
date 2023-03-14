using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Drawing;
using System.Text.Json;
using InterceptionCanvas.Models;
using DataBaseContext = InterceptionCanvas.Service.DataBaseContext;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace InterceptionCanvas.Controllers
{
    /// <summary>
    /// Конечная точка API - выгружает из БД фигуры и созраняет
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class SaveController : ControllerBase
    {
        private readonly ILogger<SaveController> logger;

        private DataBaseContext ctx;

        public SaveController(ILogger<SaveController> logger, DataBaseContext ctx) {
            this.logger = logger;
            this.ctx = ctx;
        }

        // GET: api/<SaveController>
        [HttpGet]
        public IEnumerable<Figure> Get()
        {
            return this.ctx.Figure.ToList<Figure>();
        }

        // POST api/<SaveController>
        [HttpPost]
        public void Post([FromBody] JsonElement value)
        {            
            this.ctx.Database.ExecuteSqlRaw($"TRUNCATE TABLE {this.ctx.Figure.EntityType.GetTableName()}");
            var json = value.Deserialize<Figure[]>();
            if(json != null)
            {
                this.ctx.AddRange(json);
                this.ctx.SaveChanges();
            }           
        }
    }
}
