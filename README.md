# Incidenten Registratie V1
<!-- README.md // V1 -->

Operationeel portaal voor het registreren van scheepvaart-incidenten, beperkingen, stremmingen en storingen.

## Functionaliteit

- **Linker paneel**: Lijst met gebeurtenissen, gesorteerd per tabblad (Actueel / Planning / Historie)
- **Rechter paneel**: Detailweergave per gebeurtenis met samenvatting en processtappen
- **Processtappen**: WAAR (locatie), WAT (constatering), WIE (melder)
- **Locatiezoekopdracht**: Doorzoekbare dropdown via Rijkswaterstaat PDOK Locatieserver
- **Kaartpicker**: Interactieve kaart met RWS BRT Achtergrondkaart en vaarwegen WMS-laag
- **Nieuwe gebeurtenis**: Modal voor aanmaken van incidenten, beperkingen, stremmingen en storingen

## Technische stack

- React 18 + Vite
- Leaflet + React-Leaflet voor kaartweergave
- PDOK Locatieserver (Rijkswaterstaat) voor locatiezoeken
- RWS BRT Achtergrondkaart (grijstinten) als basistegel
- NWB Vaarwegen WMS-laag (Rijkswaterstaat)
- GitHub Pages via GitHub Actions

## Installatie

```bash
npm install
npm run dev
```

## Deployen

Push naar `main` → GitHub Actions bouwt en deployt automatisch naar GitHub Pages.

Stel in je repository in: **Settings → Pages → Source: GitHub Actions**

## Versie

V1 – eerste release
