# Launch audit — 26 October 2026

## Local findings and fixes

- Workspace initially contained only `Kursk-explorer.html`; no `.git` directory, remote, deployment configuration, backend, or authentication.
- Added public read APIs and server-enforced leader writes, origin checks, HTTP-only session cookies, login throttling, persistent SQLite storage, update conflict detection, and change history.
- Added four independent activity measures: current prayer, completed prayer, planned visits, completed visits; location filters, dated visits, public cards, and map popup statuses.
- Redesigned CSS for presentation and mobile use with larger typography, accessible focus states, readable cards, status colors, and separated map controls.
- Corrected population breakdown double-counting when campuses and residences are shown together, and a broken dorm pin reset lookup.
- Hid the old local-only calibration interface from the public launch UI. Geographic pin edits are not a shared leader feature in this release.

## Outstanding launch dependencies

- The supplied GitHub URL identifies a profile, not a repository. Network access to GitHub was blocked in this environment. No remote source, branch history, GitHub settings, or existing live site has been audited.
- A public host with Node, HTTPS, and a persistent disk must be configured. This workspace has no deployment credentials or known live domain.
- Owner must set a real leader password and enter real activity. No completion records have been fabricated.
- Five campus locations and four malls have now been compared with published map sources; see `MAP-SOURCES.md`. Financial University coordinates are approximate. Unverified dorm pins and schematic rental areas are withheld.
- Enrollment now uses the comparable official 2025 monitoring cycle (2024 data), with later reports identified separately. Six KSMU dorm occupancy figures use the 2025 self-assessment at 1 January 2026. Unsupported country allocations, other dorm estimates and rental counts have been removed; see `POPULATION-SOURCES.md`. Current October 2026 headcounts remain unverified.
- Automated server checks cover authorization, origin protection, validation, concurrency, public reads, and persistence. Visual browser and real network presentation checks remain necessary.

These changes prepare a deployable local application; they do not establish that the public site is live.

- At the owner's request, missing dorm and rental occupancy assumptions were restored as explicit planning estimates. Published figures take priority; estimated totals use ~ and exports include data quality. International housing weights are capped proportionally against the dated university reference. Map pins remain withheld where geography is unverified.
