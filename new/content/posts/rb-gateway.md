---
aliases:
  - /2016/02/rb-gateway
authorlink: http://ksmigiel.com
authorname: Krzysztof Śmigiel
date: 2016-02-26T21:59:09+01:00
description: "Stąpanie po open sourcowej ziemi"
excerpt: "Zawsze zastanawiałem się jak to jest, że ci wszyscy programiści open source znajdują czas na pisanie kodu po pracy. Kod open source kojarzył mi się jednoznacznie z czymś darmowym, charytatywnym. Było dla mnie dużym zaskoczeniem, gdy dowiedziałem się o programistach opłacanych m.in przez Red Hat i uświadomiłem wtedy sobie, że otwartość kodu wcale nie sugeruje amatorskiego poziomu. Było to dawno temu, ale ten moment olśnienia pamiętam do dziś."
slug: rb-gateway
title: "Jak naprawiłem rb-gateway"
tags: ["opensource", "golang", "reviewboard"]
---

Zawsze zastanawiałem się jak to jest, że ci wszyscy programiści **open source** znajdują czas na pisanie kodu po pracy. Kod open source kojarzył mi się jednoznacznie z czymś darmowym, charytatywnym. Było dla mnie dużym zaskoczeniem, gdy dowiedziałem się o programistach opłacanych m.in przez **Red Hat** i uświadomiłem wtedy sobie, że otwartość kodu wcale nie sugeruje amatorskiego poziomu. Było to dawno temu, ale ten moment _"olśnienia"_ pamiętam do dziś.

## Open source
Jeszcze zanim zacząłem pracować, idea przynależności do projektu programistycznego, takiego z prawdziwego zdarzenia, była czymś ekscytującym. Tworzenie narzędzia używanego przez tysiące osób, dojrzały codebase z testami, dobrymi praktykami i nienaganną architekturą - nic tylko kodzić. Jednak pomimo wielu prób nie udało mi się nigdy znaleźć jednego, konkretnego projektu, z którym mógłbym się utożsamiać jako "współtwórca". Repozytoriów / projektów jest ile bądź i chyba ze względu na ich zróżnicowanie (język, poziom abstrakcji, community) wybór nie należy do łatwych.

### Kontrybucja
Do open source można też podejść z innej strony: zawężając zakres poszukiwań do projektów, z których obecnie korzystamy (lub korzystaliśmy). Daje nam to pewną przewagę, gdyż mamy pojęcie co dana biblioteka lub framework robi i jak jej używać. Oprócz tego często w bug-trackerach natrafić można na tzw. **low hanging fruits**, czyli proste zadania dla każdego. Istnieje nawet [platforma][1] będąca agregatorem takich właśnie tasków. Kto jest bardziej ambitny niech od razu łapie się za konkrety idąc za śladem [tego pana][2] - lenistwo po święcie dziękczynienia najlepszym motorem do pracy! To co jednak zmotywuje do _"zakontrybutowania"_ każdego, to możliwość naprawienia znalezionego błędu w używanej przez siebie bibliotece i o tym krótko dziś napiszę.

## Moja cegiełka w rb-gateway
Wspieranie lokalnych repozytoriów w [ReviewBoardzie][4] jest mocno ograniczone. Chcąc korzystać ze wszystkich jego funkcjonalności konieczne jest skorzystanie z narzędzia zwanego **rb-gateway**.  [rb-gateway][3] jest to proxy między repozytorium gita, a ReviewBoardem - prosty serwer HTTP pełniący funkcję API, napisany w [go][5]. Nie znalazłem do niego żadnych binarek, co za tym idzie, musiałem skompilować go samodzielnie, jednocześnie ucząc się języka z którego nigdy wcześniej nie korzystałem. Jeśli myślicie, że parę poniższych komend zaczerpniętych z oficjalnej dokumentacji było wystarczające do uruchomienia _"tego czegoś"_, to grubo się mylicie!

``` bash
$ go get -d github.com/reviewboard/rb-gateway
$ cd github.com/reviewboard/rb-gateway
$ mv sample_config.json config.json
$ go get
$ go install
```

