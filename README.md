# kernxbau.de — Website KERNX BAU UG (haftungsbeschränkt)

Statische Website, ohne Build-Prozess, ohne Abhängigkeiten. Direkt auf GitHub Pages lauffähig.

---

## ⚠️ VOR DER VERÖFFENTLICHUNG AUSFÜLLEN

Alle Platzhalter stehen in **eckigen Klammern** und sind über alle Dateien identisch geschrieben.
Suchen und ersetzen (Groß-/Kleinschreibung beachten):

| Suchen | Ersetzen durch | Vorkommen in |
|---|---|---|
| `[Straße und Hausnummer]` | echte Straße + Hausnummer | alle Seiten (Footer, Kontakt, Impressum, Datenschutz) |
| `[PLZ]` | Postleitzahl | alle Seiten |
| `[Telefonnummer]` | Telefonnummer, **im `href="tel:"` ohne Leerzeichen**, z. B. `+4951112345678` | alle Seiten |
| `[USt-IdNr. eintragen]` | `DE…` | Impressum |
| `[instagram-handle]` | Instagram-Benutzername ohne `@` | alle Seiten |
| `[Hosting-Anbieter eintragen — z. B. GitHub Pages, GitHub Inc.]` | tatsächlicher Hoster | `datenschutz.html` |

**Wichtig zum Telefon:** Es gibt zwei Stellen je Vorkommen — den sichtbaren Text und das
`href="tel:…"`. Im `href` darf die Nummer keine Leerzeichen enthalten.

Ein unvollständiges Impressum ist in Deutschland abmahnfähig. Bitte vor dem Livegang prüfen.

### Ein Befehl für alles (Linux/macOS)

```bash
cd site
grep -rl '\[' --include='*.html' . | xargs sed -i \
  -e 's/\[Straße und Hausnummer\]/Musterstraße 1/g' \
  -e 's/\[PLZ\]/30xxx/g' \
  -e 's/\[Telefonnummer\]/+49 511 000000/g' \
  -e 's/\[USt-IdNr. eintragen\]/DE000000000/g' \
  -e 's/\[instagram-handle\]/kernxbau/g'
```

Danach die `tel:`-Links prüfen — dort muss die Nummer ohne Leerzeichen stehen.

---

## Seitenstruktur (8 Seiten + 2 Rechtstexte)

| Datei | Inhalt |
|---|---|
| `index.html` | Start: Video-Hero (Hannover), Inhaltsleiste, 6 Kapitel — Leistungen (8 Module), Arbeitsweise, Prinzipien, Eigenentwicklungen, Projekte, Marke |
| `leistungen.html` | Alle acht Module mit Detailblock, Unterpunkten und Abgrenzung |
| `kernx-live.html` | KERNX LIVE — Dokumentation in Echtzeit, Maskottchen, Problem/Lösung-Flow |
| `kernx-app.html` | KERNX APP — gezeichnete Oberfläche als SVG (`assets/img/app-dashboard.svg`), sechs Module, keine echten Zahlen |
| `kernx-3d.html` | KERNX 3D — **eigenes Designsystem** (Marineblau + Orange), eigene Produktsysteme, Galerie |
| `projekte.html` | Bildarchiv, 37 Aufnahmen, filterbar, mit Lightbox |
| `ueber-uns.html` | Unternehmen, Position, belegbare Daten, Haltung |
| `kontakt.html` | Kontaktdaten und Anfrageformular (mailto, ohne Server) |
| `impressum.html` | Angaben nach § 5 DDG |
| `datenschutz.html` | DSGVO-Erklärung, auf diese Website zugeschnitten |

---

## Design-System

Basis ist das Firmenlogo (Dunkelgrün + Gold). Zwei Geschäftsbereiche, zwei Akzentfarben:

| Rolle | Wert | Verwendung |
|---|---|---|
| Grundfläche | `#070B09` | tiefstes Anthrazit-Grün |
| Logo-Grün | `#123127` | Prinzipien-Bänder |
| **Gold** | `#C9A227` | **Tiefbau** — Buttons, Kicker, Trasse-Motiv |
| **Cyan** | `#49D6C4` | **3D-Dienstleistung** — nur auf der 3D-Seite und im Teaser |
| Hellzone | `#F6F5F1` | helle Abschnitte der 3D-Seite (setzt den Bereich bewusst ab) |

Schriften: **Space Grotesk** (Überschriften) und **Inter** (Text), über Google Fonts.
Möchtest du keine externen Dienste, lade beide Schriften lokal nach `assets/fonts/`
und streiche Abschnitt 5 der Datenschutzerklärung.

