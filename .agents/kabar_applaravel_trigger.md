From the unit-apps session (2026-10-22). Lock triggers on transaction_loans break every loan write on LOCAL and STAGING because of their DEFINER.

The user hit this while locking in Rekap 1. The lock fails pending drops through `UPDATE transaction_loans`.

TRIGGERS: tl_kunci_before_insert, tl_kunci_before_update and tl_kunci_before_delete on transaction_loans. All three have DEFINER `ubmi_db`@`%` in every database.

FINDINGS (read-only, plus one rolled-back no-op UPDATE per environment):
- LOCAL: database ubmi_db on laravel-db; the app user is `laravel`. User `ubmi_db` does not exist there, so the error is 1449: "The user specified as a definer ('ubmi_db'@'%') does not exist".
- STAGING: database ubmi_test_db on shared-mariadb; the app user is `ubmi_test_db`. The definer `ubmi_db` exists but has no privileges on ubmi_test_db, so the error is 1142: "TRIGGER command denied to user 'ubmi_db'@'%' for table ubmi_test_db.transaction_loans". EVERY insert, update and delete of loans on staging currently fails.
- PRODUCTION: ubmi_db with user ubmi_db works. The test UPDATE succeeded and was rolled back.

Likely cause: the triggers came from a prod dump and kept the prod definer.

REQUEST: prepare the SQL that recreates the three triggers with the right definer. Use the same body as the app_laravel migration that defines them.
- local: DEFINER=`laravel`@`%`, or CURRENT_USER;
- staging: DEFINER=`ubmi_test_db`@`%`.

Do NOT grant the prod user ubmi_db privileges on ubmi_test_db. The user runs VPS changes himself, so hand him the exact SQL; do not run it on staging yourself.

Also check whether any other trigger, view or routine in ubmi_test_db or local has a ubmi_db definer.