Największą przeszkodą jaką napotkałem podczas próby zbudowania rb-gateway'a była jego zależność: `git2go` i siedzący pod spodem `libgit` wymagany w wersji **0.22**, a w [repozytorium CentOS][6] ostatnia wersja to **0.21**. Co więc musiałem zrobić? Zbudować libgit v0.22 ze źródeł. Na szczęście [wszystko jest opisane][7] i o dziwo nie napotkałem żadnych problemów. Potem przyszedł czas na konfigurację i testy, które bardzo szybko znalazły pewną nieprawidłowość w działaniu rb-gateway'a.

### Gdzie są diffy!
Po stworzeniu nowego _review requesta_ załączał się tylko jeden plik z diffa. W początkowej fazie myślałem, że wynika to z jakichś problemów funkcjonalnych biblioteki libgit, bo jakby nie było, to ciężko w 100% wierzyć w coś, co zostało zbudowane dosłownie przez przypadek (kompletnie się na tym nie znam). Po chwili poszukiwań natrafiłem na winowajcę - rb-gateway. To ta warstwa zwracała zły JSON, co wskazywało na problemy z przygotowywaniem / parsowaniem diffa. Specem od debugowania `go` nie jestem, jednak idąc jak po sznurku znalazłem metodę `GetCommit(commitId string)` w pliku `git_repository.go`. Posiadała błędną implementację, w zły sposób korzystającą z C API libgita. Co jest śmieszne, testy jednostkowe przechodziły bez problemów, bo uwaga: testowały przypadek generowania diffa tylko z jednego pliku własnie!

Fix okazał się banalny (jak wszystko, co na początku jest niewyobrażalnie trudne, a po zrozumieniu staje się dziecinnie proste). Autor przez pomyłkę wywoływał metodę `Patch(0)` zawsze otrzymując pierwszy element kolekcji, w tym wypadku pierwszy plik. Po zapętleniu kawałka kodu wszystko wróciło do normy.

``` go
var buffer bytes.Buffer

if deltas > 0 {
    for i := 0; i < deltas; i++ {
        patch, err := gitDiff.Patch(i)
        if err != nil {
            return nil, err
        }

        patchString, err := patch.String()
        if err != nil {
            return nil, err
        }

        buffer.WriteString(patchString)

        patch.Free()
    }
    diff = buffer.String()
}
```

Dopisałem test, który sprawdzał przypadek, gdy commit zawierał więcej niż jeden plik i pokusiłem się o **pull requesta**, który został bez problemu [zaakceptowany][8].

## Jestem osobą wnoszącą wkład?
Chyba tak (śmiesznie Google tłumaczy słowo  _constributor_). Nie odczuwam, abym poprawiając ten kawałek kodu zbawił świat, ale świadomość, że udało się po prostu coś naprawić, zgłębić temat, nauczyć się podstaw języka go, zbudować low-level bibliotekę C, podnosząc jakość oprogramowania krążącego wokół nas i równocześnie pomagając przy tym innym - świadomość ta podnosi na duchu. Bez zawahania twierdzę, że było warto i chcę jeszcze więcej!

---

1. http://up-for-grabs.net/
2. http://davidvgalbraith.com/how-i-fixed-node-js/
3. https://github.com/reviewboard/rb-gateway/
4. http://reviewboard.org/
5. https://tour.golang.org/welcome/1
6. https://fedoraproject.org/wiki/EPEL
7. https://github.com/libgit2/libgit2
8. https://reviews.reviewboard.org/r/7958/

[1]: http://up-for-grabs.net/
[2]: http://davidvgalbraith.com/how-i-fixed-node-js/
[3]: https://github.com/reviewboard/rb-gateway/
[4]: http://reviewboard.org/
[5]: https://tour.golang.org/welcome/1
[6]: https://fedoraproject.org/wiki/EPEL
[7]: https://github.com/libgit2/libgit2
[8]: https://reviews.reviewboard.org/r/7958/