Markenelement **„Trasse"**: durchgezogene Goldlinie = ausgeführt, gestrichelt = offen
(CSS-Klasse `.trasse`).

---

## Animationen

Alle in reinem CSS/JS, ohne Bibliothek, und über `prefers-reduced-motion` abschaltbar:

- Hero-Zoom beim Laden
- Scroll-Progressbar oben
- Reveal-Einblendung aller Abschnitte
- Sticky-Ablauf-Story mit Bildwechsel, Ziffer und Fortschrittsbalken
- Horizontaler Fotostreifen, scrollgesteuert
- Zähler für Kennzahlen
- Galerie mit Filter, Lightbox, Tastatur- und Wischbedienung
- Ticker-Laufband

---

## Bilder

`assets/img/` — 41 Bauaufnahmen, 28 Aufnahmen aus der eigenen 3D-Fertigung, Marken-Assets
(KERNX BAU, KERNX LIVE, KERNX 3D) sowie `assets/vid/` mit drei stummen Endlosvideos,
je als **WebP** (modern) und **JPG** (Fallback) in **800 px** und **1280 px**.

Alle Bilder stammen aus eigenen Einsätzen. **Datums- und Ortseinblendungen wurden
oben abgeschnitten, Aufnahmen mit erkennbaren Gesichtern wurden nicht aufgenommen.**

Neues Bild ergänzen:

```bash
convert original.jpg -auto-orient -resize 1280x\> -strip -quality 82 assets/img/NAME-1280.webp
convert original.jpg -auto-orient -resize  800x\> -strip -quality 80 assets/img/NAME-800.jpg
convert original.jpg -auto-orient -resize  800x\> -strip -quality 82 assets/img/NAME-800.webp
```

Danach in `projekte.html` im `window.KERNX_GALLERY`-Array ergänzen:
`{"f":"NAME","t":"Bildtitel","c":"kategorie"}` — Kategorien: `erdkabel`, `leerrohr`,
`breitband`, `baugruben`, `verfuellung`, `dokumentation`, `logistik`, `team`.

---

## Veröffentlichen mit GitHub Pages

```bash
git init
git add .
git commit -m "Website KERNX BAU 2026"
git branch -M main
git remote add origin git@github.com:<konto>/<repo>.git
git push -u origin main
```

Dann im Repository: **Settings → Pages → Source: `main` / `root`**.

- `CNAME` enthält `kernxbau.de` — die Domain wird automatisch übernommen.
- `.nojekyll` verhindert die Jekyll-Verarbeitung.
- Beim Domain-Anbieter auf GitHub Pages zeigen lassen:
  `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  und `AAAA`/`CNAME` nach der aktuellen GitHub-Dokumentation.
- In **Settings → Pages** anschließend **„Enforce HTTPS"** aktivieren.

Bestehendes Repository: Inhalt ersetzen, `CNAME` und `.nojekyll` beibehalten.

---

## Formular

Das Anfrageformular arbeitet **ohne Server**: `assets/js/main.js` baut aus den Eingaben eine
`mailto:`-Nachricht und öffnet das E-Mail-Programm des Besuchers. Es werden keine Daten
gespeichert und keine Drittdienste eingebunden — deshalb ist die Datenschutzerklärung kurz.

Soll das Formular direkt versenden (Netlify Forms, Formspree oder eigenes Backend), muss
**Abschnitt 6.1 der Datenschutzerklärung entsprechend angepasst werden.**

---

## Technische Hinweise

- Geprüft in Chromium bei 1600 px und 390 px Breite: keine horizontalen Überläufe, keine
  JavaScript-Fehler, keine fehlenden Dateien.
- SEO: eigener `title` und `description` je Seite, Open-Graph-Tags, `canonical`,
  `sitemap.xml`, `robots.txt`.
- Barrierefreiheit: Sprungmarken, `aria-current`, `aria-label`, Fokus-Ringe,
  Tastaturbedienung der Lightbox, Alternativtexte an allen Bildern.
- Kein Framework, kein Build-Schritt, keine Cookies.

---

## Noch offen

1. Platzhalter ersetzen (siehe oben) — **blockiert den Livegang**.
2. Echte Aufnahmen aus der 3D-Fertigung: derzeit liegen fünf Produktbilder vor.
   Sobald der Ordner mit den eigenen 3D-Fotos bereitsteht, werden sie ergänzt.
3. Entscheidung Schriften: Google Fonts beibehalten oder lokal ausliefern.
4. Prüfen, ob eine eigene Marke für den 3D-Bereich geführt werden soll — dann erhält
   `kernx-3d.html` ein eigenes Logo — erledigt.


---

## Zwei Designsysteme

| | KERNX BAU | KERNX 3D |
|---|---|---|
| Datei | `assets/css/main.css` | `assets/css/3d.css` |
| Skript | `assets/js/main.js` | `assets/js/3d.js` |
| Grundfläche | `#070B09` Anthrazit-Grün | `#05080F` Marineblau |
| Akzent | Gold `#C9A227` | Orange `#F0873A` |
| Zweitfarbe | Cyan `#49D6C4` (KERNX LIVE) | Stahlblau `#8FA3C0` |
| Logo | grün/gold, Wortmarke + Bildmarke | eigenes 3D-Logo |

