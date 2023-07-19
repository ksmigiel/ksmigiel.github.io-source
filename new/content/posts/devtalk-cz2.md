---
aliases:
  - /2015/11/devtalk-cz2
authorlink: http://ksmigiel.com
authorname: "Krzysztof Śmigiel"
date: 2015-11-18T17:26:38+01:00
title: "Kulisy DevTalka cz. 2"
description: "Czyli s01 audio-technicznym językiem"
excerpt: "Dzisiaj przedstawię proces powstawania odcinka DevTalk'a od strony audio-technicznej. Nie zabraknie obrazków i orientalnych pojęć, więc każdy znajdzie coś dla siebie - nudy nie bedzię."
slug: devtalk-cz2
tags: ["devtalk", "podcast", "audio"]
---

Dzisiaj przedstawię proces powstawania odcinka DevTalk'a od strony audio-technicznej. Nie zabraknie obrazków i orientalnych pojęć, więc każdy znajdzie coś dla siebie - nudy nie bedzię :)

## Przygotowanie projektu
Pierwsze co robię przed przystąpieniem do jakiejkolwiek pracy nad nowym odcinkiem DevTalk'a jest przygotowanie projektu:

- opisuję ścieżki (_ang. tracks_) i koloruję je, żebym wiedział co jest czym.
- synchronizuję - rozkładam je odpowiednio w czasie, odtwarzając przy tym naturalny przebieg rozmowy (rozmowa prowadzona przez Skype, jednakże ścieżki są zgrywane osobno). Do tego dochodzi umieszczenie takich elementów jak **intro**, **outro** i **jingle**.

[![01](/images/devtalk/01.jpg)](/images/devtalk/01.jpg)

## Normalizacja
Teraz następuje bardzo ważny krok nazywany **normalizacją**. Jego wynik będzie wypływał na produkcję przez cały okres pracy, aż po render, dlatego warto poświęcić temu elementowi więcej uwagi.

Normalizacja polega na "unormalnianiu" nagrania w zakresie jego głośności i dynamiki, w odniesieniu do reszty materiału dźwiękowego. Na chwilę obecną nasz projekt składa się z czterech plików i ścieżek, gdzie skala problemu nie jest duża. W przypadku projektów muzycznych, w których skład wchodzą 32+ ścieżki jest to już jednak znaczący problem.

Tak więc naszym celem jest ustandaryzowanie materiału, który dostaliśmy z zewnątrz. Dokonać tego możemy m.in stosując:

- [automatyzację][1] i obwiednie (_ang. envelopes_)
- kompresję sygnału audio

### Automatyzacja
Polega na zmianie w czasie pewnych parametrów sygnału (głośność, panorama lub inny dowolny parametr mapowany z [efektu VST][2]).
Krzywą można dowolnie modelować, co pozwala na precyzyjne manipulowanie wspomnianymi parametrami w przeciwieństwie do kompresji, która działa "automatycznie".

[![02](/images/devtalk/02.jpg)](/images/devtalk/02.jpg)

### Kompresja
Kompresor automatycznie zmniejsza dynamikę fragmentu, którego głośność przekracza ustaloną z góry granicę. Najprostszy kompresor będzie charakteryzował się kilkoma parametrami:

- próg (_ang. treshold_) - czyli poziom, poniżej którego sygnał pozostanie bez zmian, a powyżej zostanie przekształcony w zadany przez nas sposób
- współczynnik kompresji (_ang. ratio_) - określa stosunek pomiędzy sygnałem bazowym a wtórnym
- atak (_ang. attack_) - podawany w milisekundach czas, po którym kompresor powinien się "załączyć"
- uwolnienie (_ang. release_) - podwawany w milisekundach czas, po którym kompresor przestaje działać

![compressor](http://pic002.cnblogs.com/images/2012/381603/2012030610395272.jpg)

Zatem przy użyciu kompresora możemy elementy "wystające", głośniejsze niż reszta, automatycznie zredukować do wspólnego poziomu. Dziać się to może w czasie rzeczywistym, kiedy efekt zostanie wpięty do ścieżki, lub możemy wyrenderować nowy plik z nałożonymi już efektami.

[![04](/images/devtalk/04.jpg)](/images/devtalk/04.jpg)

### Punkt odniesienia
Podczas normalizacji należy monitorować sygnał i sprawdzać, czy poziomy rzeczywiście są już wyrównane i czy nie pojawia się gdzieś tzw. "przester" (czyli przekroczenie magicznej granicy 0dB). Osobiście dbam o to, aby sygnał z każdej ścieżki osobno oscylował w granicach -12dB RMS (jest to jednostka uśredniona) oraz aby "peak", czyli najgłośniejszy element, nie przekraczał -6dB.

[![03](/images/devtalk/03.jpg)](/images/devtalk/03.jpg)

Ciekawych dlaczego 0dB w świecie cyfrowym jest sygnałem maksymalnym zapraszam do poczytania wytłumaczenia na [stackexchange][3].

## Edycja
Następnym krokiem będzie edycja sygnału audio. Mając przygotowany w poprzednich krokach materiał możemy przystąpić do jego edycji. W moim przypadku proces ten wygląda najczęściej w ten sposób:

- odszumienie nagrań (dobrze żeby zrobic to przed kompresją) - używając wtyczki **ReaFir (FFT EQ + Dynamic Processor)** wystarczy pobrać próbkę szumu z sygnału
- equalizacja - za pomocą korektora graficznego zbędne pasma wycinam (high-pass filter), niektóre podbijam, aby końcowo uzyskać spójne i naturalne brzmienie całego mixu (jak i każdej ścieżek z osobna)
- cięcie - usuwanie drobnych pomyłek, przerw, oddechów, mlasknięć itp. itd., czyli pozbywanie się wszystkiego czego nie powinno być w ostatecznej wersji odcinka

## Mastering
Na ten moment odcinek jest już prawie gotowy. Jeśli mix potrzebuje jakichkolwiek zmian, to powinny się one odbywać jedynie w ujęciu globalnym, tj. na ścieżce głównej. Zazwyczaj jest to drobna korekcja EQ, lekka kompresja, raczej nic znaczącego, a jednak :) Ostatnim elementem tego audio-łańcuchu jest **limiter**, który nasz mix wyrówna do ustalonego poziomu bliskiemu ~0dB, aby brzmiał tak samo głośno jak inne audio, podcasty, spotifaje itd. Potem zostaje render do wybranego przez nas formatu i gotowy produkt można publikować i czekać na lajki.

[![05](/images/devtalk/05.jpg)](/images/devtalk/05.jpg)   

---

1. http://doughnutmag.com/tutorials/music-production/daw-automation/
2. https://en.wikipedia.org/wiki/Virtual_Studio_Technology
3. http://sound.stackexchange.com/questions/25529/what-is-0-db-in-digital-audio

[1]: http://doughnutmag.com/tutorials/music-production/daw-automation/
[2]: https://en.wikipedia.org/wiki/Virtual_Studio_Technology
[3]: http://sound.stackexchange.com/questions/25529/what-is-0-db-in-digital-audio
