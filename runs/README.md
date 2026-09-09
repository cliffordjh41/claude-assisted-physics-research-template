# runs

Append-only log of `cargo test` / `cargo run` / `cargo bench`
invocations and their full output, one file per day, written
automatically by `.claude/hooks/run-log.py`.

This directory is what makes "output was seen" checkable after the
session that saw it has ended. A result cited as `pass` in a journal
entry or hypothesis file should be traceable to a run here, by date and
command. A result with no run behind it is `open`, whatever an earlier
session wrote about it.

Output is kept in full: a regime-shift check run later needs the raw
series, and re-running to recover discarded output is avoidable cost.
Nothing here is edited after the fact. A run that was wrong stays, and
the correction is a later run.
