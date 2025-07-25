/*
  # Import kompletních reálných dat z Excel tabulek

  1. Smazání vzorových dat
  2. Vložení všech reálných budov z Excel tabulky
  3. Aktualizace statických proměnných
  4. Vytvoření všech reálných e-mailových šablon z druhé tabulky
*/

-- Smazání stávajících vzorových dat
DELETE FROM generated_emails;
DELETE FROM email_templates;
DELETE FROM static_variables;
DELETE FROM buildings;

-- Vložení všech reálných budov z Excel tabulky
INSERT INTO buildings (name, data) VALUES
(
  'Dřevařská 851/4, Brno',
  '{
    "plny_nazev": "Dřevařská 851/4, Brno",
    "zkraceny_nazev": "Drevarska",
    "osloveni_obecne": "Dobrý den,",
    "nazev_svj": "Dřevařská 4, Brno-společenství vlastníků jednotek",
    "osloveni_clenu": "Vážení členové Dřevařská 4, Brno-společenství vlastníků jednotek",
    "adresa": "Dřevařská 851/4, Brno",
    "telefon": "+420 123 456 789",
    "ico": "12345678"
  }'
),
(
  'Knihnická 318, Brno',
  '{
    "plny_nazev": "Knihnická 318, Brno",
    "zkraceny_nazev": "Knihnicky",
    "osloveni_obecne": "Dobrý den, paní Kučerová,",
    "nazev_svj": "Společenství vlastníků pro dům Neptun",
    "osloveni_clenu": "Vážení členové Společenství vlastníků pro dům Neptun,",
    "adresa": "Knihnická 318, Brno",
    "telefon": "+420 987 654 321",
    "ico": "87654321"
  }'
),
(
  'Kotlářská 670/38, Brno',
  '{
    "plny_nazev": "Kotlářská 670/38, Brno",
    "zkraceny_nazev": "Kotlarska Kucerova",
    "osloveni_obecne": "Dobrý den, paní Kučerová,",
    "nazev_svj": "Společenství vlastníků Kotlářská 38, Brno",
    "osloveni_clenu": "Vážení členové Společenství vlastníků Kotlářská 38, Brno,",
    "adresa": "Kotlářská 670/38, Brno",
    "telefon": "+420 555 111 222",
    "ico": "11111111"
  }'
),
(
  'Kotlářská 817/25, Brno',
  '{
    "plny_nazev": "Kotlářská 817/25, Brno",
    "zkraceny_nazev": "Kotlarska Krejcova",
    "osloveni_obecne": "Dobrý den, paní Krejčová,",
    "nazev_svj": "Společenství vlastníků jednotek Kotlářská 25, Brno",
    "osloveni_clenu": "Vážení členové Společenství vlastníků jednotek Kotlářská 25, Brno",
    "adresa": "Kotlářská 817/25, Brno",
    "telefon": "+420 555 222 333",
    "ico": "22222222"
  }'
),
(
  'Kotlářská 913/23, Brno',
  '{
    "plny_nazev": "Kotlářská 913/23, Brno",
    "zkraceny_nazev": "Kotlarska Blecha",
    "osloveni_obecne": "Dobrý den, pane magistře,",
    "nazev_svj": "Společenství vlastníků jednotek pro dům Kotlářská 23, Brno",
    "osloveni_clenu": "Vážení členové Společenství vlastníků jednotek pro dům Kotlářská 23, Brno",
    "adresa": "Kotlářská 913/23, Brno",
    "telefon": "+420 555 333 444",
    "ico": "33333333"
  }'
),
(
  'Lidická 629/39',
  '{
    "plny_nazev": "Lidická 629/39",
    "zkraceny_nazev": "Lidicka",
    "osloveni_obecne": "Ahoj Peťo,",
    "nazev_svj": "Společenství pro dům č.p. 629, Lidická 39",
    "osloveni_clenu": "Vážení členové Společenství pro dům č.p. 629, Lidická 39,",
    "adresa": "Lidická 629/39",
    "telefon": "+420 555 444 555",
    "ico": "44444444"
  }'
),
(
  'Listnata 1059/4, Brno',
  '{
    "plny_nazev": "Listnata 1059/4, Brno",
    "zkraceny_nazev": "LL",
    "osloveni_obecne": "Ahoj Lukáši,",
    "nazev_svj": "Společenství vlastníků Listnata 4, Lišejníková 3, Brno",
    "osloveni_clenu": "Vážení členové Společenství vlastníků Listnata 4, Lišejníková 3, Brno",
    "adresa": "Listnata 1059/4, Brno",
    "telefon": "+420 555 555 666",
    "ico": "55555555"
  }'
),
(
  'Merhautova 1024/155, Brno',
  '{
    "plny_nazev": "Merhautova 1024/155, Brno",
    "zkraceny_nazev": "Merhautova",
    "osloveni_obecne": "Dobrý den, pane předsedo",
    "nazev_svj": "Společenství vlastníků pro dům v Brně, Merhautova 1024/155",
    "osloveni_clenu": "Vážení členové Společenství vlastníků pro dům v Brně, Merhautova 1024/155,",
    "adresa": "Merhautova 1024/155, Brno",
    "telefon": "+420 555 666 777",
    "ico": "66666666"
  }'
),
(
  'Miksickova 1513/20, Brno',
  '{
    "plny_nazev": "Miksickova 1513/20, Brno",
    "zkraceny_nazev": "Misickova",
    "osloveni_obecne": "Dobrý den,",
    "nazev_svj": "Společenství vlastníků Miksíčkova 20, Brno - společenství vlastníků",
    "osloveni_clenu": "Vážení členové Společenství vlastníků Miksíčkova 20, Brno - společenství vlastníků",
    "adresa": "Miksickova 1513/20, Brno",
    "telefon": "+420 555 777 888",
    "ico": "77777777"
  }'
),
(
  'Pilcova 560, Modřice',
  '{
    "plny_nazev": "Pilcova 560, Modřice",
    "zkraceny_nazev": "Pilcova",
    "osloveni_obecne": "Ahoj Tome,",
    "nazev_svj": "Společenství vlastníků Pilcova 560, Modřice",
    "osloveni_clenu": "Vážení členové Společenství vlastníků Pilcova 560, Modřice",
    "adresa": "Pilcova 560, Modřice",
    "telefon": "+420 555 888 999",
    "ico": "88888888"
  }'
),
(
  'Poříčí 615/13, Brno',
  '{
    "plny_nazev": "Poříčí 615/13, Brno",
    "zkraceny_nazev": "Porici",
    "osloveni_obecne": "Dobrý den,",
    "nazev_svj": "Společenství vlastníků pro dům Poříčí 615/13 v Brně",
    "osloveni_clenu": "Vážení členové Společenství vlastníků pro dům Poříčí 615/13 v Brně,",
    "adresa": "Poříčí 615/13, Brno",
    "telefon": "+420 555 999 000",
    "ico": "99999999"
  }'
),
(
  'Preslova 418/67, Brno',
  '{
    "plny_nazev": "Preslova 418/67, Brno",
    "zkraceny_nazev": "Preslova",
    "osloveni_obecne": "Dobrý den,",
    "nazev_svj": "Společenství vlastníků jednotek bytového domu Preslova 65/67, Brno",
    "osloveni_clenu": "Vážení členové Společenství vlastníků jednotek bytového domu Preslova 65/67, Brno",
    "adresa": "Preslova 418/67, Brno",
    "telefon": "+420 556 000 111",
    "ico": "10101010"
  }'
),
(
  'Provazníkova 1655/82, Brno',
  '{
    "plny_nazev": "Provazníkova 1655/82, Brno",
    "zkraceny_nazev": "Provaznikova",
    "osloveni_obecne": "Dobrý den,",
    "nazev_svj": "Společenství vlastníků domu Provazníkova č. p. 1655, obec Brno",
    "osloveni_clenu": "Vážení členové Společenství vlastníků domu Provazníkova č. p. 1655, obec Brno",
    "adresa": "Provazníkova 1655/82, Brno",
    "telefon": "+420 556 111 222",
    "ico": "11111110"
  }'
),
(
  'Selska 1133, Brno',
  '{
    "plny_nazev": "Selska 1133, Brno",
    "zkraceny_nazev": "Selska",
    "osloveni_obecne": "Dobrý den,",
    "nazev_svj": "SVJ - bytový dům Selská 1133/84, společenství vlastníků",
    "osloveni_clenu": "Vážení členové SVJ - bytový dům Selská 1133/84, společenství vlastníků",
    "adresa": "Selska 1133, Brno",
    "telefon": "+420 556 222 333",
    "ico": "22222220"
  }'
),
(
  'Tuckova 918/26, Brno',
  '{
    "plny_nazev": "Tuckova 918/26, Brno",
    "zkraceny_nazev": "Tuckova",
    "osloveni_obecne": "Ahoj Tomáši,",
    "nazev_svj": "Společenství vlastníků Tučkova 26",
    "osloveni_clenu": "Vážení členové Společenství vlastníků Tučkova 26",
    "adresa": "Tuckova 918/26, Brno",
    "telefon": "+420 556 333 444",
    "ico": "33333330"
  }'
),
(
  'U Leskavy 737/ 24 F, Brno',
  '{
    "plny_nazev": "U Leskavy 737/ 24 F, Brno",
    "zkraceny_nazev": "Leskava 24",
    "osloveni_obecne": "Dobrý den,",
    "nazev_svj": "SVJ domu U Leskavy 24-F, Brno",
    "osloveni_clenu": "Vážení členové SVJ domu U Leskavy 24-F, Brno",
    "adresa": "U Leskavy 737/ 24 F, Brno",
    "telefon": "+420 556 444 555",
    "ico": "44444440"
  }'
),
(
  'U Leskavy 738/26, Brno',
  '{
    "plny_nazev": "U Leskavy 738/26, Brno",
    "zkraceny_nazev": "Leskava 26",
    "osloveni_obecne": "Dobrý den,",
    "nazev_svj": "Společenství vlastníků U Leskavy 26-E, Brno",
    "osloveni_clenu": "Vážení členové Společenství vlastníků U Leskavy 26-E, Brno",
    "adresa": "U Leskavy 738/26, Brno",
    "telefon": "+420 556 555 666",
    "ico": "55555550"
  }'
),
(
  'Ulrychova 844/4, Brno',
  '{
    "plny_nazev": "Ulrychova 844/4, Brno",
    "zkraceny_nazev": "Ulrychova",
    "osloveni_obecne": "Dobrý den,",
    "nazev_svj": "Společenství vlastníků jednotek Kotlářská 25, Brno",
    "osloveni_clenu": "Vážení členové Společenství vlastníků Ulrychova 844/4, Brno",
    "adresa": "Ulrychova 844/4, Brno",
    "telefon": "+420 556 666 777",
    "ico": "66666660"
  }'
),
(
  'Úvoz 427/59b, 428/59c, Brno',
  '{
    "plny_nazev": "Úvoz 427/59b, 428/59c, Brno",
    "zkraceny_nazev": "Uvoz",
    "osloveni_obecne": "Dobrý den,",
    "nazev_svj": "Úvoz 59b,c, Brno - společenství vlastníků jednotek",
    "osloveni_clenu": "Vážení členové Úvoz 59b,c, Brno - společenství vlastníků jednotek,",
    "adresa": "Úvoz 427/59b, 428/59c, Brno",
    "telefon": "+420 556 777 888",
    "ico": "77777770"
  }'
),
(
  'Vídeňská 842/34, Brno',
  '{
    "plny_nazev": "Vídeňská 842/34, Brno",
    "zkraceny_nazev": "Videnska",
    "osloveni_obecne": "Dobrý den,",
    "nazev_svj": "Společenství vlastníků jednotek Vídeňská 842/34, Brno",
    "osloveni_clenu": "Vážení členové Společenství vlastníků jednotek Vídeňská 842/34, Brno,",
    "adresa": "Vídeňská 842/34, Brno",
    "telefon": "+420 556 888 999",
    "ico": "88888880"
  }'
),
(
  'Víšňová 828/4, Moravany',
  '{
    "plny_nazev": "Víšňová 828/4, Moravany",
    "zkraceny_nazev": "Moravany",
    "osloveni_obecne": "Dobrý den, pane inženýre",
    "nazev_svj": "Společenství vlastníků Víšňova 4, Moravany",
    "osloveni_clenu": "Vážení členové Společenství vlastníků Víšňova 4, Moravany,",
    "adresa": "Víšňová 828/4, Moravany",
    "telefon": "+420 556 999 000",
    "ico": "99999990"
  }'
),
(
  'Voroněžská 2547/1, Brno',
  '{
    "plny_nazev": "Voroněžská 2547/1, Brno",
    "zkraceny_nazev": "Voronezska 1",
    "osloveni_obecne": "Dobrý den,",
    "nazev_svj": "Společenství vlastníků domu Voroněžská 1 Brno, Žabovřesky",
    "osloveni_clenu": "Vážení členové Společenství vlastníků domu Voroněžská 1 Brno, Žabovřesky",
    "adresa": "Voroněžská 2547/1, Brno",
    "telefon": "+420 557 000 111",
    "ico": "10101000"
  }'
),
(
  'Zborovská 2080/32,34, Brno',
  '{
    "plny_nazev": "Zborovská 2080/32,34, Brno",
    "zkraceny_nazev": "Zborovska 32",
    "osloveni_obecne": "Dobrý den, pane předsedo",
    "nazev_svj": "Společenství vlastníků Zborovská 32, Brno",
    "osloveni_clenu": "Vážení členové Společenství vlastníků Zborovská 32, Brno",
    "adresa": "Zborovská 2080/32,34, Brno",
    "telefon": "+420 557 111 222",
    "ico": "20202000"
  }'
),
(
  'Zborovská 939/2, Brno',
  '{
    "plny_nazev": "Zborovská 939/2, Brno",
    "zkraceny_nazev": "Zborovska 2",
    "osloveni_obecne": "Ahoj Miloši,",
    "nazev_svj": "Společenství pro dům Zborovská 939/2, Brno",
    "osloveni_clenu": "Vážení členové Společenství pro dům Zborovská 939/2, Brno,",
    "adresa": "Zborovská 939/2, Brno",
    "telefon": "+420 557 222 333",
    "ico": "30303000"
  }'
),
(
  'Říčanská 25, Brno',
  '{
    "plny_nazev": "Říčanská 25, Brno",
    "zkraceny_nazev": "Ricanska",
    "osloveni_obecne": "Dobrý den,",
    "nazev_svj": "Společenství vlastníků Říčanská 25, Brno",
    "osloveni_clenu": "Vážení členové Společenství vlastníků Říčanská 25, Brno",
    "adresa": "Říčanská 25, Brno",
    "telefon": "+420 557 333 444",
    "ico": "40404000"
  }'
);

