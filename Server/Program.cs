using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Hubs;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<SmartyPartyDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("client",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173/")
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // app.MapOpenApi();
    app.MapScalarApiReference();
}

// app.UseDefaultFiles();
// app.UseStaticFiles();

app.MapHub<GameHub>("/hub");
app.UseCors("client");

var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<SmartyPartyDbContext>();

await context.Database.MigrateAsync();
await DbInitializer.Initialize(context);

app.Run();
