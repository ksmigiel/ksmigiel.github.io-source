---
authorlink: http://ksmigiel.com
authorname: Krzysztof Śmigiel
date: 2016-03-30T21:59:09+01:00
description: "Jak zrozumieć 'this' i już nigdy więcej nie mieć z tym problemu"
excerpt: "Słówko 'this', mimo podobieństwa do C# czy Javy, w JavaScripcie działa trochę inaczej niż nam się może wydawać. Kontekst na jaki wskazuje 'this' może być dowolnie zmieniany, a jego nieumiejętne użycie będzie powodować masę błędów w naszej aplikacji."
slug: js-this
title: "Kontekst i 'this' w JavaScripcie"
tags: ["javascript", "webdev"]
---

Słówko `this`, mimo podobieństwa do C# czy Javy, w JavaScripcie działa trochę inaczej niż nam się może wydawać. Kontekst na jaki wskazuje _this_ może być dowolnie zmieniany, a jego nieumiejętne użycie spowodowuje wystąpienie masy błędów w naszej aplikacji. Ustrzec przed nimi można się jedynie rozumiejąc do czego owe _this_ służy i jak się z nim obchodzić. Zapraszam do lektury :)

## Implicit binding
Mamy tutaj do czynienia z kontekstem zwykłych obiektów. Złota zasada w identyfikacji kontekstu to:

> **this** to obiekt, który jest po lewej stronie kropki.

W myśl powyższej zasady możemy stwierdzić, że kontekstem funkcji `meow()` będzie obiekt `cat` i tak też się dzieje.

``` js
var cat = {
  name: 'Filemon',
  meow: function () {
    console.log(this.name);
  }
}

cat.meow();
// Filemon
```

Podobnie sprawa ma się w przypadku zagdnieżdżonych obiektów i ich funkcji. Najbliższy obiekt po lewej stronie (z reguły, ale o tym zaraz) jest kontekstem, w jakim zostaje wywołana dana funkcja:

``` js
var cat = {
  name: 'Filemon',
  brother: {
    name: 'Mruczek',
    meow: function () {
      console.log(this.name)
    }
  },
  meow: function () {
    console.log(this.name);
  }
}

cat.meow();
// Filemon

cat.brother.meow();
// Mruczek
```

Trzeba być bardzo ostrożnym jeśli chodzi o referencje do obiektów czy funkcji, gdyż takie przypisanie również powoduje zmianę kontekstu. Jest nim nadal _cat (Filemon)_, a nie jakby można było sądzić _brother (Mruczek)_.

``` js
cat.meow = cat.brother.meow;
cat.meow();
// Filemon
```

Istnieją jednak sposoby na całkowie przejęcie kontroli nad tym co ma być w danej chwili "bazą".

## Explicit binding
Oprócz operowania obiektami i zasadą "kropki" istnieją inne metody (pewne 3 funkcje), które pozwalają na zmianę kontekstu wywołania dowolnej funkcji.

### call()
Pozwala na wywołanie funkcji z konkretnym kontekstem przekazanym jako argument.

``` js
var meow = function () {
  console.log('I am a cat ' + this.name);
};

var filemon = {
  name: 'Filemon'
};

var mruczek = {
  name: 'Mruczek'
};

meow.call(filemon);
// I am a cat Filemon

meow.call(mruczek);
// I am a cat Mruczek

```

### bind()
Jest to bardzo podobna funkcja do `call()` z tą różnicą, że pozwala na "przechowanie" funkcji z nowym kontekstem w postaci zmiennej, aby móc ją na przykład przekazać dalej jako parametr funkcji.

``` js
var meow = function () {
  console.log('I am a cat ' + this.name);
};

var filemon = {
  name: 'Filemon'
};

var mruczek = {
  name: 'Mruczek'
};

var filemonMeow = meow.bind(filemon);
filemonMeow();
// I am a cat Filemon

var mruczekMeow = meow.bind(mruczek);
mruczekMeow()
// I am a cat Mruczek

```

### apply()
To taki helper składający tablicę w argumenty funkcji, który również jako parametr przyjmuje nowy obiekt, a ten stanie się _this_ w tej właśnie funkcji.

``` js
var myCats = function (cat1, cat2) {
  console.log('I am ' + this.name + ' and my cats are: ' + cat1 + ' and ' + cat2);
};

var me = {
  name: 'Krzysztof'
};

var cats = ['Filemon', 'Mruczek'];

myCats.apply(me, cats);
// I am Krzysztof and my cats are: Filemon and Mruczek
```

## New binding
Dochodzimy w końcu do momentu, z którym większość będzie najbardziej zaznajomiona, czyli konstruktory i keyword `new`. Sytuacja jest tu o tyle prosta, że to _new_ nadaje kontekst całego obiektu podczas jego tworzenia.

``` js
function Cat(name, color) {
  this.name = name;
  this.color = color;
  this.sayHello = function () {
    console.log('Hi, I am ' + name + ' colored ' + color);
  };
}

var filemon = new Cat('Filemon', 'black');
filemon.sayHello();
// Hi, I am Filemon colored black
```

Zwróćcie uwagę na **brak** _this_ w wywołaniu funkcji `sayHello()`. W każdym wypadku jego użycie jest opcjonalne. Domyślnie interpreter zawsze będzie wywoływał funkcję w kontekście rozwiązanym zgodnie z zasadami, które tu dzisiaj opisałem. Dla czytelności jednak lepiej jest użyć kontekstu, aby czarno na biało było widać co z czego jest wywoływane.
Spójrzcie na przykład bardziej zawiły, gdzie gdyby nie osobna referencja do obiektu macierzystego, odwołanie się do jego własności byłoby niemożliwe.

``` js
function Cat(name, color) {
  var self = this;
  
  self.name = name;
  self.color = color;
  self.sayHello = function () {
    console.log('Hi, I am ' + self.name + ' colored ' + self.color);
  };
  
  self.brother = {
    name: 'Mruczek',
    sayHello: function () {
      console.log('Hi, I am ' + this.name + ' and my brother is ' + self.name);
    }
  };
}

var filemon = new Cat('Filemon', 'black');
filemon.sayHello();
// Hi, I am Filemon colored black

filemon.brother.sayHello()
// Hi, I am Mruczek and my brother is Filemon
```

### window binding
Wyżej napisałem o tym, że pominięcie _this_ spowoduje automatyczne "dopięcie" odpowiedniego kontekstu. Jednak gdy funkcja wywołana jest globalnie, to (przynajmniej w przeglądarkach) jej kontekstem będzie obiekt `window`.

``` js
function openWindow() {
  console.log(this);
};

openWindow();
// Window {external: Object, chrome: Object, document: ...}
```

Jednak jeśli popełnimy pewien błąd, którego konsekwencje zostały opatrzone stosownym błędem w konsoli w ECMAScript 5 ('strict' mode, w ECMAScript 3 _this_ wskazywał na _window_, stąd to całe zamieszanie), polegający na wywołaniu konstruktora funkcji bez użycia _new_, to otrzymamy błąd.

``` js
function someConstructor() {
  this.a = 'foo';
  this.b = 'bar';
}

var good = new someConstructor();
var bad = someConstructor();
// "TypeError: this is undefined"
```

## this czy nie this - o to jest pytanie!
Mam nadzieję, że szybki kurs z kontekstu w JS tutaj przedstawiony pomógł wam choć trochę nabrać pewności w używaniu _this_ z głową w swoich aplikacjach. Jeśli macie jakieś pytania czy uwagi z chęcią na nie odpowiem, w komentarzach czy mail/twitter.