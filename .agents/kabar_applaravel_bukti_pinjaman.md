From the unit-apps session (2026-10-22). A new column is needed on the shared table tb_capital_loans.

THE CHANGE: unit-apps lets kasir/stafkontrol/pusat/superuser add a capital loan from Dashboard Kasir → Pinjaman Modal. It mirrors your storeCapitalLoan:
- jenis is always pinjaman_modal;
- source pusat is allowed only with kasirpusat;
- the modal monthly lock applies.

The user requires a bukti transfer (proof of the incoming transfer) on every new loan.

MIGRATION REQUEST, in app_laravel:
- tb_capital_loans.bukti_path varchar(255) NULL, after notes.
- 2026_10_21_100000 is already on production, so this needs a NEW migration file. It becomes the new pending bundle.
- unit-apps stores the file with Unggahan::simpan(file, 'modal-pinjaman-bukti', 'bukti'), so the column holds the MinIO object path, the same format as tb_capital_loan_payments.bukti_path.
- Optional: show or upload the same bukti in the app_laravel new-loan form and drawer.

RELEASE: unit-apps code reads bukti_path on the Pinjaman Modal detail page, so it must not deploy before the migration runs on staging/prod. Please tell the unit-apps session when it is migrated.
