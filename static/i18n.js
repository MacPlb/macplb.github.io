// English is written in the HTML. For Polish or German, every element with
// data-i18n="key" gets the matching string below (data-i18n-alt / -label do
// the same for alt and aria-label). The choice comes from ?lang= or the last
// pick, and English stays the default. Strings are our own, so innerHTML is fine.
const strings = {
  pl: {
    'title.home': 'Maciej Pałubicki · Programista .NET',
    'title.posts': 'Wpisy · Maciej Pałubicki',
    'title.post': 'Wpis · Maciej Pałubicki',
    'title.collection': 'Kolekcja · Maciej Pałubicki',
    'skip': 'Przejdź do treści',
    'menu': 'Menu',
    'language': 'Język',
    'nav.about': 'o mnie',
    'nav.experience': 'doświadczenie',
    'nav.projects': 'projekty',
    'nav.stack': 'technologie',
    'nav.contact': 'Kontakt',

    'hero.lead': 'Programista .NET w i4B w Koszalinie: tworzę API w ASP.NET Core i mikroserwisy gRPC na najnowszym .NET, a także API w Pythonie i Go.',
    'hero.email': 'Napisz do mnie',
    'strip.role': 'Stanowisko <span>Software Developer @ i4B</span>',
    'strip.status': 'Status <span>Nie szukam pracy · chętnie porozmawiam</span>',

    'about.label': '<span>01</span>O mnie',
    'about.title': 'O <em>mnie</em>',
    'about.statement': 'Z .NET zacząłem w 2022 roku na stażu w GlobalLogic, a w 2023 dołączyłem do i4B jako praktykant. Dziś pracuję tam jako programista. Zajmuję się głównie architekturą backendu w C#, zawsze na najnowszym .NET – piszę w nim od wersji 6.',
    'about.more': 'Poza .NET piszę w Pythonie, używając Django i FastAPI do API, oraz w Go: Gin do webowych API i Bubble Tea do aplikacji terminalowych. Obecnie uczę się Blazora, żeby tworzyć frontend bez wychodzenia poza .NET. Po pracy kolekcjonuję płyty winylowe i zegarki mechaniczne, gram w retro gry (głównie Nintendo) i tworzę pixel art.',
    'stat.requests': 'zapytań dziennie do mojego API gRPC',
    'stat.since': 'piszę w .NET od',
    'stat.languages': 'języki na produkcji: C#, Python, TypeScript',
    'stat.machines': 'maszyny z NixOS z jednego flake’a',

    'exp.label': '<span>02</span>Doświadczenie',
    'exp.title': 'Gdzie <em>pracowałem</em>',
    'job.intern': 'Stażysta',
    'job1.date': 'paź 2023 – obecnie',
    'job2.date': 'lip 2023 – paź 2023',
    'job3.date': 'lip 2022 – wrz 2022',
    'job1.meta': 'Koszalin, Polska · Pełny etat · Hybrydowo',
    'job2.meta': 'Koszalin, Polska · Stacjonarnie',
    'job3.meta': 'Koszalin, Polska · Staż',
    'job1.body': 'Serwisy backendowe w C# i .NET na bazach SQL. Odpowiadam za architekturę backendu, integracje z innymi systemami i bieżące utrzymanie.',
    'job2.body': 'Rozwój backendu i praca z bazami SQL w C# i .NET.',
    'job3.body': 'Projekty backendowe w C# i .NET, na co dzień z Gitem, SQL i Jirą.',

    'proj.label': '<span>03</span>Projekty',
    'proj.title': 'Co <em>zbudowałem</em>',
    'proj.all': 'Wszystkie repozytoria',
    'label.work': 'Praca',
    'label.plugin': 'Wtyczka JetBrains',
    'proj.github': 'Zobacz na GitHubie <span aria-hidden="true">&rarr;</span>',
    'proj.grpc.title': 'API gRPC w .NET',
    'proj.grpc.text': 'Serwis gRPC do komunikacji między mikroserwisami, obsługujący ponad milion zapytań dziennie.',
    'proj.glue.title': 'Pipeline ETL w AWS Glue',
    'proj.glue.text': 'Pipeline przetwarzający duże zbiory danych w zadaniach AWS Glue, z funkcjami Lambda automatyzującymi etapy transformacji i ładowania.',
    'proj.vt.alt': 'Panel Vertical-Tabs w IDE JetBrains z otwartymi plikami pogrupowanymi według projektów .NET',
    'proj.vt.text': 'Nawigator otwartych plików dla IDE JetBrains. Dokuje się po lewej, grupuje pliki według modułu IDE lub projektu .NET i może zastąpić pasek kart edytora.',
    'proj.blog.title': 'Blog w Django',
    'proj.blog.text': 'Aplikacja blogowa z kontami użytkowników, edytorem tekstu sformatowanego i komentarzami.',
    'proj.bookstore.text': '.NET Web API do zarządzania autorami w księgarni, z bazą PostgreSQL, uruchamiane w Dockerze.',
    'proj.arduino.text': 'Aplikacja .NET MAUI, która łączy się z termometrem na Arduino i pokazuje jego odczyty.',
    'proj.nix.alt': 'Pulpit niri z fastfetch, Neovimem edytującym paletę kolorów kitty i launcherem aplikacji Noctalia',
    'proj.nix.text': 'Moje systemy NixOS i dotfiles: jeden flake buduje desktop i laptopa w palecie kolorów, której używa ta strona.',

    'stack.label': '<span>04</span>Technologie',
    'stack.title': 'Z czym <em>pracuję</em>',
    'stack.all.title': 'Cały stack',
    'stack.all.text': 'Wszystko, z czym pracuję, od testów aż po system operacyjny. Przewijaj dalej, a każda warstwa się podświetli.',
    'stack.infra.title': 'Linux i chmura',
    'stack.infra.text': 'Tam, gdzie działa kod: kontenery, usługi chmurowe i pipeline’y, które je wdrażają.',
    'stack.data.title': 'Dane',
    'stack.data.text': 'Przede wszystkim relacyjne bazy danych: projektowanie schematów i optymalizacja zapytań w SQL Server i PostgreSQL, a obok Redis.',
    'stack.lang.title': 'Języki',
    'stack.lang.text': 'Na co dzień C# na najnowszym .NET, tak jak od czasów .NET 6. Obok tego Python i Go, a TypeScript, gdy zadanie tego wymaga.',
    'stack.web.text': 'API HTTP i endpointy czasu rzeczywistego z wbudowanym uwierzytelnianiem i autoryzacją.',
    'stack.web.tech': 'Web API · MVC · minimal APIs · SignalR · ASP.NET Core Identity · JWT · OAuth 2.0 / OpenID Connect · Blazor (w trakcie nauki)',
    'stack.services.title': 'Mikroserwisy',
    'stack.services.text': 'Mikroserwisy, które komunikują się przez gRPC i kolejki wiadomości.',
    'stack.arch.title': 'Architektura',
    'stack.arch.text': 'Struktura, dzięki której kod łatwo zmieniać, nawet gdy rośnie.',
    'stack.quality.title': 'Testy i telemetria',
    'stack.quality.text': 'Testy na każdym poziomie i tyle telemetrii, by wiedzieć, co dzieje się na produkcji.',
    'layer.infra': 'linux i chmura',
    'layer.data': 'dane',
    'layer.lang': 'języki',
    'layer.services': 'mikroserwisy',
    'layer.arch': 'architektura',
    'layer.quality': 'testy i telemetria',

    'setup.title': 'Działa na <em>NixOS</em>',
    'setup.p1': 'Używam NixOS na dwóch maszynach, nietzsche (desktop) i dostoyevsky (laptop), zbudowanych z jednego flake’a: kompozytor Wayland niri z powłoką Noctalia, kitty, LazyVim i reszta moich narzędzi.',
    'setup.p2': 'Moduły to pliki flake-parts importowane automatycznie, dotfiles są linkowane na miejsce bez Home Managera, a przypięte wejścia sprawiają, że ta sama konfiguracja zawsze buduje ten sam system. Jedna paleta kolorów stylizuje terminal, GTK, Qt, Neovima i tę stronę.',
    'setup.config': 'Zobacz konfigurację',
    'setup.alt': 'Wynik fastfetch w kitty: NixOS 26.05 z kompozytorem niri na AMD Ryzen 5 7500F i Radeon RX 7700 XT',

    'posts.label': '<span>//</span>Blog',
    'posts.latest': 'Najnowsze <em>wpisy</em>',
    'posts.all': 'Wszystkie wpisy &rarr;',
    'posts.title': 'Wpisy',
    'posts.none': 'Na razie nie ma wpisów.',
    'post.loading': 'Wczytywanie…',

    'contact.label': '<span>06</span>Kontakt',
    'contact.title': 'Szukasz <em>programisty</em>?',
    'contact.lead': 'Najszybciej skontaktujesz się ze mną mailowo.',
    'contact.location': 'Koszalin, Polska · otwarty na pracę zdalną',

    'collection.title': 'Kolekcja',
    'collection.intro': 'Co kolekcjonuję i tworzę po pracy: płyty winylowe, zegarki mechaniczne, retro gry i pixel art.',
    'back.home': '&larr; Strona główna',

    'footer.gopher': 'Projekt gophera Go: Renée French,',
    'footer.source': 'kod źródłowy',
    'footer.top': 'do góry &uarr;',
    'footer.home': 'strona główna',

    'js.copy': 'Kopiuj',
    'js.copied': 'Skopiowano',
    'js.failed': 'Błąd',
    'js.postsError': 'Nie udało się wczytać wpisów.',
    'js.missing': 'Nie znaleziono wpisu',
    'js.missingText': 'Wpis, którego szukasz, nie istnieje.',
    'js.allPosts': '&larr; Wszystkie wpisy',
    'js.minRead': 'min czytania',
    'js.photosSoon': 'Zdjęcia już wkrótce.',
    'js.collectionError': 'Nie udało się wczytać kolekcji.',
  },

  de: {
    'title.home': 'Maciej Pałubicki · .NET-Softwareentwickler',
    'title.posts': 'Beiträge · Maciej Pałubicki',
    'title.post': 'Beitrag · Maciej Pałubicki',
    'title.collection': 'Sammlung · Maciej Pałubicki',
    'skip': 'Zum Inhalt springen',
    'menu': 'Menü',
    'language': 'Sprache',
    'nav.about': 'über mich',
    'nav.experience': 'erfahrung',
    'nav.projects': 'projekte',
    'nav.stack': 'stack',
    'nav.contact': 'Kontakt',

    'hero.lead': '.NET-Softwareentwickler bei i4B in Koszalin: Ich baue ASP.NET-Core-APIs und gRPC-Microservices auf dem neuesten .NET, dazu APIs in Python und Go.',
    'hero.email': 'E-Mail schreiben',
    'strip.role': 'Rolle <span>Softwareentwickler @ i4B</span>',
    'strip.status': 'Status <span>Nicht auf Jobsuche · offen für Gespräche</span>',

    'about.label': '<span>01</span>Über mich',
    'about.title': 'Über <em>mich</em>',
    'about.statement': 'Mit .NET habe ich 2022 als Trainee bei GlobalLogic angefangen, 2023 kam ich als Praktikant zu i4B, wo ich heute als Softwareentwickler arbeite. Mein Schwerpunkt ist Backend-Architektur in C#, immer auf dem neuesten .NET: Ich entwickle damit seit .NET 6.',
    'about.more': 'Neben .NET schreibe ich Python, mit Django und FastAPI für APIs, und Go, mit Gin für Web-APIs und Bubble Tea für Terminal-Apps. Zurzeit lerne ich Blazor, um Frontends zu bauen, ohne den .NET-Stack zu verlassen. Privat sammle ich Schallplatten und mechanische Uhren, spiele Retro-Games (meist Nintendo) und mache Pixel-Art.',
    'stat.requests': 'Anfragen pro Tag an meine gRPC-API',
    'stat.since': 'entwickle mit .NET seit',
    'stat.languages': 'Sprachen in Produktion: C#, Python, TypeScript',
    'stat.machines': 'NixOS-Rechner aus einem Flake',

    'exp.label': '<span>02</span>Erfahrung',
    'exp.title': 'Berufliche <em>Stationen</em>',
    'job.intern': 'Praktikant',
    'job1.date': 'Okt. 2023 – heute',
    'job2.date': 'Juli 2023 – Okt. 2023',
    'job3.date': 'Juli 2022 – Sep. 2022',
    'job1.meta': 'Koszalin, Polen · Vollzeit · Hybrid',
    'job2.meta': 'Koszalin, Polen · Vor Ort',
    'job3.meta': 'Koszalin, Polen · Praktikum',
    'job1.body': 'Backend-Services in C# und .NET auf SQL-Datenbanken. Ich verantworte die Backend-Architektur, Integrationen mit anderen Systemen und die laufende Wartung.',
    'job2.body': 'Backend-Entwicklung und Arbeit mit SQL-Datenbanken in C# und .NET.',
    'job3.body': 'Backend-Projekte in C# und .NET, im Alltag mit Git, SQL und Jira.',

    'proj.label': '<span>03</span>Projekte',
    'proj.title': 'Was ich <em>gebaut</em> habe',
    'proj.all': 'Alle Repositories',
    'label.work': 'Beruflich',
    'label.plugin': 'JetBrains-Plugin',
    'proj.github': 'Auf GitHub ansehen <span aria-hidden="true">&rarr;</span>',
    'proj.grpc.title': 'gRPC-API in .NET',
    'proj.grpc.text': 'gRPC-Service für die Kommunikation zwischen Microservices mit über einer Million Anfragen pro Tag.',
    'proj.glue.title': 'ETL-Pipeline mit AWS Glue',
    'proj.glue.text': 'Pipeline, die große Datenmengen mit AWS-Glue-Jobs verarbeitet; Lambda-Funktionen automatisieren die Transform- und Load-Schritte.',
    'proj.vt.alt': 'Vertical-Tabs-Panel in einer JetBrains-IDE mit offenen Dateien, gruppiert nach .NET-Projekten',
    'proj.vt.text': 'Navigator für offene Dateien in JetBrains-IDEs. Er dockt links an, gruppiert Dateien nach IDE-Modul oder .NET-Projekt und kann die Tab-Leiste des Editors ersetzen.',
    'proj.blog.title': 'Django-Blog',
    'proj.blog.text': 'Blog-Anwendung mit Benutzerkonten, Rich-Text-Editor und Kommentaren.',
    'proj.bookstore.text': '.NET Web API zur Verwaltung der Autoren einer Buchhandlung, mit PostgreSQL und in Docker betrieben.',
    'proj.arduino.text': '.NET-MAUI-App, die sich mit einem Arduino-Thermometer verbindet und dessen Messwerte anzeigt.',
    'proj.nix.alt': 'niri-Desktop mit fastfetch, Neovim beim Bearbeiten der kitty-Farbpalette und dem Noctalia-App-Launcher',
    'proj.nix.text': 'Meine NixOS-Systeme und Dotfiles: Ein Flake baut Desktop und Laptop, gestaltet mit der Farbpalette dieser Seite.',

    'stack.label': '<span>04</span>Stack',
    'stack.title': 'Womit ich <em>arbeite</em>',
    'stack.all.title': 'Der ganze Stack',
    'stack.all.text': 'Alles, womit ich arbeite, von den Tests bis hinunter zum Betriebssystem. Scrollen Sie weiter, und jede Schicht leuchtet auf.',
    'stack.infra.title': 'Linux &amp; Cloud',
    'stack.infra.text': 'Wo der Code läuft: Container, Cloud-Dienste und die Pipelines, die sie ausliefern.',
    'stack.data.title': 'Daten',
    'stack.data.text': 'Vor allem relationale Datenbanken: Schema-Design und Query-Optimierung auf SQL Server und PostgreSQL, dazu Redis.',
    'stack.lang.title': 'Sprachen',
    'stack.lang.text': 'Im Alltag C# auf dem neuesten .NET, wie schon seit .NET 6. Daneben Python und Go, und TypeScript, wenn eine Aufgabe es erfordert.',
    'stack.web.text': 'HTTP-APIs und Echtzeit-Endpunkte mit integrierter Authentifizierung und Autorisierung.',
    'stack.web.tech': 'Web API · MVC · minimal APIs · SignalR · ASP.NET Core Identity · JWT · OAuth 2.0 / OpenID Connect · Blazor (lerne ich gerade)',
    'stack.services.text': 'Microservices, die über gRPC und Message Queues miteinander kommunizieren.',
    'stack.arch.title': 'Architektur',
    'stack.arch.text': 'Eine Struktur, die eine Codebasis auch beim Wachsen leicht änderbar hält.',
    'stack.quality.title': 'Tests &amp; Telemetrie',
    'stack.quality.text': 'Tests auf jeder Ebene und genug Telemetrie, um zu wissen, was in Produktion passiert.',
    'layer.data': 'daten',
    'layer.lang': 'sprachen',
    'layer.arch': 'architektur',
    'layer.quality': 'tests &amp; telemetrie',

    'setup.title': 'Läuft auf <em>NixOS</em>',
    'setup.p1': 'Ich nutze NixOS auf zwei Rechnern, nietzsche (Desktop) und dostoyevsky (Laptop), beide aus einem Flake gebaut: der Wayland-Compositor niri mit der Noctalia-Shell, kitty, LazyVim und der Rest meiner Tools.',
    'setup.p2': 'Module sind flake-parts-Dateien, die automatisch importiert werden, Dotfiles werden ohne Home Manager verlinkt, und gepinnte Inputs sorgen dafür, dass dieselbe Konfiguration immer dasselbe System baut. Eine Farbpalette gestaltet Terminal, GTK, Qt, Neovim und diese Seite.',
    'setup.config': 'Zur Konfiguration',
    'setup.alt': 'fastfetch-Ausgabe in kitty: NixOS 26.05 mit dem Compositor niri auf einem AMD Ryzen 5 7500F und einer Radeon RX 7700 XT',

    'posts.label': '<span>//</span>Blog',
    'posts.latest': 'Neueste <em>Beiträge</em>',
    'posts.all': 'Alle Beiträge &rarr;',
    'posts.title': 'Beiträge',
    'posts.none': 'Noch keine Beiträge.',
    'post.loading': 'Wird geladen…',

    'contact.label': '<span>06</span>Kontakt',
    'contact.title': 'Suchen Sie einen <em>Entwickler</em>?',
    'contact.lead': 'Am schnellsten erreichen Sie mich per E-Mail.',
    'contact.location': 'Koszalin, Polen · offen für Remote-Arbeit',

    'collection.title': 'Sammlung',
    'collection.intro': 'Was ich außerhalb der Arbeit sammle und mache: Schallplatten, mechanische Uhren, Retro-Games und Pixel-Art.',
    'back.home': '&larr; Startseite',

    'footer.gopher': 'Go-Gopher-Design von Renée French,',
    'footer.source': 'Quellcode',
    'footer.top': 'nach oben &uarr;',
    'footer.home': 'Startseite',

    'js.copy': 'Kopieren',
    'js.copied': 'Kopiert',
    'js.failed': 'Fehler',
    'js.postsError': 'Beiträge konnten nicht geladen werden.',
    'js.missing': 'Beitrag nicht gefunden',
    'js.missingText': 'Der gesuchte Beitrag existiert nicht.',
    'js.allPosts': '&larr; Alle Beiträge',
    'js.minRead': 'Min. Lesezeit',
    'js.photosSoon': 'Fotos folgen bald.',
    'js.collectionError': 'Die Sammlung konnte nicht geladen werden.',
  },
};

