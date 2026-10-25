Pikograph — графы связей для OSINT

ЗАПУСК
1. Распакуйте архив (не открывайте файлы прямо из архива).
2. Откройте index.html в браузере. Сервер не нужен.
   pikograph-single.html — то же самое одним файлом (удобно отправить на телефон).

ФАЙЛЫ
index.html, style.css, app.js — сайт
favicon.svg, favicon-32.png, apple-touch-icon.png — иконка вкладки

ПОИСК
Кнопка «Искать» в карточке создаёт рядом блок «Результаты поиска». Результаты появляются по мере ответа источников.
Используются только открытые API без ключей и регистрации (около 200 запросов к ~100 сервисам), опрашиваются пачками по 12:
  ФИО — Wikipedia (12 языков), Wikidata, DBpedia, OpenAlex, ORCID, Crossref, Semantic Scholar, DBLP, INSPIRE-HEP,
        Europe PMC, Open Library, MusicBrainz, TVmaze, iTunes, Project Gutenberg, GDELT (новости), Bluesky, Stack Exchange, HN, Reddit
  Никнейм — GitHub, GitLab, Codeberg, Bitbucket, Gitee, Launchpad, Docker Hub, npm, crates.io, Hugging Face, Reddit, HN, Lobsters,
        Mastodon (10 серверов), Lemmy (5), Bluesky, DEV, Keybase, Lichess, Chess.com, Codeforces, Scratch, MyAnimeList, Kitsu,
        Speedrun.com, Minecraft, Dailymotion, Gravatar, участники Wikipedia/Commons/Wikidata, Stack Exchange (8 сайтов)
  E-mail — Gravatar, EmailRep, XposedOrNot, Disify, EVA, GitHub (публичные e-mail в профилях и коммитах), ORCID, MX/DMARC,
        RDAP домена, утечки домена (HIBP, XposedOrNot), GDELT, Internet Archive, Lemmy
  Домен / IP — RDAP, DNS (Google и Cloudflare), DMARC, CT-логи, Wayback и Wayback CDX, Shodan InternetDB, RIPEstat, AlienVault OTX,
        mnemonic pDNS, urlscan.io, Tranco, GreyNoise, GeoJS, ipapi.co, ipinfo.io, ipwhois.app, ip.guide, FreeIPAPI, ipapi.is, HIBP
  Организация — Wikipedia, Wikidata, DBpedia, GLEIF, ROR, OpenAlex, Crossref Funders, реестры Франции и Норвегии, GitHub, Docker Hub, GDELT
  Адрес — OpenStreetMap, Photon, Open-Meteo, BAN (Франция), Zippopotam (US/DE/FR/ES/IT/PL), Postcodes.io (UK), REST Countries, Wikipedia
  Фото — Wikimedia Commons, Openverse, NASA, The Met, Art Institute of Chicago, Library of Congress, Internet Archive
  Телефон — локальный разбор страны и кода региона + упоминания (GitHub, HN, Reddit, GDELT, Stack Overflow, Lemmy, Internet Archive);
        открытых API с владельцем номера без ключа нет
  Общий — Wikipedia (9 языков), сестринские проекты, Wikidata, DBpedia, GDELT, Open Library, Crossref, Europe PMC, Zenodo, TVmaze,
        Stack Overflow, GitHub, HN, Reddit, Lemmy, Internet Archive
Часть сервисов может отказать из-за лимитов или CORS — такие источники просто пропускаются, остальные работают.
В конце списка всегда есть ссылки для ручного поиска (Google, DuckDuckGo, Bing, Yandex и профильные сервисы).
Кнопка «+ в граф» создаёт карточку с заголовком и описанием найденного (с названием источника), а не со ссылкой.
Запрос уходит на перечисленные сервисы. Свой SearXNG (настройки) можно добавить как ещё один источник.

АДАПТАЦИЯ
Сайт определяет телефон / планшет / компьютер по типу ввода (касание или мышь) и ширине экрана, без юзерагента и фингерпринта.
Дизайн один, но размеры, панели и плотность подстраиваются; тема берётся из системной, на слабых устройствах отключаются размытие и анимация.
Свои настройки на каждом устройстве сохраняются отдельно; «Сбросить всё» возвращает профиль устройства.

Данные проектов хранятся только в браузере. Экспорт/импорт — через JSON.
