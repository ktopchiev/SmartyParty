using Server.Hubs;

var builder = WebApplication.CreateBuilder(args);

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

var app = builder.Build();

// app.UseDefaultFiles();
// app.UseStaticFiles();

app.MapHub<GameHub>("/hub");
app.UseCors("client");

app.Run();