const storage = {
  get() { try { return localStorage.getItem('lang'); } catch { return null; } },
  set(value) { try { localStorage.setItem('lang', value); } catch { /* private mode: ?lang= still works */ } },
};

const supported = code => code === 'en' || code in strings;
const fromUrl = new URLSearchParams(location.search).get('lang');
if (supported(fromUrl)) storage.set(fromUrl);

export const lang = [fromUrl, storage.get()].find(supported) ?? 'en';

// For text built in JavaScript: the English is passed in, so English needs no table
export const t = (key, english) => strings[lang]?.[key] ?? english;

document.documentElement.lang = lang;

if (lang !== 'en') {
  for (const element of document.querySelectorAll('[data-i18n]')) {
    const text = strings[lang][element.dataset.i18n];
    if (text !== undefined) element.innerHTML = text;
  }
  for (const element of document.querySelectorAll('[data-i18n-alt]')) {
    element.alt = t(element.dataset.i18nAlt, element.alt);
  }
  for (const element of document.querySelectorAll('[data-i18n-label]')) {
    element.setAttribute('aria-label', t(element.dataset.i18nLabel, element.getAttribute('aria-label')));
  }
}

// Switching reloads the page with ?lang=, keeping the rest of the URL (post slug, #section)
for (const button of document.querySelectorAll('[data-lang]')) {
  button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
  button.addEventListener('click', () => {
    const url = new URL(location.href);
    url.searchParams.set('lang', button.dataset.lang);
    storage.set(button.dataset.lang);
    location.assign(url);
  });
}
