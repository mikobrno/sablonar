/*
  # Vložení vzorových dat

  1. Vzorové budovy
  2. Statické proměnné
  3. E-mailové šablony
*/

-- Vložení vzorových budov
INSERT INTO buildings (name, data) VALUES
(
  'Dřevařská 851/4, Brno',
  '{
    "plny_nazev": "Dřevařská 851/4, Brno",
    "zkraceny_nazev": "Dřevařská",
    "osloveni_obecne": "Dobrý den,",
    "nazev_svj": "Společenství vlastníků jednotek Dřevařská 4, Brno",
    "osloveni_clenu": "Vážení členové Společenství vlastníků jednotek Dřevařská 4",
    "poznamky": "Kontakt: p. Novák",
    "adresa": "Dřevařská 851/4, 602 00 Brno",
    "ico": "12345678",
    "telefon": "+420 123 456 789"
  }'
),
(
  'Knihnická 318, Brno',
  '{
    "plny_nazev": "Knihnická 318, Brno",
    "zkraceny_nazev": "Knihnická",
    "osloveni_obecne": "Dobrý den, paní Kučerová,",
    "nazev_svj": "Společenství vlastníků pro dům Neptun",
    "osloveni_clenu": "Vážení členové Společenství vlastníků pro dům Neptun",
    "poznamky": "Nová budova",
    "adresa": "Knihnická 318, 602 00 Brno",
    "ico": "87654321",
    "telefon": "+420 987 654 321"
  }'
),
(
  'Vídeňská 125, Brno',
  '{
    "plny_nazev": "Vídeňská 125, Brno",
    "zkraceny_nazev": "Vídeňská",
    "osloveni_obecne": "Dobrý den,",
    "nazev_svj": "Bytové družstvo Vídeňská 125",
    "osloveni_clenu": "Vážení členové bytového družstva",
    "poznamky": "Historická budova",
    "adresa": "Vídeňská 125, 602 00 Brno",
    "ico": "11223344",
    "telefon": "+420 555 666 777"
  }'
);

-- Vložení statických proměnných
INSERT INTO static_variables (name, value, description) VALUES
('podpis_spravce', 'S pozdravem,\nJan Novák\nSprávce nemovitostí\nTel: +420 123 456 789\nEmail: spravce@nemovitosti.cz', 'Standardní podpis správce'),
('nazev_spolecnosti', 'Správa nemovitostí s.r.o.', 'Název správcovské společnosti'),
('kontaktni_email', 'info@sprava-nemovitosti.cz', 'Hlavní kontaktní e-mail'),
('aktualni_datum', '2024-01-15', 'Aktuální datum');

-- Vložení e-mailových šablon
INSERT INTO email_templates (name, category, subject, body, used_variables) VALUES
(
  'Upozornění na vysokou spotřebu vody',
  'upozorneni',
  '❗️ {{zkraceny_nazev}} - Upozornění na vysokou spotřebu vody',
  '<p>{{osloveni_obecne}}</p>

<p>{{osloveni_clenu}},</p>

<p>dovolte mi upozornit Vás na neobvykle vysokou spotřebu vody v budově {{plny_nazev}} za poslední měsíc.</p>

<p>Spotřeba vzrostla oproti stejnému období minulého roku o více než 30%. Prosím, zkontrolujte:</p>

<ul>
<li>Možné úniky vody v bytech</li>
<li>Funkčnost všech uzávěrů</li>
<li>Stav společných rozvodů</li>
</ul>

<p>V případě zjištění problému mě prosím kontaktujte na e-mailu {{kontaktni_email}} nebo telefonicky na {{telefon}}.</p>

<p>Děkuji za pozornost a spolupráci.</p>

<p>{{podpis_spravce}}</p>',
  ARRAY['osloveni_obecne', 'osloveni_clenu', 'plny_nazev', 'zkraceny_nazev', 'kontaktni_email', 'telefon', 'podpis_spravce']
),
(
  'Pozvánka na schůzi vlastníků',
  'pozvanka',
  '📅 {{zkraceny_nazev}} - Pozvánka na schůzi vlastníků',
  '<p>{{osloveni_obecne}}</p>

<p>{{osloveni_clenu}},</p>

<p>tímto Vás zvu na řádnou schůzi {{nazev_svj}}, která se bude konat:</p>

<p><strong>Datum:</strong> [DOPLNIT DATUM]<br>
<strong>Čas:</strong> 18:00<br>
<strong>Místo:</strong> {{adresa}}, společná místnost</p>

<p><strong>Program schůze:</strong></p>
<ol>
<li>Zahájení, prezence, volba předsednictva</li>
<li>Zpráva o hospodaření za rok 2024</li>
<li>Plán oprav a investic na rok 2025</li>
<li>Různé a diskuse</li>
<li>Závěr</li>
</ol>

<p>Prosím o potvrzení účasti odpovědí na tento e-mail.</p>

<p>Těším se na Vaši účast.</p>

<p>{{podpis_spravce}}</p>',
  ARRAY['osloveni_obecne', 'osloveni_clenu', 'nazev_svj', 'zkraceny_nazev', 'adresa', 'podpis_spravce']
),
(
  'Vyúčtování nákladů na vytápění',
  'vyuctovani',
  '🧾 {{zkraceny_nazev}} - Vyúčtování nákladů na vytápění',
  '<p>{{osloveni_obecne}}</p>

<p>{{osloveni_clenu}},</p>

<p>zasíláme Vám vyúčtování nákladů na vytápění pro budovu {{plny_nazev}} za uplynulé období.</p>

<p><strong>Základní informace:</strong></p>
<ul>
<li>Budova: {{plny_nazev}}</li>
<li>IČO: {{ico}}</li>
<li>Datum vyúčtování: {{aktualni_datum}}</li>
</ul>

<p><strong>Souhrnné informace:</strong></p>
<ul>
<li>Celkové náklady na vytápění: bude doplněno</li>
<li>Průměrná cena za m²: bude doplněno</li>
<li>Způsob rozdělení: dle podlahové plochy</li>
</ul>

<p>Detailní vyúčtování podle jednotlivých bytů naleznete v příloze tohoto e-mailu.</p>

<p>Případné dotazy směřujte na {{kontaktni_email}} nebo telefonicky na {{telefon}}.</p>

<p>{{podpis_spravce}}</p>',
  ARRAY['osloveni_obecne', 'osloveni_clenu', 'plny_nazev', 'zkraceny_nazev', 'ico', 'aktualni_datum', 'kontaktni_email', 'telefon', 'podpis_spravce']
);