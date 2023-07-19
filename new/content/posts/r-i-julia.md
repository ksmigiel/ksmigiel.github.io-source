---
aliases:
  - /2015/03/romeo-i-julia
authorlink: http://ksmigiel.com
authorname: "Krzysztof Śmigiel"
date: 2015-03-21T21:38:00+01:00
title: "\"R\"omeo i Julia"
description: "Historia miłości analitycznej..."
excerpt: "Każdy wie, że Excel to potężne narzędzie i odpowiednio użyte potrafi wspomóc niejeden proces. Wykorzystywany namiętnie w korporacjach do analizy danych i oglądania filmów (tak tak, pewien użytkownik reddita..."
slug: romeo-i-julia
tags: ["R", "Julia"]
---

Każdy wie, że Excel to potężne narzędzie i odpowiednio użyte potrafi wspomóc niejeden proces. Wykorzystywany namiętnie w korporacjach do analizy danych i oglądania filmów (tak tak, pewien użytkownik reddita świetnie ominął wszelkie zabezpieczenia i wykorzystując klasyczne **Windows API** - metodę `mciSendStringA` w **winmm.dll** - napisał player w VBA[^1]!). Niestety większość arkuszy to prawdziwe potwory, które potrafią śnić się po nocach: przedziwne zagnieżdżone formuły, pstrokate kolorki. Nie da się tym w żaden sposób zarządzać. Niedebugowalne, nietestowalne i niekontrolowersjowalne. Oczywiście dopiero od pewnego stopnia.

## R na R-atunek!
Jeśli ktoś nie słyszał o pakiecie **R**, to koniecznie musi zerknąć na to coś.[^2] R jest równocześnie językiem programowania i środowiskiem przeznaczonym do obliczeń statystycznych i wizualizacji. Istnieje bardzo duże prawdopodobieństwo, że jeśli potrzebujesz obliczyć jakąś skomplikowaną statystykę, przeprowadzić test na zbiorze danych, dopasować rozkład, wyestymować cokolwiek i ładnie to zaprezentować na wykresach, to jak egzotycznej metody byś nie wybrał ktoś na pewno stworzył taki pakiet i udostępnił go na stronach **CRAN**[^3] - repozytorium pakietów R (co prawda strona nie zachęca i wygląda jakby czas stanął w miejscu od 1997 roku, ale to tylko złudzenie). Projekt jest bardzo aktywny i jest to jedno z najpopularniejszych narzędzi do analizy danych w tym momencie.

Pomimo imponującej bazy pakietów, R nie jest idealny. Składnia tego języka dla programisty jest po prostu dziwna i nieintuicyjna. Może dlatego, że został on stworzony z myślą o ułatwieniu pracy statystykom i analitykom. Jego wydajność również nie powala. Jednak świetnie sprawdza się jako narzędzie "analizy wstępnej", a skomplikowane obliczenia lepiej wykonywać w innym środowisku (np. Pythonie).

## I ♥ Julia
**Julia**[^4] to powiew świeżości w świecie statystycznego R i szybkiego Pythona. Relatywnie młody język (pojawił się w 2012 roku), który chciałby je zastąpić w wszelkiej maści aplikacjach i obliczeniach naukowych. Można go opisać w skrócie:

 - **szybki** jak C/Fortran
 - **elegancki** jak Python

Community szybko zaczęło tworzyć nowe biblioteki i pomimo braku wersji finalnej (w momencie pisania 0.3.6) można próbować swoich sił w tworzeniu aplikacji lub rozwijaniu ekosystemu. Osobiście nie zalecałbym używania Julii na produkcji, bo do wersji 1.0 zapewne całkowicie się zmieni, ale do odważnych świat należy :) Julia nie jest projektem dojrzałym, aczkolwiek śledząc jego rozwój można twierdzić, że rokuje całkiem nieźle. 
Młoda, ładna, szybka i atrakcyjna - po prostu **sexy**! Zresztą sami zobaczcie co potrafi:

![gif][gif]

Zainteresowanym polecam ciekawe IDE[^5], którego ficzery widać powyżej.
Możliwość wykonywania kodu w locie to mój faworyt! Fajnie byłoby móc nazwać siebie *Julia Programmer*, więc jak nabardziej kibicuję Julii.

## Gdzie ta historia miłosna?
Nie ma. Jak na razie nasz "R"omeo i Julia żyją i mają się dobrze. Byleby tylko nie skończyło się jak u Szekspira...

[gif]:/images/julia.gif
[^1]: http://www.reddit.com/r/excel/comments/2jtd2f/worked_on_a_completely_locked_down_machine_time/
[^2]:http://www.r-project.org/
[^3]:http://cran.r-project.org/mirrors.html
[^4]:http://julialang.org/
[^5]:http://junolab.org/
