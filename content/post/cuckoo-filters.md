---
authorlink: http://ksmigiel.com
authorname: Krzysztof Śmigiel
date: 2017-01-24T18:59:09+01:00
description: "Bloom na sterydach, czyli filtry kukułcze"
excerpt: "Cuckoo Filter to probabilistyczna struktura danych - podobnie jak Bloom Filter. W poprzednim poście znajdziecie krótki opis czym taka struktura danych się charakteryzuje (fałszywie dodatki wynik zapytania: \"czy element zawiera się w danym zbiorze\")."
slug: cuckoo-filters
title: "Cuckoo Filters"
tags: ["dotnet", "bigdata"]
---

**Cuckoo Filter** to **probabilistyczna struktura danych** - podobnie jak [Bloom Filter][1]. W poprzednim poście znajdziecie krótki opis czym taka struktura danych się charakteryzuje (fałszywie dodatki wynik zapytania: "czy element zawiera się w danym zbiorze").

## O czym mowa?
Filtr kukułczy jest relatywnie młodą strukturą danych opisaną w 2014 roku przez [Fan, Andersen, Kaminsky i Mitzenmacher][2]. Poszerza ona wspomniane filtry bloom'a o **usuwanie** i **zliczanie** dodanych elementów, utrzymując przy tym porównywalną złożoność obliczeniową. Minimalizuje ona zasoby przechowując jedynie **odcisk** _(ang. fingerprint)_ wartości elementu w zbiorze. W rzeczywistości jest to pewnego rodzaju tablica haszująca, która problem kolizji rozwiązuje za pomocą [**haszowania kukułczego**][3] _(ang. cuckoo hashing)_.

## Cuckoo hashing
Jak nietrudno się domyślić, nazwa filtra i haszowania wzięła się od **kukułek**. Kukułki znane są ze składania jaj w obcych gniazdach. Gdy mała kukułka wykluje się, eliminuje ona przybrane rodzeństwo usuwając je z gniazda. Nazywamy to [pasożytnictwem lęgowym][4]. Na podobnej zasadzie opiera się właśnie działanie haszowania/filtra kukułczego.

W przypadku haszowania każdy klucz jest haszowany przez **dwie różne** funkcje haszujące, gdzie każdej przyporządkowujemy tablicę, do której będzie można dodawać elementy. Jeżeli miejsce pod zadanym indeksem w pierwszej tablicy jest puste, możemy tam umieścić zadany element. Jeżeli miejsce to jest zajęte, próbujemy dodać element do tablicy drugiej (haszując drugą funkcją). Gdy to miejsce również jest zajęte, "eksmitujemy" element tam obecny i umieszczamy w to miejsce naszą wartość.

![cuckoo](https://adriancolyer.files.wordpress.com/2016/10/cuckoo-1.png?w=600)
###### _(grafika z https://adriancolyer.files.wordpress.com)_

Na chwilę obecną mamy jeden nigdzie nieprzypisany element (ten usunięty z drugiej tablicy w poprzedniej iteracji). Ponieważ istnieją dwie funkcje/tablice, to użyjemy tego faktu do wyliczenia nowego miejsca w tablicy przeciwnej (pierwszej) i tam spróbujemy umieścić element. Gdy nawet w tym przypadku napotkamy na kolizję, dokonamy eksmisji kolejnego elementu i powtórzymy ten proces aż do momentu znalezienia miejsca w którejś z tablic.

## Cuckoo filter - zasada działania
Jak już zostało wspomniane, działanie samego filtra opiera się na powyższej strategii i przedstawia się następująco:
Filtr przechowuje "odcisk" każdego dodanego elementu w jednym z wielu "gniazd" _(ang. bucket)_ (odcisk jest ciągiem znaków pochodzącym z wartości hasza). Każde gniazdo posiada swoją wielkość _(ang. capacity)_, czyli ile fingerprintów jest w stanie pomieścić. Przyjęło się identyfikować filtr poprzez rozmiar odcisku oraz wielkość gniazda właśnie. Np. filtr (2,4) przechowuje odciski o długości 2 znaków w 4-elementowych koszach (gniazdach).
![filtr](/images/cuckoo/filtr.png)

Ze wszystkich operacji jakie oferuje filtr (dodawanie, usuwanie, sprawdzanie), dodawanie jest najbardziej skomplikowane.
Aby dodać element potrzebujemy dwóch indeksów gniazd na podstawie hasza elementu i jego odcisku.

``` csharp
var hashedElement = Hash(element);
var index1 = GetIndexFromHash(hashedElement);
var fingerprint = GetFingerprint(hashedElement);

// index2 -> index1 XOR index uzyskany z hasza odcisku
var hashedFingerprint = Hash(fingerprint);
var index2 = index1 ^ GetIndexFromHash(hashedFingerprint);
var index2 = index2 % filterCapacity;
```

Próbujemy dodać element do gniazda spod indeksu 1-szego, a gdy ten jest pełny, to do 2-giego

``` csharp
if (filter.buckets[index1].Insert(fingerprint))
{
    filterSize++;
    return;
}

if (filter.buckets[index2].Insert(fingerprint))
{
    filterSize++;
    return;
}
```

I podobnie jak w opisie wyżej dotyczącym haszowania kukułczego, będziemy próbować przetasowywać elementy w tablicach aż do skutku (ustalonej z góry liczby powtórzeń) lub całkowitego wyczerpania miejsca, gdy próba dodania pod dwa indeksy się nie udała.

![insert](/images/cuckoo/insert.png)
###### **b2** próbujemy dodać do **bucket\[1\]**, ale jest tam element **c1**, który zostaje wyeksmitowany do **bucket\[0\]**, ale jest też dla niego wolne miejsce w alternatywnym **bucket\[2\]**.

## Jeżeli nie widać różnicy, to po co przepłacać?
Faworyzowałbym użycie Cuckoo Filter, dopóki aplikacja nie dodaje nowych danych (w dużej ilości) do filtra w krótkich odstępach czasu. Ze względu na rekursywną naturę algorytmu dodającego nowe elementy, która objawia się w momencie przepełnienia filtra, wydajność w porównaniu do Bloom Filtra wypada kiepsko. Autor publikacji dobrze to podsumował:

> [...] for reasonably large sized sets, for the same false positive rate as a corresponding Bloom filter, cuckoo filters use less space than Bloom filters, are faster on lookups (but slower on insertions/to construct), and amazingly also allow deletions of keys (which Bloom filters cannot do)
###### [Michael Mitzenmacher (2014)][5]

_PS. Pracuję nad implementacją filtra pod .NET Core, więc sprawdzajcie mojego githuba :)_

---

1. http://ksmigiel.com/2016/06/bloom-filters/
2. https://www.cs.cmu.edu/~dga/papers/cuckoo-conext2014.pdf
3. https://en.wikipedia.org/wiki/Cuckoo_hashing
4. https://pl.wikipedia.org/wiki/Paso%C5%BCyty_l%C4%99gowe
5. http://mybiasedcoin.blogspot.com/2014/10/cuckoo-filters.html

[1]: http://ksmigiel.com/2016/06/bloom-filters/
[2]: https://www.cs.cmu.edu/~dga/papers/cuckoo-conext2014.pdf
[3]: https://en.wikipedia.org/wiki/Cuckoo_hashing
[4]: https://pl.wikipedia.org/wiki/Paso%C5%BCyty_l%C4%99gowe
[5]: http://mybiasedcoin.blogspot.com/2014/10/cuckoo-filters.html

