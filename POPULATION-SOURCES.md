# Published numbers checked 26 October 2026

## Planning estimates restored at owner request

Missing dorm and rental counts now use the original map's occupancy assumptions, explicitly marked `~` and “Planning estimate.” Published university enrollment and KSMU dorm values take priority. These estimates are not independently verified, and their restored use does not validate the original geographic pins.

Original estimated dorm residents: KSU 500 / 442 / 405; SWSU 422 / 384 / 365 / 338; KSAU 248 / 229 / 210 / 190 / 171. Original rental estimates: KSU 1,200 / 900; SWSU 3,200; KSMU 1,000 / 600; KSAU 700; Financial University 480. These are assumptions retained for planning, not derived from a current census.

International housing weights are retained when their sum fits the university enrollment reference. Otherwise, after reserving published international dorm counts, the remaining modeled weights are proportionally reduced and rounded by largest remainder. This is a consistency constraint across differently dated sources, not verification of where international students reside. No full-time counts or country distributions are invented for housing. CSV and JSON exports identify estimates explicitly.

The original enrollment, nationality percentages, rental counts and dorm estimates were not sourced. Enrollment and medical dorm occupancy now use the following published reference; other housing assumptions are restored as labeled estimates at the owner's request. These are published administrative counts, not a live October 2026 census or the number of people physically present at a mapped building.

## Comparable enrollment reference

The official **2025 monitoring cycle reports 2024 data**. Scope: bachelor, specialist and master programs; total includes all study modes. Vocational education, doctoral programs, residency and preparatory courses are outside this comparison. “International” is the published student classification, not ethnicity. Do not interpret everyone else as ethnically Russian.

| Institution | Enrollment, all modes | Full-time | International | Primary source |
| --- | ---: | ---: | ---: | --- |
| Kursk State University | 10,225 | 5,035 | 315 | [Official monitoring, indicators 1 and 30](https://monitoring.miccedu.ru/iam/2025/_vpo/inst.php?id=114) |
| Southwest State University | 11,207 | 5,936 | 846 | [Official monitoring](https://monitoring.miccedu.ru/iam/2025/_vpo/inst.php?id=113) |
| Kursk State Medical University | 6,650 | 6,650 | 1,756 | [Official monitoring](https://monitoring.miccedu.ru/iam/2025/_vpo/inst.php?id=1786) |
| Kursk State Agrarian University | 4,968 | 1,718 | 112 | [Official monitoring](https://monitoring.miccedu.ru/iam/2025/_vpo/inst.php?id=1674) |
| Financial University, Kursk branch | 597 | 306 | 17 | [Official monitoring](https://monitoring.miccedu.ru/iam/2025/_vpo/inst.php?id=10006960) |
| **Five-institution sum** | **33,647** | **19,645** | **3,046** | Arithmetic sum; not a citywide total |

The monitoring pages state an update date of 3 February 2026. This does not make the enrollment reporting period 2026. The [Kalmyk State University statistics office](https://kalmgu.ru/universitet/struktura-kalmgu/otdely/otdel-statotchyotnosti-i-analiza/) explicitly identifies the 2025 monitoring cycle as data for 2024.

## Newer reports, kept separate

- [KSMU 2025 self-assessment](https://vc.kurskmed.com/sveden/files/rip/Otchet_o_rezulytatax_samoobsledovaniya_2025.pdf), signed April 2026: printed p. 13 gives **6,546** bachelor/specialist/master students in 2025. Printed p. 48 separately gives **1,762 international learners at 31 December 2025**. The latter is not explicitly limited to the same degree population; do not divide it by 6,546 or silently merge it with the 2024 comparison.
- [SWSU announcement, 1 September 2025](https://swsu.ru/news/congratulations/svyshe_11000_studentov-_vklyuchaya_800_inostrantse/) describes **over 11,000 students including 800 international students**. This is a rounded announcement, not an exact replacement for the monitoring table. The undated international-office webpage shows another count, so it is not used to claim a current exact figure.
- [KSAU 2025 self-assessment](https://www.kursksau.ru/sveden/files/eij/Otchet_o_samoobsledovanii_2025_Kurskii_GAU.pdf), printed p. 24: headline **7,765 learners at 1 October 2025**, covering vocational and higher education. Listed categories are 3,838 bachelor, 905 master, 714 specialist, 2,159 vocational and 190 doctoral, summing to 7,806. This internal discrepancy and broader scope prevent treating 7,765 as a directly comparable replacement. The PDF fetch timed out; the indexed primary-source passage supplied these values.

## Actual medical-university dorm residents

KSMU 2025 self-assessment, printed p. 90 (PDF page 90), table 55, **at 1 January 2026**:

| Dorm | Address | All residents | International student residents |
| --- | --- | ---: | ---: |
| 1 | Karl Marx 3A | 172 | 0 |
| 2 | Karl Marx 3B | 333 | 0 |
| 3 | Yamskaya 16 | 509 | 0 |
| 4 | Karl Marx 69G | 513 | 496 |
| 5 | Akhtyrskaya 2 | 496 | 496 |
| 6 | Karl Marx 65B | 476 | 0 |
| **Total** | | **2,499** | **992** |

All-resident totals include staff/family members and postgraduate categories; they are not all undergraduates. Capacity, vacant beds and present-day occupancy were not established. Table text was read from the primary PDF; screenshot retrieval failed. These occupancy values do not verify building coordinates, so the pins remain withheld until geography is verified.

## Still unknown

Current October 2026 enrollment, occupancy in other universities' individual dorms, rental-cluster resident counts, and current country breakdowns have not been verified. Full-time housing and country breakdowns remain unavailable; unknown values are stored as `null` and shown as “Not verified,” rather than as zero. Published zero international residents in KSMU dorms 1, 2, 3 and 6 is retained as zero. No institution-wide nationality proportions are allocated to individual dormitories.

For the presentation: “These five universities report 33,647 degree students, including 3,046 international students, in the comparable 2024 reference published in the 2025 monitoring cycle. Later reports are shown separately. These are enrollment figures, not people currently present at the pins.”