`kernx-3d.html` ist bewusst eine eigene Welt: eigenes Stylesheet, eigenes Skript, eigener
Bootvorgang, eigener Cursor und ein Partikelgitter im Hero. Nur Navigation und Footer
verweisen zurück auf KERNX BAU.

## Videos

`assets/vid/` — drei stumme, endlos laufende MP4 (zusammen unter 2 MB):

| Datei | Verwendung |
|---|---|
| `bau-hero.mp4` | Hintergrund im Hero der Startseite und im Videoblock |
| `3d-hero.mp4` | Hintergrund im Hero von `kernx-3d.html` |
| `3d-werkstatt.mp4` | Werkstattaufnahme im HUD-Rahmen auf `kernx-3d.html` |

Alle mit `muted loop playsinline` eingebunden — sie starten ohne Ton und ohne Klick.
Ein `poster`-Bild liegt jeweils daneben, falls Autoplay blockiert wird.

## ⚠️ Nicht verwendete Bilder — bewusst

Im Bildordner lagen Aufnahmen von **Pikachu (Pokémon)** und einem **Sauron-Helm
(Der Herr der Ringe)**. Diese Figuren sind urheber- und markenrechtlich geschützt.
Sie sind **nicht** in die Website aufgenommen worden.

Auf einer gewerblichen Seite wäre das ein abmahnfähiger Verstoß, und die Rechteinhaber
gehen in Deutschland aktiv dagegen vor. Dasselbe gilt für den Verkauf solcher Drucke.
Die eigenen Konstruktionen — Desk System, Werkstatt-System, die eigene Figurenserie,
Vasen und Objekte — tragen die Seite vollständig und gehören KERNX.


---

## Änderungen 16.09.2026

### Rechtlich bereinigt
Aus **allen** Seiten, dem Stylesheet und den Metadaten entfernt: **Tiefbau**,
**Entkernung**, **führend**, **Marktführer**, **operativ**, **lückenlos**.
Diese Begriffe sind vom eingetragenen Unternehmensgegenstand ausgeschlossen bzw.
als Werbebegriffe gesperrt. Ersatz: *Erdkabel-, Leerrohr- und Breitbandausbau*,
*Grabungsarbeiten*, *nicht erlaubnispflichtige Montage- und Demontagearbeiten*.

Prüfbefehl vor jedem Livegang:

