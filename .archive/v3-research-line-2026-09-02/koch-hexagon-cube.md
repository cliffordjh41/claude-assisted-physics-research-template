# koch-hexagon-cube

## 2026-08-20

Recorded from the conversation of 2026-08-20. The user's words are
reproduced as typed, including spelling, punctuation, ellipses and dashes.
Nothing in this section is the agent's. Ordering follows the conversation.

i'm a failed artist basically who thinks in metaphor and draws parallels - i
dont believe in coincidence and intuition as mystical as it may seem isn't
actually magic -- it's logical

there's a specific structure here -- in ephemeratory -- it's a the unique
fractal i created -- it was meant to be part of a greater structure that
we've not completed -- a coordinate system thats based off fractal
mathematics -- maybe it was the lattice -- its like a modified koch like
curve but bounded lattice -- this is something we'll look at in parallel --
there's more to it i'm just laying sound of the seeds

the idea was to reformulate as well the bi-cone spacetime model of
past/present/future with our unique structure

so -- more then anything id like to at least construct the bounded lattice
again without adding information to it -- though .. i want us to start with
.. a new hyper plane -- which would be tesselated hexagonal or triangled ..
like in that 3d sketch i shared

i started out of the blue becoming fascinated with the koch curve -- for a
long time -- i dont know why -- i built off it -- organized onto it -- ..
what i noticed .. and i understand the traditional definition of this -- but
the hexagon/cube .. yes isometric is an angle and illusion -- but if you look
at it you can see a coordinate transformation -- ... i think .. hmm there's a
very simple version of the ephemeratory structure .. it's here and i started
color coding it based of newtonian mixing -- so that's why i went gung hoe
thinking i saw underlying structures -- like how maybe electrons organize

that a cube stretched is actually a flat hexagon -- with 2 points sharing the
centroid .. it becomes 2 sided

its a modified cube with no volume

if we considered each section of the bounded lattice a set of bidirectional
"cones" which im just generalizing for explaination purposes -- we should be
able to set these bicones on multiple axials -- the geometry should allow use
to connect them perfectly -- right?

we'd use this bounded lattice as organizational to reformulate how we look at
multiple domains across the sciences -- using geometry as a base right?

i'm seeing equal parts maybe im wrong

we should use 360 as the 0 degree so we can reserve the value of 0 for the
apex

---

### Agent notes

#### Vocabulary contamination -- read this before trusting the order above

The agent introduced technical vocabulary during this conversation, and some
of it was introduced *before* the user stated the corresponding picture in
their own words. A later reader cannot assume the recorded text is
uncontaminated. Specifically:

Terms the agent supplied, unprompted, in the turn responding to
`Hexagon3D.tsx`: orthogonal projection along the cube body diagonal;
A2 root system; Necker cube; sp3 hybridization; graphene Brillouin zone;
Gosper island / flowsnake. In earlier turns the agent also supplied: causal
set theory and Malament's theorem; hierarchical lattices and the
Migdal-Kadanoff scheme; universality classes and the renormalization group;
face-centred cubic packing and the tetrahedral-octahedral honeycomb.

The consequence that matters: the user's lines "that a cube stretched is
actually a flat hexagon -- with 2 points sharing the centroid .. it becomes
2 sided" and "its a modified cube with no volume" were typed *after* the
agent had already printed a table showing two cube vertices landing on the
centroid under that projection. Those two lines cannot be treated as
independent arrivals at the picture.

What is demonstrably independent, because it predates this conversation on
disk: `apps/lab/.archive/lab-sketches-2026-07-03/Hexagon3D.tsx`, file dated
2026-05-24, in `/Users/cliff/Desktop/cliffordjh`. Its own comment block
already carries the six signed corners, the RGB/CMY assignment, the up/down
lift, the phrase "the bicone in volume", and the relation H = R*sqrt(2) with
tetra edge R*sqrt(3). None of that was supplied by the agent.

Likewise independent: the 3 x 4^N lattice, the Future/Past direction, and the
"Past = base + 180 degrees" rule, all of which exist in
`/Users/cliff/Desktop/ephemeratory` (`crates/lattice/`,
`crates/ephem-core/src/formulas.rs`).

#### Computations run this session, by the agent, output seen

These were produced with scratch Python during the conversation and are
reproduced in the crates as tests. They are recorded here as pointers, not as
claims about the sketch.

- Projecting the eight cube vertices along any of the four body diagonals
  puts exactly two vertices on the centroid and six on a regular hexagon:
  one distinct radius, six 60-degree gaps, for all four diagonals.
- The six split by coordinate sum into two triples of +1 and -1; both are
  equilateral.
- The lift in `Hexagon3D.tsx`, H = R*sqrt(2), gives a regular tetrahedron:
  all six edges equal R*sqrt(3).
- Regular tetrahedra do not tile space. Dihedral 70.528779 degrees;
  360 / dihedral = 5.104299; five around an edge leave a gap of 7.356103
  degrees.
- Eight tetrahedra and six octahedra close a vertex exactly:
  8 x 0.551286 + 6 x 1.359348 = 4*pi, residual 3.553e-15. Around an edge,
  2 x 70.528779 + 2 x 109.471221 = 360 exactly.
- From the Adam Issah article the user supplied (an IB Internal Assessment
  self-published on Medium, not peer-reviewed): the volume series
  sum(6^(n-1)/8^n, n>=1) = 1/2 exactly, so the custom 3D Koch snowflake has
  volume 3 x V_tetrahedron, which equals exactly the volume of the cube the
  starting tetrahedron is inscribed in (edge s/sqrt2). The agent has verified
  this identity but has NOT verified that the added tetrahedra tile that cube
  without overlap.
- The same article's surface-area accounting grows by exactly 3/2 per
  iteration and so diverges. The cube it converges to has finite surface
  area 3*s^2. The divergent count includes faces that end up interior; this
  discrepancy is unresolved and is not to be built on.
- `position_to_angle_deg` in `ephemeratory/crates/ephem-core/src/formulas.rs`
  is (n-1) x 360/(3 x 4^N), with Past = base + 180 mod 360. At iteration 0
  the step is 120 degrees, giving Future 1,2,3 at 0, 120, 240 and Past 1,2,3
  at 180, 300, 60 -- the same six angles, with the same sign split, as the
  corner table in `Hexagon.tsx`.

#### Decision taken this session, by the user

"we should use 360 as the 0 degree so we can reserve the value of 0 for the
apex." Applied only to the new `a2` crate, where angles run in (0, 360] and
the value 0 denotes the apex. The `bounded-lattice` crate is a faithful port
and still returns 0.0 for position 1 Future, matching the source on disk.

#### Open, not resolved here

- Whether the Koch 3 x 4^N count can serve as a coordinate system on a
  region. Four children of a Koch boundary segment do not partition their
  parent; seven children of a Gosper island do. Raised by the agent; not
  settled.
- What, if anything, the structure predicts. Nothing in this sketch is a
  claim, and no hypothesis file has been opened.
