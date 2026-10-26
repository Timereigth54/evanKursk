# Kursk prayer & outreach map

Public visitors can view the map and activity without an account. Leaders sign in to update independent prayer and visit statuses at each location. Data is stored in SQLite, with a history of changes; it is not browser-only storage. Clients refresh every 30 seconds. Conflicting leader updates are rejected so one leader cannot silently overwrite another.

## Run locally for the presentation

Requires Node.js 22.13 or later (tested with 24.16). No packages to install.

```powershell
$env:LEADER_PASSWORD = 'set-a-unique-secret-at-least-16-characters'
node server.mjs
```

Open http://localhost:3000. Share the leader password only with leaders. This version uses a shared leader password; it does not provide individual leader accounts or attribution. Restarting the server signs everyone out. Do not open the HTML directly: shared tracking needs the server.

```powershell
node --test
```

## Launch on a public host

Use a Node host with a persistent disk and HTTPS. Set:

- `LEADER_PASSWORD`: a unique secret, 16+ characters.
- `NODE_ENV=production`: enables secure cookies; requires HTTPS.
- `HOST=0.0.0.0`: when required by your host.
- `PORT`: the host-provided port.
- `PUBLIC_ORIGIN`: exact public origin, e.g. `https://map.example.org`, without a trailing slash.
- `DATA_DIR`: an absolute persistent disk directory.

Start command: `npm start`. GitHub Pages cannot run this server or enforce leader-only writes. Do not commit `.env`, passwords, or the `data` directory. Back up the database with SQLite's backup mechanism or stop the server before copying the entire data directory. Keep the existing original file in version control for review before replacing a live deployment.

## Presentation check

1. Open the public URL in a private window: no login required to view; editor is hidden.
2. Sign in as a leader in another window; save prayer and visit statuses.
3. Refresh the private window and verify the shared update.
4. Check mobile layout and map tiles on the presentation network.
5. Review `MAP-SOURCES.md` for location confidence and `POPULATION-SOURCES.md` for dated enrollment and occupancy figures. Enrollment is university-wide, not building attendance. Unverified dorm pins remain withheld; country distributions remain unavailable, and restored housing estimates are explicitly marked with ~.

The dashboard starts empty rather than inventing prayer or visit activity. Prayer completion and visit completion are independent. Planned visits require a date. No personal prayer notes are collected. All activity displayed here is publicly visible.

## External services

Leaflet CSS/JavaScript load from unpkg, screenshot export uses jsDelivr, and map tiles load from Esri. Internet access to those services is required. PNG export can depend on tile CORS; use a browser screenshot if blocked.
