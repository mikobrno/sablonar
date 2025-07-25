import { Property, EmailTemplate } from '../types';

export const properties: Property[] = [
  {
    property_id: 'svj_001',
    full_name: 'Dřevařská 851/4, Brno',
    short_name: 'Drevarska',
    salutation_general: 'Dobrý den,',
    svj_name_full: 'Společenství vlastníků jednotek Dřevařská 4, Brno',
    salutation_members: 'Vážení členové Společenství vlastníků jednotek Dřevařská 4',
    notes: 'Kontakt: p. Novák'
  },
  {
    property_id: 'svj_002',
    full_name: 'Koliště 15, Brno',
    short_name: 'Koliste',
    salutation_general: 'Dobrý den,',
    svj_name_full: 'Společenství vlastníků jednotek Koliště 15',
    salutation_members: 'Vážení členové SVJ Koliště 15',
    notes: 'Nová budova'
  },
  {
    property_id: 'svj_003',
    full_name: 'Vídeňská 125, Brno',
    short_name: 'Videnska',
    salutation_general: 'Dobrý den,',
    svj_name_full: 'Bytové družstvo Vídeňská 125',
    salutation_members: 'Vážení členové bytového družstva',
    notes: 'Historická budova'
  }
];

export const emailTemplates: EmailTemplate[] = [
  {
    template_id: 'tpl_water_high',
    template_name: 'E-mail o vysoké spotřebě vody',
    email_subject: '❗️ {{short_name}} - Upozornění na vysokou spotřebu vody',
    email_body: `<p>{{salutation_general}}</p>

<p>{{salutation_members}},</p>

<p>dovolte mi upozornit Vás na neobvykle vysokou spotřebu vody v budově {{full_name}} za poslední měsíc.</p>

<p>Spotřeba vzrostla oproti stejnému období minulého roku o více než 30%. Prosím, zkontrolujte:</p>

<ul>
<li>Možné úniky vody v bytech</li>
<li>Funkčnost všech uzávěrů</li>
<li>Stav společných rozvodů</li>
</ul>

<p>V případě zjištění problému mě prosím kontaktujte na tomto e-mailu.</p>

<p>Děkuji za pozornost a spolupráci.</p>

<p>S pozdravem,<br>
Správa {{svj_name_full}}</p>`
  },
  {
    template_id: 'tpl_heating_invoice',
    template_name: 'Vyúčtování nákladů na vytápění',
    email_subject: '🧾 {{short_name}} - Vyúčtování nákladů na vytápění',
    email_body: `<p>{{salutation_general}}</p>

<p>{{salutation_members}},</p>

<p>zasíláme Vám vyúčtování nákladů na vytápění pro budovu {{full_name}} za uplynulé období.</p>

<p><strong>Souhrnné informace:</strong></p>
<ul>
<li>Celkové náklady na vytápění: bude doplněno</li>
<li>Průměrná cena za m²: bude doplněno</li>
<li>Způsob rozdělení: dle podlahové plochy</li>
</ul>

<p>Detailní vyúčtování podle jednotlivých bytů naleznete v příloze tohoto e-mailu.</p>

<p>Případné dotazy směřujte na tento e-mail nebo telefonicky.</p>

<p>S pozdravem,<br>
Správa {{svj_name_full}}</p>`
  },
  {
    template_id: 'tpl_meeting_invitation',
    template_name: 'Pozvánka na schůzi vlastníků',
    email_subject: '📅 {{short_name}} - Pozvánka na schůzi vlastníků',
    email_body: `<p>{{salutation_general}}</p>

<p>{{salutation_members}},</p>

<p>tímto Vás zvu na řádnou schůzi {{svj_name_full}}, která se bude konat:</p>

<p><strong>Datum:</strong> [DOPLNIT DATUM]<br>
<strong>Čas:</strong> [DOPLNIT ČAS]<br>
<strong>Místo:</strong> {{full_name}}, společná místnost</p>

<p><strong>Program schůze:</strong></p>
<ol>
<li>Zahájení, prezence, volba předsednictva</li>
<li>Zpráva o hospodaření</li>
<li>Plán oprav a investic</li>
<li>Různé a diskuse</li>
<li>Závěr</li>
</ol>

<p>Prosím o potvrzení účasti odpovědí na tento e-mail.</p>

<p>Těším se na Vaši účast.</p>

<p>S pozdravem,<br>
Předseda {{svj_name_full}}</p>`
  }
];