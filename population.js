// Comparable reference: 2025 official monitoring, reporting 2024 data.
// Bachelor / specialist / master programs only, all study modes.
window.POPULATION = {
 ksu:{total:10225,foreign:315,fullTime:5035,source:'https://monitoring.miccedu.ru/iam/2025/_vpo/inst.php?id=114'},
 swsu:{total:11207,foreign:846,fullTime:5936,source:'https://monitoring.miccedu.ru/iam/2025/_vpo/inst.php?id=113'},
 ksmu:{total:6650,foreign:1756,fullTime:6650,source:'https://monitoring.miccedu.ru/iam/2025/_vpo/inst.php?id=1786',update:'The 2025 self-assessment reports 6,546 bachelor/specialist/master students in 2025 (p. 13), and separately 1,762 international learners at 31 Dec 2025 (p. 48). The international learner scope is broader; these figures are not combined into a new percentage.',updateSource:'https://vc.kurskmed.com/sveden/files/rip/Otchet_o_rezulytatax_samoobsledovaniya_2025.pdf'},
 ksaa:{total:4968,foreign:112,fullTime:1718,source:'https://monitoring.miccedu.ru/iam/2025/_vpo/inst.php?id=1674',update:'The 2025 self-assessment gives 7,765 learners across vocational and higher education at 1 Oct 2025 (p. 24). Its listed category counts sum to 7,806, so this broader total is not used in the comparable reference.',updateSource:'https://www.kursksau.ru/sveden/files/eij/Otchet_o_samoobsledovanii_2025_Kurskii_GAU.pdf'},
 fin:{total:597,foreign:17,fullTime:306,source:'https://monitoring.miccedu.ru/iam/2025/_vpo/inst.php?id=10006960'}
};
window.DORM_POPULATION = Object.fromEntries([172,333,509,513,496,476].map((total,i)=>[
 'ksmu-d'+(i+1),{total,foreign:[0,0,0,496,496,0][i],source:'https://vc.kurskmed.com/sveden/files/rip/Otchet_o_rezulytatax_samoobsledovaniya_2025.pdf',date:'1 Jan 2026',scope:'All residents, including staff/families; international count covers students only. Table 55, printed p. 90.'}
]));
// Restored planning assumptions from the original map: [residents, international weight].
// These are not measured occupancy. Published figures always take priority.
window.PLANNING_ESTIMATES = {
 'ksu-d1':[500,130],'ksu-d2':[442,118],'ksu-d3':[405,96],
 'swsu-d1':[422,132],'swsu-d2':[384,120],'swsu-d3':[365,108],'swsu-d4':[338,96],
 'ksaa-d1':[248,42],'ksaa-d2':[229,38],'ksaa-d3':[210,35],'ksaa-d4':[190,32],'ksaa-d5':[171,29],
 'ksu-c1':[1200,62],'ksu-c2':[900,44],'swsu-c5':[3200,294],
 'ksmu-c2':[1000,550],'ksmu-c3':[600,338],'ksaa-c4':[700,24],'fin-c1':[480,12]
};
