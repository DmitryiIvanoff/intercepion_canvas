using Microsoft.EntityFrameworkCore;
using DataBaseContext = InterceptionCanvas.Service.DataBaseContext;

namespace InterceptionCanvas
{
    public class Startup
    {
        private ConfigurationManager configuration;

        public Startup(ConfigurationManager configuration)
        {
            this.configuration = configuration;
        }

        /// <summary>
        /// Регистрируем сервис
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddTransient<DataBaseContext, DataBaseContext>();
            services.AddDbContext<DataBaseContext>(options => options.UseSqlServer(this.configuration.GetConnectionString("AppContext")));
            services.AddControllers().AddJsonOptions(opts => opts.JsonSerializerOptions.PropertyNamingPolicy = null);
        }       
    }
}
