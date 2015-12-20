---
authorlink: http://ksmigiel.com
authorname: "Krzysztof Śmigiel"
date: 2015-05-14T16:38:00+01:00
title: "Visual Studio Code"
description: "Nowy edytor od Microsoftu"
excerpt: "Microsoft na tegorocznej konferencji //build zaskoczył nas paroma nowinkami. Jeśli nie jesteście na bieżąco polecam zerknąć na podsumowanie. Każdy znajdzie coś dla siebie."
slug: vs-code
tags: ["VS", "TypeScript", "webdev"]
---

Microsoft na tegorocznej konferencji **//build/** zaskoczył nas paroma nowinkami. Jeśli nie jesteście na bieżąco polecam zerknąć na [podsumowanie][1]. Każdy znajdzie coś dla siebie. 

## VS Code
Mnie osobiście najbardziej spodobał się edytor [**Visual Studio Code**][2], czyli taki Sublime Text w Microsoftowym wydaniu. W całości oparty na node.js i edytorze [**Atom**][3] od GitHuba, a konkretnie na bibliotece [**Electron**][4] umożliwiającej pisanie cross-platformowych desktopowych aplikacji w JS/HTML/CSS. Główne cechy wyróżniające Code na tle innych edytorów to m.in.:

- cross-platformowość (sprawdzałem i faktycznie tak jest! :) )
- debugging aplikacji napisanych w node.js (ASP.NET 5 w przygotowaniu)
- tasks - integracja z popularnymi narzędziami do automatyzacji buildów, testowania i deployowania (Make, Ant, Gulp, Jake, Rake, MSBuild)
- [JSON schema][5] - code-completion w plikach konfiguracyjnych JSON
- wsparcie TypeScript (code-completion, _"go to definition"_ etc.)
- fuzzy-search - przeszukiwanie plików projektu oraz ustawień edytora (_Ctrl+E_ i _Ctrl-Shift-P_)
- parsowanie i podgląd [Markdown][6] w locie - w ten sposób powstaje ten post :)

W obecnej wersji brakuje mi klawiszologii VIM'a (jak się człowiek raz przyzwyczai to potem wszystkie inne skróty klawiszowe wydają się bezsensowne) oraz możliwości tworzenia własnych snippetów, co mam nadzieję zostanie dodane w nadchodzących wydaniach.

Polecam zapoznać się z tym edytorem. Pomimo wersji _Preview_ posiada masę fajnych funkcjonalności.

## Monaco?
Jeśli po ściągnięciu Code'a masz wrażenie graniczące z pewnością, że gdzieś już to widziałeś to masz całkowitą rację! Microsoft do jego budowy oprócz wspomnianego Atoma wykorzystał [**Visual Studio Monaco**][7], które jako rozszerzenie można doinstalować w panelu **Azure** do dowolnej aplikacji na nim hostowanej. Monaco to webowy edytor w _"chmurze"_ zintegrowany z wierszem poleceń (dostęp do `node` i `npm`). Preinstalowany node.js pozwala na hostowanie aplikacji webowych przy użyciu [iisnode][8]. Może posłużyć jako pomoc podczas szybkiej edycji pliku na serwerze albo jako IDE w chmurze :)

Od jakiegoś czasu na blogu MSDN zaprzestano informować o jakichkolwiek newsach związanych z rozwojem Monaco. Jednak po konferencji **//build/** nie mam wątpliwości, że Microsoft szykował się na premierę swojego nowego edytora i tak na prawdę tworzył dwa narzędzia równocześnie (pod spodem są te same bebechy: node.js i WebKit).

> protip: naciśnij F12 w edytorze **Code** i wszystko jasne!

Jestem ciekawy czy w przyszłości te dwa projekty staną się jednym tworem.

## Changes, changes everywhere!
Muszę przyznać, że lubię ten "nowy Microsoft". Edge, ASP.NET vNext, DNX, Code czy rozwój PowerShella sprawiają, że Windows i jego cały ekosystem stają się bardziej "developer-friendly". To chyba dobrze, że chcą przyciągnąc do platformy developerów - w końcu to oni ją tworzą.

---

1. http://blogs.technet.com/b/uktechnet/archive/2015/04/30/announcements-from-build-2015.aspx
2. http://code.visualstudio.com
3. https://atom.io/
4. https://github.com/atom/electron
5. http://schemastore.org/json/
6. http://daringfireball.net/projects/markdown/
7. http://blogs.msdn.com/b/monaco/archive/2014/06/26/how-to-access-visual-studio-online-monaco-from-the-new-azure-portal.aspx
8. https://github.com/tjanczuk/iisnode


[1]: http://blogs.technet.com/b/uktechnet/archive/2015/04/30/announcements-from-build-2015.aspx
[2]: http://code.visualstudio.com
[3]: https://atom.io/
[4]: https://github.com/atom/electron
[5]: http://schemastore.org/json/
[6]: http://daringfireball.net/projects/markdown/
[7]: http://blogs.msdn.com/b/monaco/archive/2014/06/26/how-to-access-visual-studio-online-monaco-from-the-new-azure-portal.aspx
[8]: https://github.com/tjanczuk/iisnode
