# Example paper: Newtonian two-body orbits

A short worked-example paper shipped with the template. It recovers
established results for the two-body problem (the force law, Kepler-period
closure, energy conservation) using the `gravity` crate, to demonstrate the
stage-3 -> stage-4 -> paper workflow. It is not a research result; edit it
for your own work or delete the directory.

## Files

- `paper.tex` -- the paper source (article class, natbib).
- `references.bib` -- bibliography (Newton 1687; CODATA 2018; velocity-Verlet
  algorithm from Swope et al. 1982).

## Build

Needs a LaTeX toolchain. The lightest is Tectonic (single binary, downloads
TeX packages on first run):

    brew install tectonic            # macOS
    tectonic paper.tex               # produces paper.pdf

Or with a full TeX distribution (TeX Live / MacTeX):

    latexmk -pdf paper.tex

Build artifacts (`paper.pdf`, `*.aux`, `*.bbl`, ...) are git-ignored.
