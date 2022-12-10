using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Hive.Api.Tests.Integration;

public class ProdWebApplicationFactory<TProgram> : WebApplicationFactory<TProgram> where TProgram : class
{
    private IWebHostBuilder? _builder;

    protected override void ConfigureWebHost(IWebHostBuilder? builder)
    {
        _builder = builder;
        builder?.UseEnvironment("Production");
    }

    protected override void Dispose(bool disposing)
    {
        _builder?.UseEnvironment("Development");
        base.Dispose(disposing);
    }
}
