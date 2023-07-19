---
aliases:
  - /2019/01/hyper-git
authorlink: http://ksmigiel.com
authorname: Krzysztof Śmigiel
date: 2019-01-04T13:13:09+00:00
description: "Konfiguracja terminala, co by było ładnie i funkcjonalnie"
excerpt: "Już kiedyś pisałem o tym, że lubię konsole. Bardzo też lubię używać gita klepiąc komendy z klawiatury (choć wcale nie jestem hejterem rozwiązań z GUI). Dotychczas używałem GitHub Desktop. Posiadał on wbudowany wrapper do PowerShella zwany posh-git, co bardzo ułatwiało pracę. Jednak w najnowszej wersji, nie wiedzieć czemu, zrezygnowali ze wspierania jakiegokolwiek command-line'a, więc zacząłem eksperymentować. Mogłem po prostu zainstalować posh-gita, ale po co sobie ułatwiać życie..."
slug: hyper-git
title: "Hyper terminal i git/bash"
tags: ["bash", "git", "hyper"]
---

Już kiedyś [pisałem][1] o tym, że lubię konsole. Bardzo też lubię używać gita klepiąc komendy z klawiatury (choć wcale nie jestem hejterem rozwiązań z GUI). Dotychczas używałem [GitHub Desktop][2]. Posiadał on wbudowany wrapper do `PowerShella` zwany [posh-git][3], co bardzo ułatwiało pracę. Jednak w najnowszej wersji, nie wiedzieć czemu, zrezygnowali ze wspierania jakiegokolwiek command-line'a, więc zacząłem eksperymentować. Mogłem po prostu zainstalować posh-gita, ale po co sobie ułatwiać życie...

## Git for Windows
Zainstalowałem sobie [oficjalną dystrybucję gita][4]. W zależności od tego jaką opcję wybierzemy podczas instalacji, będziemy mieli dostęp do git.exe z poziomu cmd/powershell lub poprzez git-bash (albo to i to). Sam git-bash nie wygląda najlepiej.

