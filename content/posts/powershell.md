---
aliases:
  - /2016/01/powershell
authorlink: http://ksmigiel.com
authorname: Krzysztof Śmigiel
date: 2016-01-28T21:59:09+01:00
description: "Parę słów o podobieństwach w PowerShellu napisane"
excerpt: "Lata temu przeżywałem okres fascynacji Linuxem. Pierwszą dystrybucją, którą zainstalowałem bodajże z 5 płyt CD był Mandrake Linux (kontynuowany jako Mandriva - obecnie nie jest już utrzymywana). Potem, o ile mnie pamięć nie myli, był Slackware i Slax (jego mniejszy kuzyn-portable)."
slug: powershell
title: "Czy Windows może zastąpić Linuxa?"
tags: ["powershell", "linux"]
---

Lata temu przeżywałem okres fascynacji Linuxem. Pierwszą dystrybucją, którą zainstalowałem bodajże z 5 płyt CD był **Mandrake Linux** (kontynuowany jako [Mandriva][1] - obecnie nie jest już utrzymywana). Potem, o ile mnie pamięć nie myli, był Slackware i Slax (jego mniejszy kuzyn-portable).

## Linuxy i konsola
Bardzo lubiłem dystrybucje [**Live CD**][2]. Wszystko zaczęło się, gdy popsułem bootloadera z instalacją Windows XP i przez kilka dni w domu nikt nie mógł używać komputera (no poza mną - linuksiarzem). Mieliśmy wtedy tylko jeden komputer (jakiś AMD Duron 800 Mhz), więc rodzina szybko wywarła na mnie wpływ i posprzątałem po sobie formatując cały dysk twardy, razem ze swoją świętą instalacją Linuxa. Nie chcąc w przyszłości psuć domownikom partycji z systemem operacyjnym, zacząłem szukać "bezpieczniejszych" alternatyw.

Plusem systemów Live CD było to, że nie wymagały instalacji. Całość ładowana była do pamięci RAM, tak więc zaraz po włożeniu płytki mieliśmy w pełni działającego Linuxa. Problemem było zapisywanie swojej pracy i stanu systemu, jednak wspomniany Slax potrafił robić "snapshoty" i poprzez definicję modułów startowych, jakie miały zostać załadowane przy następnym rozruchu, mogliśmy bez problemu wznowić poprzednią sesję.

Ale wiecie co? Ciągłe wkładanie i wyciąganie tej płyty w cale nie było takie wygodne. Poszedłem więc o krok dalej w tworzeniu swojego idealnego środowiska i złamałem wszelkie zasady ładując dystrybucję Live CD z dysku twardego do pamięci. Dla domowników cała operacja była transparentna, bo na dyskietce miałem bootloadera [lilo][4] ze Slax'em. Zatem udało mi się zamienić płytę na dyskietkę. Tak. Szczerze, nie wiem co mną wtedy kierowało, ale jak tego dokonałem znajdziecie w poście, który napisałem [**10 lat** temu!][3] W rzeczywistości wtedy zaczęła się moja przygoda z pisaniem (i na szczęście szybko się skończyła :D).

### Konsola!
Wszystkiemu winna była konsola. Wklepywanie komand w terminalu sprawiało mi tyle przyjemności, że po pewnym czasie w ogóle przestałem używać GUI (KDE, Gnome) i myszy. Koajrzycie [EKG][5] (**E**ksperymentalny **K**lient **G**adu-Gadu)? To był dopiero hardkor. Poza surfowaniem po necie wszystko robiłem z poziomu terminala:, IRC, bash, python, vim i to poczucie "hakowania" było uzależniające.

### Zawodowy Windows!
Po okresie "trybu tekstowego" wróciłem do normalności i Windowsa, na którym był większy wybór narzędzi do obróbki audio i edycji nut (jak wiecie zajmuje się tym w tak zwanym "międzyczasie"). Na początku przełączałem się między systemami, w zależności od tego co w danej chwili było mi potrzebne. Z czasem jednak godziny spędzane na Windowsie zaczęły przeważać i swoje "hakersko"-programistyczne nawyki zacząłem też tam przenosić. Poznałem platformę .NET, C#, VB. Na studiach wszystkie projekty pisałem w C# i w tym kierunku poprowadziłem swoją karierę. Związałem się zawodowo z Windowsem i chcąć nie chcąc musiałem zacząć szukać narzędzi, które wypełniłyby lukę po terminalu z Linuxa.

