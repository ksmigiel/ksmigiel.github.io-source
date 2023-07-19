---
aliases:
  - /2015/12/u-sql
authorlink: http://ksmigiel.com
authorname: "Krzysztof Śmigiel"
date: 2015-12-20T20:26:38+01:00
title: "U-SQL i Azure Data Lake"
description: "Big Data dla każdego"
excerpt: "I tak o to Microsoft tworzy całkowicie nowy język do analizy danych, będący hybrydą dwóch paradygmatów: deklaratywnego i proceduralnego. Teraz z poziomu kodu przypominającego SQL (w rzeczywistości wzorowany na T-SQL i ANSI SQL) możemy korzystać z dobrodziejstw C#..."
slug: u-sql
tags: ["bigdata", "sql", "azure"]
---

Nie skłamię twierdząc, że **Big Data** jest obok **IoT**, **machine learningu** czy **drukowania 3D** w top 5 jeśli chodzi o modne pojęcia i zagadnienia wyznaczające trendy w świecie IT, tworzące nowe gałęzie w tej dziedzinie. Ponieważ Microsoft w ostatnim czasie realizuje politykę bycia "na topie" (publiczne repozytoria na GitHub'ie, .NET na Linuxie - DNX i Kestrel etc.) nie mogło ich też zabraknąć w tak gorącym temacie jakim jest obecnie Big Data. Efektem popularyzacji Hadoopa i jego przyległości było w tym wypadku otworzenie platformy [HDInsight][1] na chmurze Azure. Za pomocą rozbudowanego interfejsu webowego z łatwością możemy tworzyć klastry Hadoop'a, a z poziomu Visual Studio używając SDK projektować [topologie Storm'a][2] do przetwarzania strumieniowego i wdrażać je prosto do Azure. Dokumentacja zawiera naprawdę sporo informacji na różnym poziomie zaawansowania, a Azure oferuje 30 dni triala, więc nic tylko zakładać konto i eksperymentować.

## Azure Data Lake
Opisany wyżej poziom abstrakcji okazał się niewystarczający. O ile programiści z konfiguracją klastrów i pisaniem zadań MapReduce poradzą sobie bez problemu, to analitycy danych pracujący na co dzień z SQL'em i Excelem już nie koniecznie. Chcąc ułatwić osobom "mniej technicznym" dostęp do technologii, pod koniec września tego roku Microsoft zapowiedział uruchomienie nowego serwisu: [**Azure Data Lake**][3].

<div style="text-align: center">
  <img src="http://blogs.technet.com/cfs-file.ashx/__key/communityserver-blogs-components-weblogfiles/00-00-00-60-54/928Pic1.png" />
</div>

Jest to serwis, który osiągnięcie konkretnych celów biznesowych stawia nad konfigurację rozproszonej architektury. Pozwala skupić się na logice aplikacji, zamiast na skomplikowanym systemie zależności potrzebnym do jej poprawnego działania. Microsoft inwestując w tego typu technologie Big Data / analizy danych pragranie ułatwić pracę z danymi każdego typu, wielkości i szybkości (czyli tzw. 3xV: [Volume, Velocity, Variety][4]) używając do tego dowolnych narzędzi, języków czy frameworków.

>"Our goal is to make big data technology simpler and more accessible to the greatest number of people possible. This includes developers, data scientists, analysts, application developers, and also businesspeople and mainstream IT managers."

Każdy kto próbował samodzielnie uruchomić Hadoopa wraz z całą infrastrukturą wie jak bardzo jest to czasochłonne. Rozwiązanie "code-based" daje ogromne możliwości, wymaga jednak sporej inwestycji czasu, aby je opanować. Programista często musi zadbać o poprawną synchronizację i współbieżność samodzielnie. Natomiast SQL i języki SQL-podobne, takie jak [Hive][5] są relatywnie łatwe, ale brak w nich właśnie tej elastyczności jaką cechuje poprzednie rozwiązanie, jednakże problemy ze skalowalnością, optymalizacją i współbieżnością nie są już tutaj odpowiedzialnością developera.

## U-SQL
I tak o to Microsoft tworzy całkowicie nowy język do analizy danych **U-SQL**, będący hybrydą dwóch paradygmatów: deklaratywnego i proceduralnego. Teraz z poziomu kodu przypominającego SQL (w rzeczywistości wzorowany na T-SQL i ANSI SQL) możemy korzystać z dobrodziejstw C#, co pozwala na używanie typów jak i wyrażeń lambda (LINQ) m.in w zapytaniu _SELECT_. Brzmi niesamowicie, nieprawdaż? Co więcej nic nie stoi na przeszkodzie, aby podpiąć pod zapytanie referencję do biblioteki i użyć zewnętrznego kodu. Daje to przeogromne możliwości w budowaniu rozwiązań analitycznych zarówno dla programistów jak i analityków.
Ponieważ specyfikacja języka nie jest jeszcze w pełni gotowa, a Azure Data Lake jest (jak sam to określa) w "wersji zapoznawczej", przedstawię tylko podstawową składnię i smaczki, co by nabrać apetytu na następne posty :)

### Extractory i Outputtery
Azure Data Lake składa się z dwóch serwisów: ADL **Analytics** i ADL **Store**. Ten pierwszy został w skrócie opisany wyżej, a drugi to repozytorium danych, które przechowuje dane w różnej postaci (nawet w czasie rzeczywistym, chociażby z urządzeń IoT). Jest ono kompatybilne z systemem plików **HFDS** przez co Hadoop i dystrybucje bazujące na nim bez przeszkód mogą uzyskać dostęp do danych w celu przetwarzania i analizy. Komunikacja między nimi odbywa się właśnie za pomocą **Extractorów** i **Outputterów**.

``` sql
@searchlog =
    EXTRACT UserId          int,
            Start           DateTime,
            Region          string,
            Query           string,
            Duration        int?,
            Urls            string,
            ClickedUrls     string
    FROM "/Samples/Data/SearchLog.tsv"
    USING Extractors.Tsv();

OUTPUT @searchlog   
    TO "/output/SearchLog-first-usql.csv"
USING Outputters.Csv();
```

W ten sposób importujemy plik SearchLog.tsv (tab separated value) do pamięci i od tego momentu korzystamy ze zmiennej jak ze zwykłej, tymczasowej tabeli. Po zakończeniu analiz eksportujemy plik z powrotem do ADL Store, tym razem w formacie .csv (comma separated value). `Tsv()` i `Csv()` są w standardzie U-SQL, a przy pomocy SDK możemy napisać klasy do obsługi innych typów danych. Na [GitHub'ie][6] U-SQL można znaleźć przykładową implementację dla typów **XML** i **JSON**.

### Wyrażenia lambda, LINQ i typy
Ponieważ typy w U-SQL'u są typami z C#, możemy ich używać dokładnie tak samo - wszystkie metody na wyciągnięcie ręki! Dzieje się tak, ponieważ standardowy skrypt U-SQL ma referencję do `System` i `System.Linq`.

``` sql
--@tweets =
--    EXTRACT
--    ...
    
@refs = SELECT new SQL.ARRAY<string>(
            tweet.Split(' ')
                 .Where(x => x.StartsWith("@"))) AS refs
        FROM @tweets;
```

Kod wygląda jakby ktoś do SQL'a wkleił C#'a, a co najważniejsze: działa i to własnie jest U-SQL! :). `SQL.ARRAY<T>` jest typem wbudowanym (w rzeczywistości typem C#) zachowującym się jak tabela SQL (możemy _@refs_ używać w innych zapytaniach, łączyć z tabelami itp.), a ponieważ `Where()` zwraca `IEnumerable<T>`, w kolejnych zapytaniach nadal możemy filtrować kolekcję za pomocą predykatów.

W pewwym momencie będziemy musieli nasze typy-hybrydy zmaterializować (coś na kształt `ToList()`) i użyjemy do tego `CROSS APPLY EXPLODE`:

``` sql
@t = SELECT Refs.r.Substring(1) AS r,
            "mentioned" AS category
     FROM @refs CROSS APPLY EXPLODE(refs) AS Refs(r);
```
Tak przetworzone dane bez problemu zapisujemy w wybranym formacie do ADL Store (patrz wyżej).

Więcej przykładów znajdziecie na podanym GitHubie Microsoftu (linki na samym dole). Przykłady użyć SDK i Azure Data Lake Tools for Visual Studio opiszę w następnym poście.

## Czyli dla każdego?
Chyba tak. Teraz przetwarzanie danych w chmurze stało się jeszcze łatwiejsze. Niski próg wejścia i znajoma składnia z pewnościa przyciągnie do platformy wielu użytkowników skoncentrowanych na osiągnięciu celu biznesowego. Tego typu podejście nie jest szczepionką na wszystko i z pewnością bardziej "customowe" rozwiązania nie stracą na znaczeniu.

---

1. https://azure.microsoft.com/pl-pl/services/hdinsight/
2. https://azure.microsoft.com/pl-pl/documentation/articles/hdinsight-storm-develop-csharp-visual-studio-topology/
3. http://blogs.technet.com/b/dataplatforminsider/archive/2015/09/28/microsoft-expands-azure-data-lake-to-unleash-big-data-productivity.aspx
4. http://blog.sqlauthority.com/2013/10/02/big-data-what-is-big-data-3-vs-of-big-data-volume-velocity-and-variety-day-2-of-21/
5. https://hive.apache.org/
6. https://github.com/MicrosoftBigData/usql/

[1]: https://azure.microsoft.com/pl-pl/services/hdinsight/
[2]: https://azure.microsoft.com/pl-pl/documentation/articles/hdinsight-storm-develop-csharp-visual-studio-topology/
[3]: http://blogs.technet.com/b/dataplatforminsider/archive/2015/09/28/microsoft-expands-azure-data-lake-to-unleash-big-data-productivity.aspx
[4]: http://blog.sqlauthority.com/2013/10/02/big-data-what-is-big-data-3-vs-of-big-data-volume-velocity-and-variety-day-2-of-21/
[5]: https://hive.apache.org/
[6]: https://github.com/MicrosoftBigData/usql/
