From the unit-apps session (2026-10-21). The user has revised the capital-loan rules again. unit-apps implements them locally (uncommitted). app_laravel must match, because both apps read and write the same tables.

RULES
- Jasa is 2% of the sisa pokok at the start of the payment month, rounded UP to 1,000: 2,000,223 becomes 2,001,000. The formula is intdiv(sisa*2 + 99999, 100000) * 1000. The old rule rounded down to 100,000.
- Pusat has NO jasa. It used to be manual; now it is always 0.
- Grace period: in months 1-3 neither jasa nor pokok is due. Jasa is due from month 4 (monthDiff >= 3).
  - A loan still in grace that receives money is charged its 2% jasa anyway. It is not mandatory.
- Modal Awal follows the same jasa rule.

PAYMENT: one nominal covers ALL active loans of the branch, across all sources. One input is one slip. The split order:
  1. due jasa of Modal Awal
  2. due jasa of the other loans past grace, NEWEST first
  3. Modal Awal: jasa if it is in grace, then pokok
  4. pokok of the other loans past grace, oldest first
  5. the excess goes to loans still in grace, oldest first: jasa 2% first, then pokok
  If money remains after every sisa is covered, the payment is rejected.
- Pusat loans are included only when the person entering the payment has kasirpusat.

RE-SPLIT, needed in app_laravel PUT /tabungan/capital-loans/slip/{slip}
- Allow moving pokok/jasa between loans of DIFFERENT sources within one slip. Today it is limited to the same source.
- Allow stafkontrol to set the excess to 0, which lowers the slip total. Today the total is locked. Moving that excess to DO comes later, together with setoran_do.

ARREARS: TbCapitalLoan::hitungUlangTunggakanJasa must use the new jasa (ceil to 1,000, Pusat 0) and the same grace rule.

RELEASE: unchanged. unit-apps will not deploy until 2026_10_21_100000 has been migrated on staging and production. No new migration is needed.