## posh - zastępca basha
posh (**P**ower**Sh**ell) okazał się kapitalnym zamiennikiem. Nie dość, że mogłem ponownie klepać sobie komendy z terminala (nawet nazywające się tak samo, ale o tym zaraz), to świetnie sprawdził się jako pomoc w automatycji zadań, a jego integracja z .NET dostarczała ogromne możliwości eksperymentowania z punktu widzenia programisty. Serio, jeśli jeszcze nie korzystałeś z PowerShella w inny sposób, niż jak z "linii komend" i zamiennika `cmd.exe`, koniecznie poświęc mu trochę czasu. Taka znajomość zaprocentuje. Mam nadzieję, że bardzo szybki przegląd ciekawostek posh'a zachęci Cię do poznania tej "linuxowej części windowsa" :)

### cmdlet i alias
**cmdlet** jest jakby .NET'owym obudowaniem zwykłego polecenia. Powrzechnie jest przyjęte nazywać je zgodnie ze schematem _Czasownik-Rzeczownik_, np. `Get-Location`. Wspominałem wyżej o takich samych nazwach komend, odpowiednikach Linuxowych: w rzeczywistości są to **aliasy** do innych cmdletów.

| alias | cmdlet        |
|-------|---------------|
| pwd   | Get-Location  |
| ls    | Get-ChildItem |
| cd    | Set-Location  |
| ps    | Get-Process   |
| mv    | Move-Item     |
| cp    | Copy-Item     |
| man   | help          |
| rm    | Remove-Item   |
| cat   | Get-Content   |
| grep  | Select-String |
| kill  | Stop-Process  |
|&nbsp; |&nbsp;         |

Dla niezaznajomionych z terminologią basha jego odpowiedniki w posh'u z pewnością okażą się bardziej intuicyjne i łatwiejsze w przyswojeniu.
Do identyfkowania aliasów i cmdletów służy `Get-Alias`:

``` powershell
PS> Get-Alias cd

CommandType     Name
-----------     ----
Alias           cd -> Set-Location

```

Oraz w przeciwnym kierunku, dostępne aliasy dla cmdleta:

``` powershell
PS> Get-Alias -Definition Get-Location

CommandType     Name
-----------     ----
Alias           gl -> Get-Location
Alias           pwd -> Get-Location

```

Zwróćię uwagę na `-Definition`. Praktycznie każdy cmdlet akceptuje jeden lub więcej opcjonalnych parametrów, które po poleceniu poprzedzamy średnikiem (_-NazwaParametru Wartość_). `Get-Help` i MSDN będą niezastąpionymi źródłami wiedzy na ten temat. Możemy jednak szybko przeskanować interesujący nas cmdlet/obiekt.

### \<psobjet\>
Wiedząc już, że polecenia są opakowane w obiekty, możemy zaglądnąc do "bebchów" każdego z nich.

``` powershell
PS> Get-Alias | Get-Member

   TypeName: System.Management.Automation.AliasInfo

Name                MemberType     Definition
----                ----------     ----------
Equals              Method         bool Equals(System.Object obj)
GetHashCode         Method         int GetHashCode()
GetType             Method         type GetType()
ToString            Method         string ToString()
Definition          Property       string Definition {get;}
[...]
```

Jak widzicie mamy tutaj wgląd w strukturę całego obiektu, jego metody, właściwości. Przydaje się to szczególnie wtedy, gdy chcemy szybko rzucić okiem na dany cmdlet bez zagłębiania się w dokumentację, która z resztą jest całkiem opasła.

