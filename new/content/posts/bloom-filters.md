---
aliases:
  - /2016/06/bloom-filters
authorlink: http://ksmigiel.com
authorname: Krzysztof Śmigiel
date: 2016-06-11T11:59:09+01:00
description: "Probabilistyczna struktura danych na miarę potrzeb BigData"
excerpt: "Dzisiaj będzie trochę bardziej nisko poziomowo (nie mylić z niższym poziomem posta). Postaram się w przystepny sposób przybliżyć wam czym jest Filtr Blooma i jak można go zaimplementować w JavaScripcie."
slug: bloom-filters
title: "Filtry Blooma"
tags: ["javascript", "bigdata"]
---

Dzisiaj będzie trochę bardziej nisko poziomowo (nie mylić z niższym poziomem posta). Postaram się w przystepny sposób przybliżyć wam czym jest Filtr Blooma i jak można go zaimplementować w JavaScripcie.

## Filtra teorie
Filtr Blooma to struktura danych pozwalająca w sposób szybki i pamięciowo optymalny odpowiedzieć na pytanie, czy dany element znajduje się w zbiorze. Niestety, ponieważ nie ma nic za darmo, za wydajność musimy zapłacić, a zapłatą będzie błąd w jaki struktura może nas wprowadzić. Nie użyłem **probabilistyczna** bez powodu: filtr może stwierdzić jedynie, że elementu **na pewno nie ma**, lub **może jest** w zbiorze. Założenie to prowadzi do wniosków tzw. **false-positive**, czyli że dany element nie istnieje w zadanym zbiorze, a jednak otrzymamy informację o jego prawdopodobnym istnieniu.

### Budowa i parametry filtra
Filtr można opisać mniej więcej tak:

> Filtr Blooma to **tablica** (wektor) _m_-bitów, który ma "przewidywać" istnienie _n_ elementów. Elementy te zostały zakodowane _k_ funkcjami haszującymi.

Dobór tych parametrów wpływa na prawdopodobieństwo wystąpienia błędu (które chcemy minimalizować). [Wikipedia][1] bardzo ładnie przedstawia to od matematycznej strony. Najważniejsze są dwa wzory:

