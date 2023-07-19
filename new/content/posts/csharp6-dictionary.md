---
aliases:
  - /2017/04/csharp6-dictionary
authorlink: http://ksmigiel.com
authorname: Krzysztof Śmigiel
date: 2017-04-05T20:13:09+00:00
description: "Oraz dziwne zachowanie razem z List<T>"
excerpt: "Chciałem po krótce zaprezentować błąd (albo feature?) C# związany z dodanym w wersji 6 inicjalizatorem słownika. Jest to o tyle ciekawa kwestia, że nie ustrzeże nas przed tym błędem ani statyczna analiza kodu, ani kompilacja - dopiero runtime rzuci w nas wyjątkiem!."
slug: csharp6-dictionary
title: "[AKTUALIZACJA] Inicjalizacja Dictionary<TKey, TValue> w C# 6"
tags: ["csharp", "bug"]
---

## AKTUALIZACJA 17.06.2017
Jak się okazuje _"it's not a bug, it's a feature!"_. Dokładnie takie zachowanie, jak opisanie w poście, jest zawarte w [specyfikacji języka](https://github.com/dotnet/roslyn/issues/18475#issuecomment-309168670).

> A member initializer that specifies a collection initializer after the equals sign is an initialization of an embedded collection. Instead of assigning a new collection to the target field, property or indexer, the elements given in the initializer are added to the collection referenced by the target. The target must be of a collection type that satisfies the requirements specified in §7.6.11.3.

Wypada następnym razem zejść jeszcze niżej niż do IL i grzebać w specyfikacji :) Fajnie, że ktoś na te zgłoszenia w ogóle patrzy i liczy się ze środowiskiem open source - tutaj duży plus dla Microsoftu!

---

Chciałem po krótce zaprezentować błąd (albo feature?) C# związany z dodanym w wersji 6 **inicjalizatorem słownika**. Jest to o tyle ciekawa kwestia, że nie ustrzeże nas przed tym błędem ani statyczna analiza kodu, ani kompilacja - dopiero 
_runtime_ rzuci w nas wyjątkiem!. 

## Dictionary initializers
Zapewne znana jest wam składnia pozwalająca na stworzenie słownika `Dictionary<TKey, TValue>` razem z wartościami:

``` csharp
var dictionary = new Dictionary<int, List<int>>
{
	{ 0, new List<int> { 0, 1, 2 } },
	{ 1, new List<int> { 1, 2, 3 } },
	{ 2, new List<int> { 2, 3, 4 } }
};
```

C# 6 wprowadził mały _syntactic sugar_ odnośnie tworzenia słowników i powyższy kod możemy zapisać następująco:

``` csharp
var dictionary = new Dictionary<int, List<int>>
{
	[0] = new List<int> { 0, 1, 2 },
	[1] = new List<int> { 1, 2, 3 },
	[2] = new List<int> { 2, 3, 4 }
};
```

Nie jest to oczywiście zmiana funkcjonalna, lecz conajwyżej poprawiająca czytelność kodu.

## Mały błąd - ciekawe odkrycie
Jakiś czas temu pisząc kod chciałem na szybko użyć dokładnie takiej samej struktury danych jak wyżej, jednak omyłkowo stworzyłem takiego potwora:

``` csharp
var test = new Dictionary<int, List<int>>
{
	[0] = { 0, 1, 2 },
	[1] = { 1, 2, 3 },
	[2] = { 2, 3, 4 }
};
```

Jak widzicie zapomniałem użyć **new** razem **inicjalizatorem listy**. Kod się skompilował, Visual Studio i ReSharper nie miał nic do powiedzenia, po czym w trakcie wykonywania kodu otrzymałem wyjątek `KeyNotFoundException: The given key was not present in the dictionary`.

Wygląda więc na to, że

- składnia jest poprawna
- kod jest kompilowalny
- .NET próbuje coś wyciągnąć ze słownika, ale niestety bezskutecznie

Zaciekawiony tym co się dzieje pod maską postanowiłem spojrzeć na **IL**, który generują obydwa (poprawny i ten mniej poprawny) przykłady, aby dowiedzieć się do czego tak naprawdę został skompilowany ten błędny kod.

