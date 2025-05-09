using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.DTOs;
using Server.Endpoints;
using Server.Hubs;
using Server.Models;

var builder = WebApplication.CreateBuilder(args);

// builder.Services.AddAuthorizationBuilder()
//   .AddPolicy("admin_greetings", policy =>
//         policy
//             .RequireRole("admin")
//             .RequireClaim("scope", "greetings_api"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

// builder.Services.AddAuthentication()
//     .AddJwtBearer()
//     .AddJwtBearer("LocalAuthIssuer");
// builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
    });
}

// app.UseDefaultFiles();
// app.UseStaticFiles();
app.UseCors("client");

// app.UseAuthentication();
// app.UseAuthorization();

app.MapHub<GameHub>("/hub");

app.MapUserEndpoints();

var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<SmartyPartyDbContext>();

await context.Database.MigrateAsync();
await DbInitializer.Initialize(context);

app.Run();