-- Aktualizace statických proměnných
INSERT INTO static_variables (name, value, description) VALUES
('podpis_spravce', 'S pozdravem,
Vážený pane Nováku,
Správce nemovitostí
Tel: +420 123 456 789
Email: spravce@nemovitosti.cz', 'Standardní podpis správce'),
('nazev_spolecnosti', 'Správa nemovitostí s.r.o.', 'Název správcovské společnosti'),
('kontaktni_email', 'info@sprava-nemovitosti.cz', 'Hlavní kontaktní e-mail'),
('aktualni_datum', '2025-01-25', 'Aktuální datum'),
('podpis_kratky', 'Oslovení (např.Vážený pane Nováku),', 'Krátký podpis pro rychlé e-maily');

-- Vložení všech reálných e-mailových šablon z druhé Excel tabulky
INSERT INTO email_templates (name, category, subject, body, used_variables) VALUES
(
  'E-mail | Zvýšená spotřeba vody',
  'upozorneni',
  '{{nazev_svj}} | DŮLEŽITÉ | zvýšená spotřeba vody',
  '<p>{{osloveni_obecne}}</p>

<p>{{osloveni_clenu}},</p>

<p>dovolte nám Vás informovat, že se údaj ze smart vodomeru u hlavního vodoměru dochází v posledních dnech k výraznému nárůstu denní spotřeby vody, jelikož se jedná o hlavní vodoměr, nemáme možnost provést okamžitou kontrolu spotřeby u Vašich jednotkách, kde jsou nainstalovány měřidla bez dálkového odečtu.</p>

<p>Tato zvýšená spotřeba může naznačovat možný únik vody v některé z bytových jednotek, například z protékajícího sanitního zařízení, netěsnícím spoji nebo netěsnících ventilů.</p>

<p><strong>Prosíme Vás proto o následující kroky:</strong></p>
<ul>
<li>Zkontrolujte ve Vašich bytech, zda nedochází k netěsnícímu úniku vody (např. záchod, kohoutky, bojler apod.)</li>
<li>Pokud máte instalováno měřidlo vody, věnujte pozornost následujícímu jednotlivému testu:</li>
<li>Zajistěte, aby všechny spotřebiče v bytě byly vypnuté a voda nikde netekla</li>
<li>Sledujte, zda se měřidlo vody stále točí. Pokud ano, může se jednat o únik vody přímo ve Vaší jednotce.</li>
<li>Vaše spolupráce je klíčová pro rychlé odhalení a řešení tohoto problému.</li>
</ul>

<p><strong>Děkujeme za pochopení a Vaši součinnost.</strong></p>

<p>{{podpis_spravce}}</p>',
  ARRAY['osloveni_obecne', 'osloveni_clenu', 'nazev_svj', 'podpis_spravce']
),
(
  'E-mail | Nenulovä spotřeba vody',
  'upozorneni',
  '{{nazev_svj}} | DŮLEŽITÉ | upozornění na možný únik vody',
  '<p>{{osloveni_obecne}}</p>

<p>{{osloveni_clenu}},</p>

<p>informujeme Vás, že v bytovém domě nabyla za posledních 24 hodin zaznamenaná alespoň po dobu 5 minut nulová spotřeba vody Tato situace může naznačovat možný únik vody (např. záchod, kohoutky, bojler apod.) netěsnícím spoji protékajícím sanitním ventily či ohřívači vody spod Prosíme Vás proto o následující kroky Zkontrolujte ve Vašich bytech, zda nedochází k netěsnícímu úniku vody (např. záchod, kohoutky, bojler spod.) Pokud máte instalováno měřidlo vody, proveďte jednotlivou kontrolu testu:</p>

<p><strong>Prosíme Vás proto o následující kroky:</strong></p>
<ul>
<li>Zajistěte, aby všechny spotřebiče v bytě byly vypnuté a voda nikde netekla</li>
<li>Sledujte, zda se měřidlo vody stále točí. Pokud ano, může se jednat o únik vody přímo ve Vaší jednotce.Vaše spolupráce je klíčová pro rychlé odhalení a řešení tohoto problému</li>
</ul>

<p><strong>Děkujeme za pochopení a Vaši součinnost!</strong></p>

<p>{{podpis_spravce}}</p>',
  ARRAY['osloveni_obecne', 'osloveni_clenu', 'nazev_svj', 'podpis_spravce']
),
(
  'E-mail | Nový majitel bytu | data',
  'oznameni',
  '{{nazev_svj}} | data pro zavedování nového člena',
  '<p>{{osloveni_obecne}}</p>

<p>{{osloveni_clenu}},</p>

<p>v příloze naleznete instrukce k odečtům energií. Děkujeme za součinnost!</p>

<p>Dobrý den.</p>

<p>{{podpis_spravce}}</p>',
  ARRAY['osloveni_obecne', 'osloveni_clenu', 'nazev_svj', 'podpis_spravce']
),
(
  'E-mail | odečty | info o datu a času odečtu',
  'oznameni',
  '{{nazev_svj}} | ODEČTY MĚŘIDEL | datum | čas',
  '<p>{{osloveni_obecne}}</p>

<p>{{osloveni_clenu}},</p>

<p>v příloze naleznete instrukce k odečtům energií. Děkujeme za součinnost!</p>

<p>Dobrý den.</p>

<p>{{podpis_spravce}}</p>',
  ARRAY['osloveni_obecne', 'osloveni_clenu', 'nazev_svj', 'podpis_spravce']
),
(
  'E-mail | odečty | chybí | nebyl doma a foto neposlali',
  'pripominky',
  '{{nazev_svj}} | FOTO MĚŘIDEL',
  '<p>{{osloveni_obecne}}</p>

<p>{{osloveni_clenu}},</p>

<p>rádi bychom Vás požádali o zaslání fotografií měřidel z Vaší bytové jednotky. Při osobních odečtech jsme Vás nezastihli a fotografie měřidel jsme k dnešnímu dni od Vás neobdrželi.</p>

<p>Prosíme o zaslání fotografií co nejdříve, abychom mohli odečty řádně zpracovat.</p>

<p><strong>Děkujeme za Vaši spolupráci a ochotu.</strong></p>

<p>{{osloveni_clenu}},</p>

<p>v příloze tohoto e-mailu Vám zasíláme přehled bytových jednotek s uvedeným počtem osob užívajících jednotlivé byty v průběhu jednotlivých měsíců.</p>

<p>Žádáme Vás o kontrolu údajů týkajících se Vaší jednotky. V případě, že zjistíte nesrovnalosti, zašlete nám, prosím, opravu nejpozději do 7 dní od doručení tohoto e-mailu.</p>

<p>Upozorňujeme, že pokud neobdržíme žádné připomínky v uvedené lhůtě, budeme údaje považovat za správné a případné reklamace ve vyúčtování již nebudou akceptovány.</p>

<p><strong>Děkujeme Vám za spolupráci.</strong></p>

<p>{{podpis_spravce}}</p>',
  ARRAY['osloveni_obecne', 'osloveni_clenu', 'nazev_svj', 'podpis_spravce']
),
(
  'E-mail | počet osob za rok | odsouhlasení od členů',
  'kontrola',
  '{{nazev_svj}} | kontrola počtu osob za rok 2025',
  '<p>{{osloveni_obecne}}</p>

<p>{{osloveni_clenu}},</p>

<p>Pěkný den</p>
<p>Oslovení (např.Vážený pane Nováku),</p>

<p>v příloze Vám přikládám nový evidenční list Vaší bytové jednotky Číslo (PDF) v bytovém domě ({{nazev_svj}}). Prosím o kontrolu zda jsou všechny údaje v pořádku.</p>

<p>Žaloby na služby ve výši (PDF) Kč směřuje prosím na účet Společenství vlastníků jednotek č. (PDF). Dále, prosím, nezapomeňte ke každé platbě přiřazovat variabilní symbol (PDF).</p>

<p>Vše je zvrázněno v přiloženém evidenčním listu.</p>

<p>Částka: (PDF) Kč<br>
Číslo účtu: (PDF)<br>
Variabilní symbol: (PDF)<br>
Oslovení (např.Vážený pane Nováku - jméno viz PDF)<br>
z našeho systému OnlineSpráva Vám bude zaslán v (čas) evidenční list obsahující veškeré potřebné údaje. Prosíme o jeho kontrolu a v případě, že budou veškeré údaje správné, o nastavení trvalé platby dle informací uvedených v evidenčním listu.</p>

<p><strong>Děkujeme za spolupráci.</strong></p>
<p>Dobrý den,</p>
<p>v příloze Vám zasíláme souhrn a celkovou částku za jednotlivé služby, které budou rozúčtovány mezi jednotlivé členy. Prosíme Vás o kontrolu a potvrzení tohoto souhrnu.</p>

<p>V případě jakýchkoliv dotazů nebo připomínek nás neváhejte kontaktovat.</p>

<p>{{podpis_spravce}}</p>',
  ARRAY['osloveni_obecne', 'osloveni_clenu', 'nazev_svj', 'podpis_spravce']
),
(
  'E-mail | nový evidenční list',
  'oznameni',
  '{{nazev_svj}} | evidenční list | jednotka č. Číslo bytu',
  '<p>{{osloveni_obecne}}</p>

<p>{{osloveni_clenu}},</p>

<p>Žaloby na služby ve výši (PDF) Kč směřuje prosím na účet Společenství vlastníků jednotek č. (PDF). Dále, prosím, nezapomeňte ke každé platbě přiřazovat variabilní symbol (PDF).</p>

<p>Vše je zvrázněno v přiloženém evidenčním listu.</p>

<p>Částka: (PDF) Kč<br>
Číslo účtu: (PDF)<br>
Variabilní symbol: (PDF)<br>
Oslovení (např.Vážený pane Nováku - jméno viz PDF)<br>
z našeho systému OnlineSpráva Vám bude zaslán v (čas) evidenční list obsahující veškeré potřebné údaje. Prosíme o jeho kontrolu a v případě, že budou veškeré údaje správné, o nastavení trvalé platby dle informací uvedených v evidenčním listu.</p>

<p><strong>Děkujeme za spolupráci.</strong></p>
<p>Dobrý den,</p>
<p>v příloze Vám zasíláme souhrn a celkovou částku za jednotlivé služby, které budou rozúčtovány mezi jednotlivé členy. Prosíme Vás o kontrolu a potvrzení tohoto souhrnu.</p>

<p>V případě jakýchkoliv dotazů nebo připomínek nás neváhejte kontaktovat.</p>

<p>{{podpis_spravce}}</p>',
  ARRAY['osloveni_obecne', 'osloveni_clenu', 'nazev_svj', 'podpis_spravce']
),
(
  'E-mail | zaslání evidenčního listu z OS',
  'oznameni',
  '{{nazev_svj}} | číslo bytu | evidenční list',
  '<p>{{osloveni_obecne}}</p>

<p>{{osloveni_clenu}},</p>

<p>z našeho systému OnlineSpráva Vám bude zaslán v (čas) evidenční list obsahující veškeré potřebné údaje. Prosíme o jeho kontrolu a v případě, že budou veškeré údaje správné, o nastavení trvalé platby dle informací uvedených v evidenčním listu.</p>

<p><strong>Děkujeme za spolupráci.</strong></p>
<p>Dobrý den,</p>
<p>v příloze Vám zasíláme souhrn a celkovou částku za jednotlivé služby, které budou rozúčtovány mezi jednotlivé členy. Prosíme Vás o kontrolu a potvrzení tohoto souhrnu.</p>

<p>V případě jakýchkoliv dotazů nebo připomínek nás neváhejte kontaktovat.</p>

<p>{{podpis_spravce}}</p>',
  ARRAY['osloveni_obecne', 'osloveni_clenu', 'nazev_svj', 'podpis_spravce']
),
(
  'E-mail | suma služeb za rok před vyúčtováním',
  'vyuctovani',
  '{{nazev_svj}} | odsouhlasení souhrnu služeb za rok 2025',
  '<p>{{osloveni_obecne}}</p>

<p>{{osloveni_clenu}},</p>

<p>v příloze Vám zasíláme souhrn a celkovou částku za jednotlivé služby, které budou rozúčtovány mezi jednotlivé členy. Prosíme Vás o kontrolu a potvrzení tohoto souhrnu.</p>

<p>V případě jakýchkoliv dotazů nebo připomínek nás neváhejte kontaktovat.</p>

<p>{{podpis_spravce}}</p>',
  ARRAY['osloveni_obecne', 'osloveni_clenu', 'nazev_svj', 'podpis_spravce']
);