## Analiza IL - feels like a hacker!
Rzadko mam okazję analizować _IL_ czy _asm x86_, ale jak już się taka okazja nadarzy, to sama przyjemność patrzeć na te bebechy :)
Weźmy na tapetę jako pierwszy poprawny przykład kodu (powycinałem z _IL'a_ niepotrzebne rzeczy, co by się wszystko mogło zmieścić w poście).

#### IL - poprawny
```
var dictionary = new Dictionary<int, List<int>>
{
    [0] = new List<int> { 1 }
}

// Stwórz nową instancję Dictionary<int, List<int>> i wrzuć referencję na stos
// stos: ref Dictionary
IL_0001: newobj       instance void class Dictionary`2<int32, class List`1<int32>>::.ctor()
// Duplikuj referencję i wrzuć na stos
// stos: ref Dictionary, ref Dictionary
IL_0006: dup          
// Wrzuć na stos int32 o wartości 0
// stos: ref Dictionary, ref Dictionary, 0
IL_0007: ldc.i4.0     
// Stwórz nową instancję List<int> i wrzuć referencję na stos
// stos: ref Dictionary, ref Dictionary, 0, ref List
IL_0008: newobj       instance void class List`1<int32>::.ctor()
// Duplikuj referencję i wrzuć na stos
// stos: ref Dictionary, ref Dictionary, 0, ref List, ref List
IL_000d: dup          
// Wrzuć na stos int32 o wartości 1
// stos: ref Dictionary, ref Dictionary, 0, ref List, ref List, 1
IL_000e: ldc.i4.1     
// Wołaj metodę Add() na List<int>
// stos: ref Dictionary, ref Dictionary, 0, ref List
IL_000f: callvirt     instance void class List`1<int32>::Add(!0/*int32*/)
// Wołaj metodę set_Item na Dictionary<int, List<int>>
// stos: ref Dictionary
IL_0015: callvirt     instance void class Dictionary`2<int32, class List`1<int32>>::set_Item(!0, !1)
// Zapisz referencję do zmiennej lokalnej
// stos: [pusty]
IL_001b: stloc.0      
```

Nic podejrzanego, wszystko przebiega zgodnie z planem. Dla tych, którzy nie mają zielonego pojęcia co się wydarzyło polecam zaznajomić się z _intermidiate language_ i jego naturą "stosową" (_stack-based_).

Popatrzmy teraz na kod, który nas bardziej ciekawi:

#### IL - mniej poprawny
```
var dictionary = new Dictionary<int, List<int>>
{
    [0] = { 1 }
}

// Stwórz nową instancję Dictionary<int, List<int>> i wrzuć referencję na stos
// stos: ref Dictionary
IL_0001: newobj       instance void class Dictionary`2<int32, class List`1<int32>>::.ctor()
// Duplikuj referencję i wrzuć na stos
// stos: ref Dictionary, ref Dictionary
IL_0006: dup          
// Wrzuć na stos int32 o wartości 0
// stos: ref Dictionary, ref Dictionary, 0
IL_0007: ldc.i4.0     
// Zawołaj get_Item() na stworzonej instancji słownika i wrzuć referencję listy na stos
// stos: ref Dictionary, ref List
// Tutaj rzuca wyjątek, że nic pod kluczem "0" nie istnieje
IL_0008: callvirt     instance !1 class Dictionary`2<int32, class List`1<int32>>::get_Item(!0)
// Wrzuć na stos int32 o wartości 1
// stos: ref Dictionary, ref List, 1
IL_000d: ldc.i4.1     
// Zawołaj Add() na List<int>
// stos: ref Dictionary
IL_000e: callvirt     instance void class List`1<int32>::Add(!0)
// Zapisz referencję do zmiennej lokalnej
// stos" [pusty]
IL_0014: stloc.0      
```

Jak widzicie instrukcja `IL_0008` próbuje otrzymać referencję do listy (nie została stworzona prawdopodobnie przez brak `new List<int>`). Idąc dalej tym tokiem myślenia wydaje się całkowicie sensowne (i absurdalne zarazem), aby spreparować kod, gdzie będziemy mieli już istniejącą listę (czyli nie rzuci wyjątkiem), co powinno skutkować dodaniem nowego elementu za pomocą zepsutego inicjalizatora - kod zepsutego celowo inicjalizatora kompiluje się jako operacja `Add()`.

Odpalcie zatem u siebie coś takiego i niech się teraz panowie z Microsoftu tłumaczą:

``` csharp
var dictionary = new Dictionary<int, List<int>>
{
    [0] = new List<int>{ 1 },
    [0] = { 2 }
};

Console.WriteLine(test[0].Count);
// 2
```

Właśnie udało nam się pokracznie dodać element do istniejącej już listy :D.

## Co dalej?
Postanowiłem zgłosić błąd na GitHub'ie Roslyn'a (https://github.com/dotnet/roslyn/issues/18475) i zaczekać na odpowiedź. Może się okazać, że jest to _feature_, nie _bug_ i jestem bardzo ciekawy czy tego typu problem był już przerabiany wcześniej.

PS. Pozdrawiam Dawida, który dzielnie walczył ze mną nad rozbrojeniem tej bomby!