### Operator pipy
**"|"**, czyli tzw. _pipeline operator_ pozwala na przekazywanie wyniku danego wywołania do kolejnego bez potrzeby rozdzielania go na osobne deklaracje etc. Bardzo popularna technika stosowana m.in w językach funkcyjnych ("|>" z F#). Powyżej przekazaliśmy `<psobjet> Get-Alias` do `Get-Member`, który (jak zaglądniecie do środka) przyjmuje paramter `[-InputObject <psobject>]`. W ten sposób wiemy, że możemy korzystać z pipeline'a. Zwróćie też uwagę na `TypeName: System.Management.Automation.AliasInfo` - jak widać nie kłamałem z tym .NET'em w środku posha :)

### Filtrowanie i formatowanie
W pudełku z PS'em znajdziemy zestaw narzędzi umożliwiających w przystępny sposób formatowanie wyniku końcowego naszego polecenia/skryptu. Powiedzmy, że chcę listę pierwszych 10-ciu procesów i wynik ten dostać w postaci JSON. Brzmi skomplikowanie? Jak najbardziej! Tylko szkoda, że rozwiązanie jest trywialne:

``` powershell
PS> ps | select Name, Id -First 10 | ConvertTo-Json

[
    {
        "Name":  "ApplicationFrameHost",
        "Id":  4244
    },
    {
        "Name":  "AudioDevMon",
        "Id":  2124
    },
[...]
```

Albo tylko procesy Chrome?

``` powershell
PS> ps | where ProcessName -eq chrome

Handles  NPM(K)    PM(K)      WS(K) VM(M)   CPU(s)     Id  SI ProcessName
-------  ------    -----      ----- -----   ------     --  -- -----------
    287      26    55452      83712   315     3,16   2804   1 chrome
   1661      56   109428     144816   461   438,73   4232   1 chrome
[...]
```

Z przyzwyczajenia używam możliwie najnowszej składni (PowerShell 5.0). W starszych wersjach wyglądałoby to nieco inaczej:

``` powershell
Get-Process | Where-Object { $_.ProcessName -eq "chrome" }
```

Jako ciekawostę polecam sprawdzić co robi `Out-GridView`.

### Użycie .NET
Do metod `<psobject>` możemy dobrać się na dwa sposoby:

``` powershell
# Bezpośrednio
(Get-Alias).GetType()

# Poprzez przypisanie
$alias = Get-Alias
$alias.GetType()
```

Tworzenie obiektów .NET też trudne nie jest:

``` powershell
$random = New-Object -TypeName System.Random
$random.Next()
# 1168874665 - serio przepisałem to z terminala i zapewniam losowość :D
```

### Przydatne skróty
Na koniec jeszcze o paru wspomagaczach umilających pracę z poshem:

1. `ctrl + space` przy operowaniu z obiektami .NET działa jako autocompleter.
1. `tab` podpowiada parametry i property cmdletów.
1. `f7 lub ↑/↓` historia poleceń (niestety ładny bufor z f7 został usunięty w win10).
1. [PowerShell ISE][6] - mały edytor z kolorowaniem składni i wbudowaną dokumentacją. Dostarczany w zestawie z poshem.
1. `pushd/popd` jako zamiennik `cd`. Pozwala wrócić do poprzedniej lokacji. Można sobie oaliasować np. `cd/dc`.

## Windows "zlinuksiał"?
To pytanie zadane jest raczej w celu humorystycznym, choć Windowsowi w ostatnim czasie przybyło wiele cech, które mogłbyby pomóc w znalezieniu na nie odpowiedzi. Menedżery pakietów [Chocolatey][7] i [OneGet][8] (dostarczany w Win10) będące odpowiednikiem `apt-get` i wiele repozytoriów open-source do złudzenia przypominają ekosystem Linuxa. Dla mnie bomba! Bo czuję się jak ryba w wodzie.

---

1. https://pl.wikipedia.org/wiki/Mandriva_Linux
2. https://pl.wikipedia.org/wiki/Live_CD
3. http://sysios.blogspot.com/2006/02/linux-z-pyty.html
4. http://lilo.alioth.debian.org/
5. http://ekg.chmurka.net/
6. http://www.computerperformance.co.uk/powershell/powershell3_ise.htm
7. https://chocolatey.org/
8. http://www.hanselman.com/blog/AptGetForWindowsOneGetAndChocolateyOnWindows10.aspx

[1]: https://pl.wikipedia.org/wiki/Mandriva_Linux
[2]: https://pl.wikipedia.org/wiki/Live_CD
[3]: http://sysios.blogspot.com/2006/02/linux-z-pyty.html
[4]: http://lilo.alioth.debian.org/
[5]: http://ekg.chmurka.net/
[6]: http://www.computerperformance.co.uk/powershell/powershell3_ise.htm
[7]: https://chocolatey.org/
[8]: http://www.hanselman.com/blog/AptGetForWindowsOneGetAndChocolateyOnWindows10.aspx
