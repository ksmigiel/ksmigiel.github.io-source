---
authorlink: http://ksmigiel.com
authorname: "Krzysztof Śmigiel"
date: 2015-02-17T21:51:00+01:00
title: "Hadoop Streaming w F#"
description: "Hortonworks Data Platform i mono"
excerpt: "Klasyczny Hadoop posiada zestaw klas Java-owych, dzięki którym możemy napisać swoje pierwsze zadanie MapReduce. Nie jest to najwygodniejsze rozwiązanie, ale świetnie nadaje się jako materiał do nauki. Przy produkcyjnych zastosowaniach zdecydowanie lepiej zwrócić się w stronę narzędzi takich jak Hive, Pig czy Scalding."
slug: hadoop-streaming
tags: ["hadoop", "mono", "fsharp"]
---

Klasyczny Hadoop posiada zestaw klas Javowych, dzięki którym możemy napisać swoje pierwsze zadanie **MapReduce**. Jak zaglądniecie do [dokumentacji](http://hadoop.apache.org/docs/r1.2.1/mapred_tutorial.html), to przekonacie się, że nie jest to najwygodniejsze rozwiązanie, ale świetnie nadaje się jako materiał do nauki. Przy zastosowaniach produkcyjnych zdecydowanie lepiej zwrócić się w stronę narzędzi takich jak [Hive](https://hive.apache.org/), [Pig](http://pig.apache.org/) czy [Scalding](https://github.com/twitter/scalding). Za pomocą specyficznej dla każdego składni można tworzyć zaawansowane analizy bez potrzeby pisania kodu low-level w Javie, np. **HiveQL** jest językiem zbliżonym do SQL, a **Pig Lating** ciekawym językiem proceduralnym. Oba są kompilowane do zadań MapReduce. W tym poście skupię się na czymś pośrodku, czyli **Hadoop Streaming**.

## Streaming API

Hadoop Streaming jest częścią dystrybucji Hadoop. Pozwala na tworzenie zadań w dowolnym języku (nawet skryptowym). Warunek jaki trzeba spełnić, to utworzenie dwóch plików wykonywalnych (Mapper i Reducer), które wartości zczytują z **stdin**, a przetworzone odpowiednio dane wypisują do konsoli (**stdout**). Jak tytuł posta wskazuje zaimplementowałem je w F#. Dopiero raczkuję w świecie programowania funkcyjnego, dlatego z chęcią przyjmę komentarze odnośnie poprawności kodu. Za przykładowe zadanie MapReduce posłuży nam standardowy **word count**. 

#### Mapper.fs
{{% highlight fsharp %}}
    open System
    open System.IO

    module Mapper =

      [<EntryPoint>]
      let main argv = 
        let chars =
          [| ' '; '.'; ','; '!'; ';'; '?'; '|'; '-'; '{'; '}'; ':'; '('; ')' |]

        match argv.Length with
        | 1 -> Console.SetIn(new StreamReader(argv.[0]))
        | _ -> ()

        let isWord w =
          let n = ref 0
          not (Int32.TryParse(w, n))

        let output (word:string) =
          Console.WriteLine("{0}\t{1}", word.Trim(), 1)

        Seq.initInfinite (fun _ -> Console.ReadLine())
        |> Seq.takeWhile (fun line -> line <> null)
        |> Seq.iter (fun (line : string) -> 
          line.ToLower().Split(chars, StringSplitOptions.RemoveEmptyEntries)
          |> Seq.filter isWord
          |> Seq.iter output )
        0
{{% /highlight %}}

Zamiast posługiwać się pętlą przy odczytywaniu streamu z stdin wykorzystałem funkcję `Seq.initInfinite()`, która wykonuje się aż do spełnienia warunku zdefiniowanego w `Seq.takeWhile()`. Do konsoli wypisujemy parę "**klucz** **wartość**" oddzielone znakiem **tabulacji**. Ponieważ interesuje nas zliczanie słów, jako wartość wychodzącą z Mappera podajemy **1**, czyli

{{% highlight fsharp %}}
    word    1
    count    1
    example    1
{{% /highlight %}}
itd. Reducer otrzymuje posortowany już stream takich par i powinien zwracać dane w ten sam sposób, natomiast w miejsce wartości wstawiamy sumę dla danego słowa (klucza).

#### Reducer.fs
{{% highlight fsharp %}}
    open System
    open System.IO

    module Reducer =

      [<EntryPoint>]
      let main argv = 
        match argv.Length with
        | 1 -> Console.SetIn(new StreamReader(argv.[0]))
        | _ -> ()

        let currentWord = ref String.Empty
        let count = ref 0

        Seq.initInfinite (fun _ -> Console.ReadLine())
        |> Seq.takeWhile (fun line -> line <> null)
        |> Seq.iter (fun line ->
          let splitted = line.Split('\t')
          let word = (splitted.[0])

          match (word) with
          | word when word = !currentWord ->
            incr count
          | _ ->
            if !currentWord <> String.Empty then
              Console.WriteLine("{0}\t{1}", !currentWord, !count)
            count := 1
            currentWord := word)
        |> ignore
        Console.WriteLine("{0}\t{1}", !currentWord, !count)
{{% /highlight %}}

## HDP

Hortonworks Data Platform (HDP) to gotowa dystrybucja Hadoopa, która zawiera preinstalowane i skonfigurowane narzędzia takie jak **Hadoop**, **Hive**, **Pig**, **HBase**, **Ambari**, **Cascading**, **Oozie** czy **Zookeeper** [(architektura HDP)](http://docs.hortonworks.com/HDPDocuments/HDP2/HDP-2.2.0/Getting_Started_v22/media/01-RawContent/Getting%20Started/Full%20View.png). Ogólnie polecam rozwiązania firmy [Hortonworks](http://hortonworks.com/) - naprawdę świetnej jakości tutoriale i narzędzia. Chcąc poeksperymentować mamy dwie opcje do wyboru [(downloads)](http://hortonworks.com/hdp/downloads/):

- instalacja HDP
- uruchomienie maszyny wirtualnej (sandbox)

Wypóbowałem obydwie, ale na potrzeby tego posta skorzystam z sandboxa. Działa na systemie **CentOS**, także podstawowa wiedza z systemów **Unix** bardzo się przyda.  Instalacja i konfiguracja HDP na Windowsie to temat nadający się na osobnego posta.

## mono

Musimy sami doinstalować `mono` i kompilator `fsharpc`, żeby binarki Hadoopa mogły wykonać z terminala skompilowane pliki .exe.

{{% highlight d %}}
    sudo yum install mono
    sudo yum install fsharp
{{% /highlight %}}

Teraz wystarczy skompilować nasze pliki:

{{% highlight d %}}
    fsharpc Mapper.fs
    fsharpc Reducer.fs
{{% /highlight %}}

i możemy zacząc prawdziwą zabawę :)

## Hello world dla Big Data, czyli word count

Nie przez przypadek wybrałem zliczanie słów jako przykład. Jest to swoisty "Hello world!" w świecie przetwarzania danych. Zliczymy 10 najczęściej występujących słów (dłuższych niż 3 litery, aby pozbyć się "się" i "aby") w powieści **Krzyżacy** Henryka Sienkiewicza. Wszystkie pliki i skrypty znajdziecie na moim [githubie](https://github.com/ksmigiel/hadoop-streaming-fharp).

Uruchomienie joba odbywa się za pomocą komendy:

{{% highlight d %}}
    hadoop jar /usr/hdp/current/hadoop-mapreduce-client/hadoop-streaming.jar
        -files mapper.sh, reducer.sh, Mapper.exe, Reducer.exe
        -input /user/ksmigiel/krzyzacy.txt
        -output /users/ksmigiel/output
        -mapper mapper.sh
        -reducer reducer.sh
{{% /highlight %}}

**mapper.sh** i **reducer.sh** to skrypty, które wykonują polecenie `mono [exe]`.
Input i output to ścieżka na HDFS, dlatego trzeba skopiować plik za pomocą `hdfs dfs -copyFromLocal <src> <dest>`.
Jeśli będziecie chcieli użyć dowolnego pliku tekstowego, pamiętajcie o kodowaniu w UTF-8 i konwersji znaków nowej linii za pomocą `dos2unix`.

I jeszcze na zakończenie skrypcik **Pig**:

{{% highlight sql %}}
    words = load '/user/ksmigiel/out/part-00000' using PigStorage() as (word:chararray, count:int);
    words_long = filter words by size(word) > 3;
    words_ordered = order words_long by count desc;
    top10 = limit words_ordered 10;
    dump top10;
{{% /highlight %}}

<div>
  <a href="https://plot.ly/~ksmigiel/17/" target="_blank" title="Krzyżacy word count" style="display: block; text-align: center;"><img src="https://plot.ly/~ksmigiel/17.png" alt="Krzyżacy word count" style="max-width: 100%;width: 564px;"  width="564" onerror="this.onerror=null;this.src='https://plot.ly/404.png';" /></a>
  <script data-plotly="ksmigiel:17" src="https://plot.ly/embed.js" async></script>
</div>

## Podsumowanie

Stawianie pierwszych kroków z Hadoopem i jego przyległościami wymaga paru wolnych chwil. Jeśli nie macie doświadczenia z linuxowym terminalem, poruszanie się po sandboxie i jego obsługa mogą być kłopotliwe. Co prawda HDP udostępnia przyjemny interfejs webowy, z poziomu którego można uruchamiać zadania MapReduce napisanie w Pig lub HiveQL (jeszcze raz polecam tutoriale Hortonworks), ale chcąc poznać podstawy tej technologii dobrze jest zacząć od "niskiego poziomu".
