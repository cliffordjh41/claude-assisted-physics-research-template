<!-- Volume 01. One entry appended per session at session end. -->

<!-- EXAMPLE entry below: a format reference, not a session record. It
     reflects the shipped gravity example. Write your first real entry above
     this comment, then delete the comment. One entry per session, five
     sentences or fewer, with artifact pointers; same-day entries get a
     letter suffix (a, b).

## 2026-05-27 — gravity crate: force law and Kepler orbit

Implemented Newton's force law and a velocity-Verlet Kepler-orbit integrator
in crates/gravity, exposed gravitational_force and orbit_path to the browser
through crates/lab-core, and rendered the system in the lab. Four tests pass
in release mode with output captured: the force law equals G to within
1e-25 N, the inverse-square ratio is 4, the circular-orbit closure drift is
2.07e-7 over one Kepler period, and the maximum relative specific-energy
drift is 9.6e-7. No new physical fact is claimed; the example recovers
established results to exercise the workflow.

- crates/gravity/src/lib.rs — force law and the Orbit integrator
- crates/gravity/tests/orbit.rs::energy_conserved_over_elliptical_orbit — energy conservation check
- papers/two-body-orbit/paper.tex — worked-example write-up
-->
