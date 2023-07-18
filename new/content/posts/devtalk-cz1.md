---
authorlink: http://ksmigiel.com
authorname: "Krzysztof Śmigiel"
date: 2015-09-25T17:26:38+02:00
title: "Kulisy DevTalka cz. 1"
description: "Czyli s01 behind the scenes"
excerpt: "Tak jak obiecywałem w poprzednim poście - nadszedł moment na podsumowanie ubiegłego roku podcastowego. Z perspektywy czasu żałuję, że nie prowadziłem szczegółowych statystyk (chociażby takich jak sumaryczny czas spędzony w edytorze audio), ale postaram się to jakoś poglądowo wyestymować :)."
slug: devtalk-cz1
tags: ["devtalk", "podcast", "audio"]
---

Tak jak obiecywałem w poprzednim poście - nadszedł moment na podsumowanie ubiegłego roku podcastowego. Z perspektywy czasu żałuję, że nie prowadziłem szczegółowych statystyk (chociażby takich jak sumaryczny czas spędzony w edytorze audio), ale postaram się to jakoś poglądowo wyestymować :).

W części pierwszej opiszę sprzęt z jakiego korzystałem z krótkim opisem co to jest (szczególnie dla czytelników niezaznajomionych z branżą pro-audio).
W części drugiej postaram się krótko, lecz treściwie przedstawić proces produkcji odcinka podcasta (załadowanie ścieżek, wyrównanie poziomów głośności i normalizacja, efekty - (odszumianie, equalizacja, kompresja), edycja, mastering i render).

## Hardware
Zdążyłem się już pochwalić nowym sprzętem, a drugi raz pochwalić się nie zaszkodzi. Jest to typowy sprzęt przeznaczony do _home-recordingu_, co wcale nie musi kojarzyć się z amatorszczyzną. Ze względu na dobre parametry techniczne i stosunkowo dobry stosunek jakości przetworników cyfrowych do ceny, wprawne ucho wyprodukuje płytę CD, udźwiękowienie filmu w żaden sposób nie odbiegające od branżowych standardów (profesjonalnych nagrań).

### Odsłuch
Za odsłuch służą mi monitory bliskiego pola: **M-Audio BX5 D2**.