```bash
grep -rniE 'tiefbau|entkernung|marktführer|lückenlos|pflasterarbeit' --include='*.html' --include='*.css' .
```
(Treffer auf „medienführend" sind unkritisch.)

Neu auf `ueber-uns.html`: Abschnitt **„Der Rahmen aus dem Vertrag"** — der eingetragene
Unternehmensgegenstand in neun Punkten plus ausdrückliche Negativliste.

Neu auf `kernx-3d.html`: Abschnitt **`#abgrenzung`** — konkrete Benennung von Produkt,
Werkstoff und Grenze nach dem Hinweis der Handwerkskammer Hannover (Ass. jur. Jens Kobelt):
Eine reine Negativformulierung genügt nicht, es muss benannt werden, *was* hergestellt wird
und *woraus*. Drei Spalten: gefertigte Produkte · verarbeitete Werkstoffe · ausgeschlossene
Bereiche (Bauwerke, Feinwerkmechanik, Industrieformen, sicherheitsrelevante Teile,
Medizinprodukte, geschützte Designs).

### Acht statt neun Leistungsmodule
„Aufmaß & Dokumentation" ist kein Modul mehr, sondern ein eigener Feature-Block auf der
Startseite mit Verweis auf KERNX LIVE — dadurch füllt das Raster sauber 4 × 2 ohne leere Zelle.

### Bilder
- **14 + 4 Aufnahmen** mit Datums-/Adresseinblendung wurden nachträglich beschnitten
  (`-gravity north -chop 0x24%` bzw. `0x30%`). Kontrolliert per OCR über drei
  Schwellwerte (52 %, 72 %, 88 %) in Kopf- und Fußband jedes Bildes — **keine Treffer mehr**.
- Entfernt: `logistik-container` (politisches Plakat im Bild) sowie drei Duplikate
  (`trasse-gehweg`, `trasse-wohngebiet`, `work-uebersicht`).
- Logos: `bau-wortmarke.png` („UG"), `bau-logo-scene.png`, `bau-logo-helm.png` und
  `3d-logo-alt.png` gelöscht. Neu: `mark-k.png` (freigestelltes K) und `logo-wort.png`.

Prüfbefehl für neue Bilder:

```bash
for th in 52 72 88; do
  convert BILD-800.jpg -gravity north -crop 100x28%+0+0 +repage -colorspace gray     -resize 300% -unsharp 0x1.2+1.5 -threshold ${th}% /tmp/c.jpg
  tesseract /tmp/c.jpg - --psm 11 | grep -iE '30[0-9]{3}|hannover|germany|202[0-9]'
done
```

### Videos
| Datei | Verwendung |
|---|---|
| `hannover-hero.mp4` | Hero der Startseite — Luftaufnahme Hannover mit Logo-Auflösung |
| `logo-reveal.mp4` | Hero `ueber-uns.html` |
| `logo-mark.mp4` | Markenband `index.html#marke` (`object-fit:contain`) |
| `baustelle.mp4` | Hero `kernx-live.html` |
| `3d-hero.mp4`, `3d-werkstatt.mp4` | `kernx-3d.html` |

### Kapitel-System — jeder Abschnitt eigene Farbe und Bewegung
`section[data-ch="01".."06"]` steuert Akzentfarbe, Hintergrundtextur und Einblendrichtung:

| Kapitel | Farbe | Hintergrund | Bewegung |
|---|---|---|---|
| 01 Leistungen | Gold | Lageplan-Raster | von unten |
| 02 Arbeitsweise | Cyan | diagonale Trassenlinien | von links |
| 03 Prinzipien | Waldgrün | Lichtkuppel | Skalierung |
| 04 Eigenentwicklungen | dreifarbige Kante | Punktraster | von unten, weiter |
| 05 Projekte | Grau | Filmkorn | kurz von unten |
| 06 Marke | Schwarz + Gold | Spotlight | Skalierung |

Dazu `.chno` (große Kapitelnummer), `.toc` (Inhaltsleiste oben) und `.rail`
(fixierte Kapitelleiste links ab 1281 px). Auf Unterseiten vergibt `main.js`
die Kapitel automatisch aus Kicker bzw. Überschrift.

### Navigationsmenü
Jede Eigenentwicklung hat eigene Farbe und eigenen Effekt:
KERNX LIVE cyan mit Radar-Ping · KERNX APP gold mit kippender Kachel ·
KERNX 3D orange mit Drehung im Raum. Einträge erscheinen gestaffelt.

---

## Änderungen 17.09.2026

### Firmendaten eingetragen — keine Platzhalter mehr
Übernommen von der bisherigen Seite kernxbau.de:

| Feld | Wert |
|---|---|
| Anschrift | Deisterstraße 30, 30449 Hannover |
| Telefon | +49 176 61389235 (`tel:+4917661389235`) |
| E-Mail | contact@kernxbau.de |
| Register | HRB 231210, Amtsgericht Hannover |
| Hosting (Datenschutz Ziffer 4) | GitHub Pages, GitHub Inc. |

**Bewusst weggelassen — rechtlich sauberer als ein Platzhalter:**

- **USt-IdNr.:** wurde noch nicht erteilt. § 5 Abs. 1 Nr. 6 DDG verlangt sie nur
  „soweit vorhanden". Das Feld ist deshalb aus dem Impressum entfernt, ersetzt durch den
  Satz, dass sie nach Erteilung ergänzt wird. **Niemals eine Nummer erfinden** — das wäre
  eine unrichtige Pflichtangabe.
- **Instagram:** kein veröffentlichtes Konto vorhanden. Alle Instagram-Links und -Icons sind
  entfernt statt auf ein leeres Profil zu verweisen.

Zur Anschrift: Deisterstraße 30 ist Wohn- und Geschäftsadresse. Sie ist als
**ladungsfähige Anschrift** nach § 5 DDG zwingend und steht ohnehin im Handelsregister —
sie lässt sich nicht weglassen. Wer sie nicht öffentlich zeigen will, braucht eine echte
Geschäftsadresse; ein reiner Postfach- oder Briefkastenservice genügt nicht.

### Drei verschiedene Einstiegs-Sequenzen
| Seite | Auftritt |
|---|---|
| `index.html` | **Vorhang** — Wortmarke, Markenversprechen, Goldlinie, fährt nach oben weg (`.curtain`) |
| `kernx-app.html` | **Terminal in Gold** — Verbindungsprotokoll mit hochzählenden Ziffern über wanderndem Raster (`.kboot--app`) |
| `kernx-live.html` | **Radar in Cyan** — Maskottchen mit pulsierenden Ringen, Statusliste zur Baustelle (`.kboot--live`) |
| `kernx-3d.html` | **Bootvorgang** — eigener Ablauf im 3D-Designsystem (unverändert) |

Alle vier respektieren `prefers-reduced-motion` und haben eine Notbremse nach ~5 s.
Wichtig: Die Overlays werden per JS an `document.body` gehängt — `main` erzeugt einen
eigenen Stapelkontext (`z-index:1`), sonst liegt der Header darüber.

### Bewegung auf allen Seiten
- Überschriften ziehen **wortweise** von unten ein (`.wsplit`, gestaffelt je 42 ms)
- **Lichtkegel** folgt dem Zeiger über Karten (`--mx`/`--my` + `radial-gradient`)
- **Magnetische Buttons** — folgen dem Zeiger leicht
- Bilder in Split- und Feature-Blöcken **atmen beim Scrollen** (Parallaxe)
- Funkeln-Glyphe (`I['spark']`) in Kicker und Inhaltsleiste, dreht sich langsam

### Bilder — endgültig aussortiert
Gelöscht: `aufmass-holz` (schlecht und doppelt verwendet), `leerrohr-verlegt`
(war ein Screenshot einer Bildübersicht, kein Foto), `logistik-container` (Parteiplakat
im Bild), `work-uebersicht` (Screenshot einer Foto-App), `trasse-gehweg` und
`trasse-wohngebiet` (Duplikate). Zusätzlich beschnitten: `messlatte-graben`,
`trasse-offen`, `graben-tiefe`, `hausanschluss-orange`, `kabel-detail`, `verfuellung`,
`aufmass-leerrohr`.

Ersetzt: Ablaufschritt 02 → `minibagger-strasse` (war identisch mit Modul L.05),
Ablaufschritt 04 → `messung-rohr`, Feature-Block und KERNX-APP-Hero → `laser-vermessung`.

**Vor jeder Lieferung prüfen:** kein Bild zweimal verwenden, keine Screenshots von
Bildübersichten, keine Plakate oder Logos Dritter im Bild.

---

## Bild- und Videoablage ab 17.09.2026

Alle Dateien wurden umbenannt und in Ordner sortiert. **Das vollständige Verzeichnis mit
Beschreibung und Fundort jedes Bildes steht in [`assets/BILDVERZEICHNIS.md`](assets/BILDVERZEICHNIS.md).**

```
assets/
  img/
    bau/     36 Baustellenaufnahmen, nach Leistung nummeriert (01–36)
    3d/      32 Aufnahmen aus der eigenen Fertigung (01–32)
    marke/   Logos, Maskottchen, Favicons
    ui/      App-Oberfläche, LIVE-Icons, Videoposter
  vid/       6 Videos, nach Reihenfolge nummeriert (01–06)
```

Schema: `<nr>-<bereich>-<inhalt>-<breite>.<format>`, z. B.
`bau/14-graben-gehweg-800.webp`. Die Nummer gibt die Reihenfolge innerhalb des Bereichs,
sodass eine alphabetische Dateiliste automatisch nach Leistung gruppiert ist.

**Dateinamen nicht ändern** — sie stehen in `build.py`, in `kernx-3d.html` und in den
Galerie-Arrays. Ein Bild wird ausgetauscht, indem die drei Varianten überschrieben werden.

Prüfbefehl nach jeder Umbenennung:

```bash
grep -rhoE 'assets/(img|vid)/[A-Za-z0-9/_.-]+\.(jpg|png|webp|svg|mp4)' *.html assets/css/*.css assets/js/*.js \
  | sort -u | while read r; do [ -f "$r" ] || echo "FEHLT: $r"; done
```
