---
authorlink: http://ksmigiel.com
authorname: "Krzysztof Śmigiel"
date: 2015-01-23T18:16:13+01:00
description: "Przetwarzanie danych na sterydach"
excerpt: "Zapewne słyszeliście o MapReduce, a jeśli nie, to teraz macie okazję usłyszeć (czy tam poczytać). MapReduce jest frameworkiem służącym do przetwarzania dużych zbiorów danych w sposób zrównoleglony. Ostatnimi czasy stał się bardzo popularny dzięki platformom takim jak Hadoop (o nim w kolejnym poście) czy Spark."
slug: map-reduce
title: "MapReduce - wstęp"
tags: ["MapReduce"]
---

Zapewne słyszeliście o **MapReduce**, a jeśli nie, to teraz macie okazję poczytać. **MapReduce** jest frameworkiem służącym do przetwarzania dużych zbiorów danych w sposób zrównoleglony. Ostatnimi czasy stał się bardzo popularny dzięki platformom takim jak Hadoop (o nim w kolejnym poście) czy Spark. Wykorzystywany jest wszędzie tam, gdzie dane liczy się w terabajtach. Duże firmy produkują dużo danych, więc znajduje on zastosowanie np. w Google czy Spotify.

## Funkcyjnie
Na początku chciałem wspomnieć o dwóch ważnych rzeczach: `map()` i `reduce()`. Te dwie funkcje, które są elementami języków funkcyjnych (choć np. C# ma swoje odpowiedniki w LINQ: `Select()` i `Aggregate()`) działają w analogiczny sposób do MapReduce, tyle że na kolekcjach. Tak więc nazwa nie wzięła się znikąd.

#### F&#35;
`map()` aplikuje funkcję dla każdego elementu z kolekcji:
{{% highlight fsharp %}}
    let sample = [1; 2; 3; 4; 5]
    // Dodamy do każdego elementu listy "2"
    List.map (fun x -> x + 2) sample
    (* val it : int list = [3; 4; 5; 6; 7] *)
    // lub bardziej funkcyjnie przy pomocy operatora "|>"
    sample |> List.map (fun x -> x + 2)
{{% /highlight %}}
`reduce()` natomiast jak się można domyślić: redukuje naszą kolekcję przy użyciu akumulatora przekazując wynik do następnego wywołania:
{{% highlight fsharp %}}
    // Zredukujemy naszą listę obliczając sumę ze wszystkich jej elementów
    // a i b są sąsiadami
    sample |> List.reduce (fun a b -> a + b)
    (* val it : int = 15 *)
{{% /highlight %}}

#### C&#35;
I analogicznie przy użyciu LINQ
{{% highlight csharp %}}
    var sample = new List<int>() {1, 2, 3, 4, 5};
    sample.Select(x => x + 2);
    sample.Aggregate((a, b) => a + b);
{{% /highlight %}}

Operacje te prezentują prosty workflow jaki przeprowadza się na danych i w wersji rozszerzonej jest on wykorzystywany w MapReduce.

## map() + reduce() -> MapReduce
Wprowadźmy kilka pojęć: węzeł **(node)** to jeden z wielu komputerów biorących udział w tym całym zamieszaniu. Grupa takich komputerów o podobnej do siebie konfiguracji, będących w tej samej sieci nazywa się klastrem **(cluster)**. To powinno wystarczyć do zrozumienia zasady działania MapReduce, choć ludzie zaznajomieni z tematem prawdopodobnie zamkną przeglądarkę z powodu takiej trywializacji :]

Proces zazwyczaj odbywa się w 3 etapach: 2 tytułowe i jeden pomocniczy pomiędzy nimi:     

- **Map** - na tym etapie każdy węzeł preparuje dane (np. usuwanie zbędnych rekordów, klasyfikacja poprzez dodanie kluczy itp.)  
- **Shuffle** - dane są tutaj sortowane i w takich grupach przydzielane do odpowiednich węzłów
- **Reduce** - następuje agregacja danych na podstawie klucza - oczywiście w sposób równoległy

Tak na prawdę każdy z nas (developerów) nie raz w życiu coś zmapredusił. Bo jeśli sprowadzimy ten proces z chmury i skomplikowanej topologii do pojedynczej bazy danych, to okaże się, że ten cały MapReduce to w rzeczywistości można napisać w SQLu:
{{% highlight sql %}}
    select id, sum(price)
    from products
    group by id
    order by id
{{% /highlight %}}
Wynik takiego zapytania może być również skutkiem całego procesu MapReduce. I dopóki ilość danych i czas w jakim zapytanie się wykonuje mieszczą się w granicach wymagań biznesu, to wszystko ok! Problem zaczyna się wtedy, gdy wydajność maleje, bo instancje serwerów SQL nie radzą sobie z przetwarzaniem coraz szybciej i ciągle napływających danych. Dlatego głównie ze względu na kwestię wydajności wprowadza się paralelność, co klasyczną analizę danych wybija na wyższy poziom zaawansowania.

Dane mogą teraz zostać przetworzone szybciej. Coś, co kiedyś trwało, lub ze względu na ograniczenia mocy obliczeniowej było prawie niemożliwe, dziś za pomocą chmury i tego typu technologii pozwala niejako na nowo odkrywać algorytmy uczenia maszynowego, data-miningu. A w jaki sposób to zostanie zaprezentowane.