![git-bash](https://gitforwindows.org/img/gw1.png)

Ładne rzeczy przyjemniej się używa, a że każdy programista ma jakieś swoje zboczenie (patrz [/r/unixporn][5]) zacząłem szukać i upiększać to biedne okno git-bashowe. Pomógł mi w tym między innymi [Hyper][6]!

## Hyper terminal
[Hyper][6] to terminal (a w zasadzie emulator terminala) oparty o platformę Electron. Dość egzotycznie brzmi.

![hyper](https://hyper.is/static/hyperyellow.gif)

Po instalacji przywita was Hyper z uruchomioną powłoką `cmd`. Docelowo jednak chcielibyśmy, aby powłoką był git-bash, którego zainstalowaliśmy chwilę wcześniej.

### Konfiguracja powłoki git-bash
Wpierw musimy dostać się do konfiguracji. `"Ctrl + ",` otwiera plik ustawień `.hyper.js` z twojego katalogu domowego. Zamień fragment konfiguracji na poniższy:

``` json
// the shell to run when spawning a new session (i.e. /usr/local/bin/fish)
// if left empty, your system's login shell will be used by default
//
// Windows
// - Make sure to use a full path if the binary name doesn't work
// - Remove `--login` in shellArgs
//
// Bash on Windows
// - Example: `C:\\Windows\\System32\\bash.exe`
//
// PowerShell on Windows
// - Example: `C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`
shell: 'C:\\Program Files\\Git\\git-cmd.exe',

// for setting shell arguments (i.e. for using interactive shellArgs: `['-i']`)
// by default `['--login']` will be used
shellArgs: ['--command=usr/bin/bash.exe', '-l', '-i'],

// for environment variables
env: {TERM: 'cygwin'},
```

- `shell` zamieniamy na odpowiednik z folderu instalacji Git for Windows.
- `shellArgs` odpala powłokę bash z dystrybucji MSYS z odpowiednimi paramterami, aby uruchomić ją w trybie _login_ i _interactive_, czyli tak jak normalnie używamy powłoki w systemie unix.
- `env` ustawia zmienne systemowe. `TERM: 'cygwin'` zgodnie z tym co opisywali na [githubie][8]. Naprawia m.in. obsługę kolorów i `clear/reset`.

Pozostało zapisać ustawienie i przeładować konfigurację `"Ctrl + Shift + R"` i voilà!

### Instalowanie skórek
...nigdy nie było tak proste. Osobiście używam schematu [nord][7], a instalacja sprowadza się jedynie do dodania wpisu `hyper-nord` (nazwa theme/pluginu) do tablicy `plugins` w konfiguracji.

``` sh
plugins: ['hyper-nord']
```

Przeładować i gotowe.

## Dekoracja zachęty, czyli ładny prompt
Posh-Git przyzwyczaił mnie do ładnego prompta, pokazującego status brancha, na którym aktualnie pracujemy. Bash w konfiguracji domyślnej pokazuje jedynie nazwę brancha. Wszystkie rozwiązania jakie widziałem wydawały się trudne w instalacji, gdyż nasz bash to powłoka uruchomiona w okrojonym kontekście MSYS2. Kompilowanie ze źródeł, a nawet zwykła instalacja pakietów z `apt-get` jest niemożliwa. Normalnie na linuxie użyłbym `zsh` lub `fish`, ale jesteśmy na Windowsie emulując terminal napisany w HTML/JS uruchamiający powłokę bash z dystrybucji MSYS2/MinGW - emacsem przez sendmaila!

Okazuje się, że `git` ma wbudowaną (trochę ubogą) obsługę statusu w prompcie `$PS1`. Zanim to wygooglałem (szkoda, że po fakcie), użyłem reverse engineeringu i podążałem tropem związanym z nazwą brancha, który git-bash już wyświetlał.

### W poszukiwaniu zachęty
Zacząłem od znalezienia skryptów, które powłoka uruchamia przy starcie. Coś ten obecny prompt przecież ustawiło. W katalogu domowym nie było nic, więc przeniosłem się do `/etc/profile`. Stamtąd nakierowało mnie na folder `/etc/profile.d/`, w którym znajduje się plik `git-prompt.sh`. To już jakiś trop! Następnie analizując kod napatoczyłem się na `git --exec-path` i ścieżkę do nowego pliku `git-prompt.sh`, tylko w innej lokalizacji, tj. `C:/Program Files/Git/mingw64/share/git/completion/git-prompt.sh`. I to był strzał w dziesiątkę, [popatrzcie][9]!

Wynika z powyższego komentarza pliku, że wystarczy ustawić pewne zmienne systemowe. Mnie wystarczy poniższa konfiguracja, która przy nazwie brancha oznacza znakiem jego aktualny status.

``` sh
export GIT_PS1_SHOWDIRTYSTATE="1"
export GIT_PS1_SHOWUNTRACKEDFILES="1"
export GIT_PS1_SHOWUPSTREAM="auto git name"
```

![terminal](/images/hyper-git/terminal.png)

## Podsumowanie
Nie jest to może normalny sposób używania gita, ale co się nauczyłem to moje. Bardzo lubię tracić czas na takie "debugging stories". To najlepszy materiał na posty.

<br>

---

[1]: http://ksmigiel.com/2016/01/powershell/
[2]: https://desktop.github.com/
[3]: https://github.com/dahlbyk/posh-git
[4]: https://git-scm.com/
[5]: https://reddit.com/r/unixporn
[6]: https://hyper.is
[7]: https://github.com/arcticicestudio/nord-hyper
[8]: https://github.com/zeit/hyper/issues/1252
[9]: https://github.com/git/git/blob/master/contrib/completion/git-prompt.sh

1. http.//ksmigiel.com/2016/01/powershell/
2. https.//desktop.github.com/
3. https.//github.com/dahlbyk/posh-git
4. https.//git-scm.com/
5. https.//reddit.com/r/unixporn
6. https.//hyper.is
7. https.//github.com/arcticicestudio/nord-hyper
8. https.//github.com/zeit/hyper/issues/1252
9. https.//github.com/git/git/blob/master/contrib/completion/git-prompt.sh