![k](https://wikimedia.org/api/rest_v1/media/math/render/svg/76ffa4de74f3857f41900292d0fc315170cec674)
![m](https://wikimedia.org/api/rest_v1/media/math/render/svg/25b30f6928fac097a6e25aa7b7870a7722b7aea0)

My do teorii aż tak wagi przywiązywać nie będziemy, ale trzeba pamiętać, że przy produkcyjnym użyciu takiej struktury bez wstępnej analizy się nie obejdzie.

### Działanie filtra
Całość sprowadza się do testu, czy dany bit (lub _k_ bitów w przypadku _k > 1_) dla zadanej wartości (np. _x_) jest zapalonych w tablicy. Jeśli choć jeden nie jest - mamy pewność, że element jest nieobecny.

![bloom](https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Bloom_filter.svg/649px-Bloom_filter.svg.png)

### Haszowanie
Orłem z kryptografii nie jestem, ale wyczytałem, że użyte funkcje haszujące powinny być przede wszystkim **niezależne** i o **jednostajnym rozkładzie prawdopodobieństwa**, np. takie jak: [murmur][2] lub [fnv][3]. Zalecam dalszą lekturę w tym zakresie dla zainteresowanych szczegółami.

#### Podwójne haszowanie
Jak i jakich funkcji używać do haszowania? Aby zapewnić prawdopodobieństwo błędu na podobnym poziomie, możemy skorzystać z [**podwójnego haszowania**][5]:

![double hash](https://en.wikipedia.org/api/rest_v1/media/math/render/svg/64111088b311219da1c0bc477bf1d97ee0c42b69)

Będziemy potrzebować wtedy jedynie dwóch funkcji haszujących _h<sub>1</sub>_ i  _h<sub>2</sub>_, _i_ - numer funkcji (nasze k), _T_ (nasze m). (_Przepraszam za zamieszanie z parametrami, ale wzory są żywcem z Wikipedii_).

Myślę, że powoli możemy przejść do kodu i próby zaimplementowania tego wszystkiego, co wyżej opisałem.

## Implementacja
Dla celów edukacyjnych przyjmijmy następujące parametry:

```
k = 1    Jedna funkcja haszująca fnv-1
m = 16   16-bitowa tablica
n = 2    Dwa elementy
```

### fnv-1
Wybrałem tę, bo jest relatywnie prosta w implementacji:

``` js
// Operacje na bitach w JS są 32-bitowe
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
//
// Stałe dla 32-bitów
// http://www.isthe.com/chongo/tech/comp/fnv/index.html#FNV-param
const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

function fnv1(string) {
  let bytes = stringToBytes(string);
  let hash = FNV_OFFSET;

  for (let byte of bytes) {
    hash = hash * FNV_PRIME;
    hash = hash ^ byte;
  }

  return Math.abs(hash);
}
```

### stringToBytes
Powyższa funkcja potrzebuje tablicy bajtów z ciągu znaków. JS nie posiada takiej ładnej funkcji jak chociażby C# `byte[] bytes = encoding.GetBytes(AnyString)`, dlatego musimy napisać coś podobnego. Dla ułatwienia przyjmijmy, że ciąg znaków kodowany jest w ASCII (basic English).

``` js
function stringToBytes(string) {
  let bytes = [];

  for (let char of string) {
    bytes.push(char.charCodeAt(0));
  }
  
  return bytes;
}
```

### BloomFilter
Jak zauważyliście używam składni ES6, o co by iść z duchem czasu. Filtr będzie przyjmował w konstruktorze liczbę bitów oraz funkcje haszujące, których chcemy użyć.

``` js
class BloomFilter {
  constructor (m, k) {
    this.bits = m;
    this.hashFunctions = k;
    this.filter = new Int32Array(m);
  }

  add (value) {
    for (let hash of this.hashFunctions) {
      let hashIndex = hash(value) % this.bits;
      this.filter[hashIndex] = 1;
    }
  }

  check (value) {
    for (let hash of this.hashFunctions) {
      let hashIndex = hash(value) % this.bits;
      if (this.filter[hashIndex] == 0)
        return false;
    }
    return true;
  }
}
```

## Testujemy!
``` js
var bloomFilter = new BloomFilter(16, [ fnv1 ]);

bloomFilter.add('testujemy!');
bloomFilter.add('filtr');

bloomFilter.check('testujemy!');
// true
bloomFilter.check('filtr');
// true
bloomFilter.check('nie ma')
// false
```
Prawdopodobieństwo błędu dla przyjętych parametrów wynosi:
![bloom](https://www4c.wolframalpha.com/Calculate/MSP/MSP772420gih62f6ech2f05000010ahiefh16dba6cd?MSPStoreType=image/gif&s=59)
_p ~= 0.12_

ale przy 10-ciu elementach wzrasta do _p ~= 0.46_, dlatego dobór odpowiednich parametrów jest bardzo ważny.

## Produkcyjne użycia
Z Filtrów Blooma korzystają m.in:

- [Cassandra](http://cassandra.apache.org/)
- [Hadoop](http://hadoop.apache.org/)
- [Google BigTable](https://cloud.google.com/bigtable/)
- [Akamai](https://www.akamai.com/)

---

1. https://en.wikipedia.org/wiki/Bloom_filter
2. https://sites.google.com/site/murmurhash/
3. https://en.wikipedia.org/wiki/Fowler–Noll–Vo_hash_function
4. http://www.isthe.com/chongo/tech/comp/fnv/index.html#FNV-param
5. http://citeseer.ist.psu.edu/viewdoc/download;jsessionid=4060353E67A356EF9528D2C57C064F5A?doi=10.1.1.152.579&rep=rep1&type=pdf

[1]: https://en.wikipedia.org/wiki/Bloom_filter
[2]: https://sites.google.com/site/murmurhash/
[3]: https://en.wikipedia.org/wiki/Fowler–Noll–Vo_hash_function
[5]: http://citeseer.ist.psu.edu/viewdoc/download;jsessionid=4060353E67A356EF9528D2C57C064F5A?doi=10.1.1.152.579&rep=rep1&type=pdf
