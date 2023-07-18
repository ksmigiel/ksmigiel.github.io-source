---
authorlink: http://ksmigiel.com
authorname: "Krzysztof Śmigiel"
date: 2015-05-23T18:18:10+02:00
title: "TypeScript i pliki definicji"
description: "Jak używać, jak tworzyć."
excerpt: "Dzisiaj chciałem przybliżyć kwestię plików definicji do TypeScript. Jeśli zdarzyło wam się pracować z tym językiem, to na pewno wiecie o czym mówię. Jeśli natomiast nie macie pojęcia co to jest - zapraszam do lektury!"
slug: jsblocks-dts
tags: ["TypeScript", "webdev"]
---

Dzisiaj chciałem przybliżyć kwestię plików definicji do TypeScript. Jeśli zdarzyło wam się pracować z tym językiem, to na pewno wiecie o czym mówię. Jeśli natomiast nie macie pojęcia co to jest - zapraszam do lektury!

## TypeScript - typowany JavaScript
[TypeScript][1] to język kompilowany do JS'a prosto od Microsoftu. W wielkim skrócie pozwala na definiowanie typów dla zmiennych, co za tym idzie, deklarowanie klas i interfejsów. Chyba nie trzeba tłumaczyć jakim ułatwieniem staje się taka możliwość w pracy każdego programisty, dla którego środowisko "js'owe" nie jest codziennością, a przychodzi ze świata "mocno typowanego" (C#, Java, cpp).

Tworząc tego typu rozwiązanie Microsoft bardzo elegancko zachęca programistów C# do spróbowania swoich sił w tworzeniu aplikacji przy użyciu całego js-stack. Dzięki podobieństwom w składni i modelu OOP (w przeciwieństwie do klasycznego prototypowania w JavaScript) bardzo szybko można zacząć pisać pierwsze sensowne linie kodu, bez potrzeby spędzenia godzin na nauce składni etc. Oczywiście znajomość JS mile widziana, wręcz wskazana. Spójrzcie na różnice w TS <-> JS na przykładzie kompilacji z oficjalnej strony:

``` typescript
// test.ts
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}
```

``` js
// test.js
var Greeter = (function () {
    function Greeter(message) {
        this.greeting = message;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    return Greeter;
})();
```

Powyższy kod jest chyba samowyjaśniającysię. Ta śmieszna funkcja w funkcji wywołana natychmiast to tzw. [IIFE][2]. Popularny wzorzec, must-known.

TypeScript jest na tyle dojrzały, że nawet Google wraz z jego [Angular 2.0][3] postanowili wprowadzić natywne wsparcie dla niego!

## Definitywnie typowany!
Zastanawiacie się zapewne w jaki sposób można użyć TypeScript'a z istniejącymi już bibliotekami takimi jak: angular, knockout, backbone itd. Otóż istnieje **[repozytorium][4]** definicji do przeróżnych frameworków tworzone przez społeczność open source. Sam chcąc bliżej poznać TS postanowiłem udzielić się i puściłem pull requesta z definicjami do [blocks][5]. **blocks** to jeden z wielu frameworków _MV*_ (dzień bez nowego frameworka js to dzień stracony) jednak zainteresował mnie ze względu na swoją prostotę i połączenie knockout+backbone (observable i modele).

## blocks.d.ts
Deklaracja typów do istniejącego już kodu odbywa się za pomocą [Ambient External Modules][6]

``` typescript
declare var blocks: BlocksStatic;

declare module "blocks" {
    export = blocks;
}
```

Deklarując moduł w cudzysłowie "nadpisujemy" oryginalny moduł zaimportowany w pliku z aplikacją:

``` typescript
/// <reference path="blocks.d.ts" />
import blocks = require('blocks');
```

Jest to całkiem dobra pozycja wyjściowa do otypowania dowolnej biblioteki. Przekonacie się, że całkiem pokaźna ilość bibliotek została już przetłumaczona na TS przeglądając wspomniane wyżej repozytorium.

TS automagicznie scala oryginalną bibliotekę z naszą definicją typów. Od teraz mamy piękny IntelliSense podpowiadający składnię, parametry funkcji i jej zwracaną wartość (patrz [jsdoc][7]) oraz sprawdzanie składni w locie - wszystko prawie jak w C#!

Na moim [githubie][8] znajdziecie źrodła całego pliku definicji. Dokumentacja pochodzi oczywiście z oficjalnej strony autora. Co jak co, ale ta aktywność związana z opisywaniem typów nauczyła mnie TypeScript'a i jego zawiłości szybciej i przyjemniej niż nie jedna książka :)

---

1. http://www.typescriptlang.org/
2. http://en.wikipedia.org/wiki/Immediately-invoked_function_expression
3. https://angular.io/
4. https://github.com/borisyankov/DefinitelyTyped
5. http://jsblocks.com/
6. http://www.typescriptlang.org/Handbook#modules-working-with-other-javascript-libraries
7. http://usejsdoc.org/
8. https://github.com/ksmigiel/DefinitelyTyped/tree/master/blocks


[1]: http://www.typescriptlang.org/
[2]: http://en.wikipedia.org/wiki/Immediately-invoked_function_expression
[3]: https://angular.io/
[4]: https://github.com/borisyankov/DefinitelyTyped
[5]: http://jsblocks.com/
[6]: http://www.typescriptlang.org/Handbook#modules-working-with-other-javascript-libraries
[7]: http://usejsdoc.org/
[8]: https://github.com/ksmigiel/DefinitelyTyped/tree/master/blocks
