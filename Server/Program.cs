using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Server.Controllers;
using Server.Data;
using Server.Endpoints;
using Server.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
    {
        var jwtSecurityScheme = new OpenApiSecurityScheme
        {
            BearerFormat = "JWT",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = JwtBearerDefaults.AuthenticationScheme,
            Description = "Put Bearer + your token in the box below",
            Reference = new OpenApiReference
            {
                Id = JwtBearerDefaults.AuthenticationScheme,
                Type = ReferenceType.SecurityScheme
            }
        };

        c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);

        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                jwtSecurityScheme, Array.Empty<string>()
            }
        });
    });

builder.Services.AddHttpClient();
builder.Services.AddScoped<AIQuestionService>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddSingleton<UserConnectionService>();

builder.Services.AddDbContext<SmartyPartyDbContext>(options =>

    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSignalR()
.AddHubOptions<ConnectionUserHub>(options =>
{
    options.EnableDetailedErrors = true;
    options.MaximumReceiveMessageSize = 1024000; // 1 MB
});

builder.Services.AddCors();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

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

app.UseCors(options =>
{
    options.WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
});

app.UseAuthentication();
app.UseAuthorization();


app.MapUserEndpoints();
app.MapQuestionEndpoints();
app.MapHub<ConnectionUserHub>("/hubs/connectionuser");

var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<SmartyPartyDbContext>();

await context.Database.MigrateAsync();
await DbInitializer.Initialize(context);

app.Run();
