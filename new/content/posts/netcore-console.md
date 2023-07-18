---
authorlink: http://ksmigiel.com
authorname: Krzysztof Śmigiel
date: 2018-01-18T13:13:09+00:00
description: "Konfiguracja, logowanie i dependency injection"
excerpt: "Zapewne dla tych, którzy mieli styczność z frameworkiem ASP.NET Core zagadnienia takie jak pliki konfiguracyjne projektu, logowanie zdrarzeń i dependency injection nie są żadną nowością. Cała filozofia nowego ASP.NET opiera się na DI i modułowości, a większość poradników właśnie od tego zaczyna."
slug: netcore-console
title: "Aplikacja konsolowa w .NET Core"
tags: ["netcore", "dotnet"]
---

Zapewne dla tych, którzy mieli styczność z frameworkiem ASP.NET Core zagadnienia takie jak pliki konfiguracyjne projektu, logowanie zdrarzeń i dependency injection nie są żadną nowością. Cała filozofia nowego ASP.NET opiera się na DI i modułowości, a większość poradników właśnie od tego zaczyna.

Ponieważ ostatnio dużo eksperymentuję z .NET Core i Visual Studio Code postanowiłem sprawdzić, czy klasy używane w ASP.NET Core są re-używalne w aplikacji konsolowej.

Okazuje się, że istnieje skończona kombinacja paczek NuGet'owych pozwalająca uzyskać taką samą funkcjonalność - zawdzięczamy to architekturze ASP.NET Core, który jest frameworkiem złożonym z niezależnych komponentów.

## Pliki konfiguracyjne
W klasycznej wersji .NET korzystaliśmy z plików XML `*.config` i klas `ConfigurationManager` czy `Configuration`. W przypadku .NET Core do przechowywania konfiguracji domyślnie stosowany jest format JSON. Spójrzmy na przykładowy kawałek kodu.

``` csharp
using System.IO;
using Microsoft.Extensions.Configuration;

namespace Configuration
{
    public sealed class AppConfiguration
    {
        private readonly IConfigurationRoot _configuration;

        public AppConfiguration()
        {
            _configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();
        }

        public IConfigurationRoot Configuration => _configuration;
    }
}
```

Główną rolę odgrywa tutaj namespace `Microsoft.Extensions.Configuration`. Niestety poza ASP.NET Core musimy sami zadbać o ściągnięcie odpowiednich paczek z _extension methods_, których chcemy użyć.
Tak więc do naszego .csproj'a musimy wrzucić: (lub z linii komend odpalić `dotnet add package <PACKAGE_NAME>`)

```
<PackageReference Include="Microsoft.Extensions.Configuration" Version="2.0.0" />
<!-- SetBasePath() -->
<PackageReference Include="Microsoft.Extensions.Configuration.FileExtensions" Version="2.0.0" />
<!-- AddJsonFile() -->
<PackageReference Include="Microsoft.Extensions.Configuration.Json" Version="2.0.0" />
```

Plik `appsettings.json` może zawierać m.in. konfigurację logowania. W [dokumentacji][1] znajdziesz wiele przydatynch informacji o logowaniu, do którego zaraz zresztą przejdziemy.

```
{
    "Logging": {
        "IncludeScopes": true,
        "LogLevel": {
            "Default": "Debug"
        }
    }
}
```

## Logowanie
Dodanie logowania do aplikacji ociera się już o wstrzykiwanie zależności.

``` csharp
var appConfiguration = new AppConfiguration(); // (1)

var services = new ServiceCollection(); //        (2)
services.AddLogging((builder) => //               (3)
{
    builder
        .AddConfiguration(appConfiguration.Configuration.GetSection("Logging")) // (4)
        .AddConsole() //                                                           (5)
        .AddDebug(); //                                                            (6)
});
```

Przeanalizujmy co się tutaj podziało. Tworzymy konfigurację przy pomocy poprzednio omówionej klasy (1). Tworzymy nowy kontener DI (2). Do kontenera dodajemy logowanie (3). Konfigurujemy logowanie przy pomocy naszej klasy konfiguracyjnej (4) i ustawiamy wyjście loggera na konsolę (5) i okno debug (6).

Aby kod się kompilował musimy dodać kolejne paczki NuGet:

```
<!-- ServiceCollection() -->
<PackageReference Include="Microsoft.Extensions.DependencyInjection" Version="2.0.0" />
<!-- AddLogging() -->
<PackageReference Include="Microsoft.Extensions.Logging" Version="2.0.0" />
<!-- AddConfiguration() -->
<PackageReference Include="Microsoft.Extensions.Logging.Configuration" Version="2.0.0" />
<!--  AddConsole() -->
<PackageReference Include="Microsoft.Extensions.Logging.Console" Version="2.0.0" />
<!-- AddDebug() -->
<PackageReference Include="Microsoft.Extensions.Logging.Debug" Version="2.0.0" />
```

Pozostało nam jedynie zarejestrować odpowiednie komponenty w kontenerze DI i gotowe!

## Dependency Injection
W tym momencie do stworzonej instancji `ServiceCollection` musimy dodać potrzebne zależności. Posłużą nam do tego metody:

- `AddTransient()` - instancja tworzona za każdym razem
- `AddScoped()` - instancja tworzona per request
- `AddSingleton()` - jedna instancja

``` csharp
services.AddSingleton<AppConfiguration>(appConfiguration);
services.AddTransient<Server>();
var container = services.BuildServiceProvider();
var server = container.GetService<Server>();
server.Start();
```

W tym momencie w klasie `Server` możemy wstrzykiwać zależności przez konstruktor.

``` csharp
public class Server
{
    private readonly IConfigurationRoot _configuration;
    private readonly ILogger _logger;

    public Server(ILoggerFactory loggerFactory, AppConfiguration configuration)
    {
        _logger = loggerFactory.CreateLogger<Server>();
        _configuration = configuration.Configuration;
    }
}
```

`ILoggerFactory` jest automatycznie zarejestrowany w kontenerze poprzez wcześniejszą rejestrację `services.AddLogging(...)`.

## Podsumowanie
Jak widać .NET Core udostępnia wiele gotowych rozwiązań, dzięki czemu nie musimy korzystać z bibliotek third-party. Oczywiście nic nie stoi na przeszkodzie, aby do logowania podpiąć [Serilog][2], a zależności rozwiązać [Autofac'iem][3]. Wszystko zależy od przypadku użycia, aczkolwiek dla małych projektów rozwiązania od teamu .NET Core wydają się całkiem sensowne.

Cały kod z przykładów możecie znaleźć na moim [GitHub][4].

---

1. https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?tabs=aspnetcore2x
2. https://github.com/serilog/serilog-extensions-logging
3. http://autofaccn.readthedocs.io/en/latest/integration/netcore.html
4. https://github.com/ksmigiel/SSHServer


[1]: https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?tabs=aspnetcore2x
[2]: https://github.com/serilog/serilog-extensions-logging
[3]: http://autofaccn.readthedocs.io/en/latest/integration/netcore.html
[4]: https://github.com/ksmigiel/SSHServer