![M-Audio BX5 D2](http://zapp1.staticworld.net/reviews/graphics/products/uploaded/maudio_bx5_d2s_speaker_system_1147635_g1.jpg)

Są to monitory aktywne i nie potrzebują osobnego wzmacniacza. Studyjne monitory odsłuchowe wyróżnia spośród innego sprzętu audio charakterystyka częstotliwościowa, która w tym wypadku powinna być jak najbardziej liniowa. Pozwala ona na odsłuch w brzmieniu jak najbardziej zbliżonym do rzeczywistego (źródła dźwięku), tj. bez żadnego podbicia basu, wycięcia środka czy "wysokich" górek. Dzięki temu tak przygotowany materiał - na "surowych" głośnikach - powinien zabrzmieć dobrze w dowolnym zestawie Hi-Fi czy iPod'ie. Oczywiście nie jest to jedyny warunek jaki trzeba spełnić aby nasz materiał był "pro", ale o tym za chwilę.

### Interfejs
Na upratego monitory można podłączyć do komputera bez interfejsu (skręcając kable od biedy), ale to właśnie on odgrywa kluczową rolę jeśli chodzi o jakość dźwięku. Porządny przetwornik C/A (cyfrowo-analogowy) pozwala odtwarzać oraz nagrywać muzykę zapisaną w wysokiej [rozdzielczości][1] (np. 24-bit), czyli technicznie zawierającą więcej informacji (bitów) przesłanych/odebranych na sekundę. Jest to nic innego jak próba reprezentacji sygnału analogowego w formie cyfrowej. Przekształcenie to nazywamy [**kwantyzacją**][2].

![quantization](http://documentation.apple.com/en/finalcutpro/usermanual/Art/L01/L0108_BitGraph.png)

Wracając do tematu: do pracy używam interfejsu audio USB: **M-Audio M-Track MKII**.

![m-audio m-track mk2](http://www.muzykaitechnologia.pl/website/var/tmp/image-thumbnails/30101/thumb__auto_793e482fec1c54dd5c5708c057c0e7cc/m-track-mkii--3.jpeg)

Dołączone sterowniki [ASIO][3] umożliwiają uzyskanie niskiej latencji (bliskiej zeru), dzięki czemu opóźnienia między sprzętem <-> oprogramowaniem są prawie całkowicie wyeliminowane.
Intefrejs ten posiada też wysokiej jakości wejścia mikrofonowe i instrumentalne. Daje to nieograniczone możliwości związane z nagrywaniem sygnału dźwiękowego, który potem ma zostać sklejony w całość (w przeciwieństwie do nagrywania na tzw. _"setkę"_, gdzie każdy muzyk zajmuje osobny kanał i cała kapela nagrywa na żywca). Za często z tej możliwości nie korzystam, ponieważ wszystkie potrzebne ścieżki do odcinka czekają na mnie na GDrive. Jak w końcu umebluję pokój po przeprowadzce na to małe studyjko, to może coś nagram i się podzielę :)

## Software
Obecnie na rynku jest masa edytorów audio. Od prostych i darmowych ([Audacity](http://audacityteam.org/)) po bardzo zaawansowane kombajny takie jak: [Pro Tools](http://www.avid.com/US/products/family/pro-tools/), [Cubase](http://www.steinberg.net/en/home.html) czy [Ableton](https://www.ableton.com/), które określane są mianem **DAW** (_ang. Digital Audio Workstation_). Z którego narzędzia korzysta producent, to kwestia budżetu, przyzwyczajenia oraz "religijności" (tak, fan-boy'ie każdej technologii są wszędzie!). Ja po paru próbach (udanych bądź mniej) ostatecznie wybrałem swoje ulubione narzędzie pracy, którym jest [**Reaper**][4].

### Reaper

<div style="text-align: center">
<img src="https://lh3.googleusercontent.com/-mtompVfMRoU/VNgzXSQUQDI/AAAAAAAAQvo/KD7l2ZHJFqM/s256-no/Cockos%2BREAPER.png" />
</div>

Relatywnie tani z potężnymi możliwościami edytor niesamowicie przypadł mi do gustu. Praktycznie podczas każdej edycji odcinka podcasta uczę się czegoś nowego, wymyślam coraz to nowe makra, które automatyzują moją pracę i póki co nie zamieniłbym się na żaden inny edytor :). W następnym poście napiszę o nim więcej.

## Óho

Najważniejszym elementem jakiegokolwiek studia jest **ucho** (a nawet dwa). Bez zmysłu muzycznego (i oczywiście sprawnego ucha), nawet z pomocą najlepszego sprzętu i najdroższego programu nie będziemy w stanie dorównać poziomowi profesjonalnym nagrań. W tym wypadku jak w każdej innej branży, a szczególnie naszej - programistycznej - tylko ciężka praca i ciągła praktyka przyniesie wymierne efekty, bo narzędzia to tylko narzędzia.
A ja ciąglę praktykuję i mam nadzieję, że z przyjemnością słucha wam się każdego odcinka [DevTalk'a][5] :)

---

1. https://en.wikipedia.org/wiki/Audio_bit_depth
2. http://livesound.pl/tutoriale/kursy/4011-technika-cyfrowa-przetwarzanie-analogowo-cyfrowe-kwantowanie
3. https://en.wikipedia.org/wiki/Audio_Stream_Input/Output
4. http://www.reaper.fm/
5. http://www.devtalk.pl

[1]: https://en.wikipedia.org/wiki/Audio_bit_depth
[2]: http://livesound.pl/tutoriale/kursy/4011-technika-cyfrowa-przetwarzanie-analogowo-cyfrowe-kwantowanie
[3]: https://en.wikipedia.org/wiki/Audio_Stream_Input/Output
[4]: http://www.reaper.fm/
[5]: http://www.devtalk.pl
